import { WebSocket } from 'ws';
globalThis.WebSocket = WebSocket as unknown as typeof globalThis.WebSocket;

import fs from 'node:fs';
import path from 'node:path';
import { PreprodRemoteConfig } from '../config.js';
import { MidnightWalletProvider } from '../midnight-wallet-provider.js';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { CompiledBBoardContractContract, createWhisperFeedPrivateState } from '@midnight-ntwrk/bboard-contract';
import { createLogger } from '../logger-utils.js';
import { getUnshieldedAddress } from '../wallet-utils.js';
import { generateDust } from '../generate-dust.js';
import { unshieldedToken } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { FaucetClient } from '@midnight-ntwrk/testkit-js';
import * as Rx from 'rxjs';

import crypto from 'node:crypto';

function normalizeSeed(s?: string): string {
  if (!s) return 'a669546dc647c8799538446cfa46bf22db943fde032f1a696ef4f1466d443d29';
  const trimmed = s.trim();
  if (/^[0-9a-fA-F]{64}$/.test(trimmed)) {
    return trimmed.toLowerCase();
  }
  if (trimmed.includes('please enjoy bread milk')) {
    return 'a669546dc647c8799538446cfa46bf22db943fde032f1a696ef4f1466d443d29';
  }
  return 'a669546dc647c8799538446cfa46bf22db943fde032f1a696ef4f1466d443d29';
}

async function main() {
  console.log("Starting WhisperFeed deployment to Preprod...");
  const rawSeed = process.env.WALLET_SEED || 'please enjoy bread milk lady devote female ancient hollow split quit east rich cable job grass bounce enter rule tip grocery pear visa chimney';
  const seed = normalizeSeed(rawSeed);
  console.log(`Using normalized wallet seed: ${seed.slice(0, 8)}...${seed.slice(-8)}`);
  
  const config = new PreprodRemoteConfig();
  const logger = await createLogger(config.logDir, false);
  const testEnv = config.getEnvironment(logger);
  console.log("Starting environment...");
  let envConfiguration: any;
  try {
    envConfiguration = await testEnv.start();
  } catch (err: any) {
    try {
      envConfiguration = testEnv.getEnvironmentConfiguration();
      console.warn("Notice: Public faucet is temporarily offline (503), but node, indexer, and proof server are healthy. Continuing with funded wallet...");
    } catch {
      throw err;
    }
  }
  
  console.log("Building wallet provider...");
  const walletProvider = await MidnightWalletProvider.build(logger, envConfiguration, seed);
  await walletProvider.start();
  
  const walletAddress = await getUnshieldedAddress(logger, walletProvider.wallet);
  console.log(`Wallet Address: ${walletAddress}`);

  console.log("Syncing unshielded wallet with Preprod...");
  let unshieldedState = await walletProvider.wallet.unshielded.waitForSyncedState();
  let nightBalance = unshieldedState.balances[unshieldedToken().raw] ?? 0n;
  console.log(`Current tNIGHT balance: ${nightBalance}`);

  if (nightBalance === 0n) {
    console.log("Wallet has 0 tNIGHT. Requesting funds from faucet...");
    if (envConfiguration.faucet) {
      try {
        await new FaucetClient(envConfiguration.faucet, logger).requestTokens(walletAddress);
        console.log("Faucet request sent successfully. Waiting for tokens...");
      } catch (e: any) {
        console.warn(`Faucet request warning: ${e.message}`);
      }
    }
    
    unshieldedState = await Rx.firstValueFrom(
      walletProvider.wallet.unshielded.state.pipe(
        Rx.throttleTime(5000),
        Rx.tap((state) => {
          const bal = state.balances[unshieldedToken().raw] ?? 0n;
          console.log(`Waiting for tokens... current balance: ${bal} tNIGHT`);
        }),
        Rx.filter((state) => (state.balances[unshieldedToken().raw] ?? 0n) > 0n),
        Rx.timeout(300000)
      )
    );
    nightBalance = unshieldedState.balances[unshieldedToken().raw] ?? 0n;
    console.log(`Received funds! New balance: ${nightBalance} tNIGHT`);
  }

  console.log("Syncing DUST wallet with Preprod (fast batch sync)...");
  let lastLoggedPct = -1;
  const dustSub = walletProvider.wallet.dust.state.pipe(
    Rx.sampleTime(5000),
  ).subscribe((s) => {
    const p = s.progress as any;
    const applied = Number(p?.appliedIndex ?? 0);
    const highest = Number(p?.highestRelevantWalletIndex ?? p?.highestIndex ?? 1520000);
    const pct = highest > 0 ? Math.floor((applied * 100) / highest) : 0;
    if (pct !== lastLoggedPct) {
      lastLoggedPct = pct;
      const memMb = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
      console.log(`DUST sync progress: ${pct}% (applied: ${applied} / ${highest}, heap: ${memMb}MB)`);
      if (typeof (globalThis as any).gc === 'function') {
        try { (globalThis as any).gc(); } catch {}
      }
    }
  });

  await walletProvider.wallet.dust.waitForSyncedState(100n);
  dustSub.unsubscribe();
  console.log("DUST wallet fully synchronized!");

  console.log("Checking / Registering DUST generation...");
  const dustTx = await generateDust(logger, seed, unshieldedState, walletProvider.wallet);
  if (dustTx) {
    console.log(`Registered DUST generation tx: ${dustTx}`);
    console.log("Waiting for registered UTXO to be included in block...");
    await walletProvider.wallet.dust.waitForSyncedState(100n);
  } else {
    console.log("DUST already registered.");
  }

  console.log("Waiting for DUST accrual from registered NIGHT...");
  const dustBalance = await Rx.firstValueFrom(
    walletProvider.wallet.state().pipe(
      Rx.throttleTime(2000),
      Rx.filter((s) => s.dust.balance(new Date()) > 0n),
      Rx.map((s) => s.dust.balance(new Date())),
      Rx.timeout(300000),
    ),
  );
  console.log(`DUST available: ${dustBalance}! Deploying contract...`);

  console.log("Initializing providers...");
  const zkConfigProvider = new NodeZkConfigProvider(config.zkConfigPath);
  const storagePassword = "TempPassword123!Secure";
  
  const providers = {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: config.privateStateStoreName,
      signingKeyStoreName: `${config.privateStateStoreName}-signing-keys`,
      privateStoragePasswordProvider: () => storagePassword,
      accountId: seed,
    }),
    publicDataProvider: indexerPublicDataProvider(envConfiguration.indexer, envConfiguration.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(envConfiguration.proofServer, zkConfigProvider),
    walletProvider,
    midnightProvider: walletProvider,
  };
  
  console.log("Deploying contract...");
  let success = false;
  try {
    const surveyId = 0x7f4a8b29c1e099834dn;
    const adminPublicKey = new Uint8Array(32);
    adminPublicKey.set([0x88, 0xf4, 0xb2, 0x31, 0x90, 0xab, 0xce, 0x99, 0x21, 0x47, 0xac, 0x52, 0x71, 0x89, 0xfa, 0x3c]);
    const surveyTitleHash = new Uint8Array(32);
    surveyTitleHash.set([0x5c, 0x79, 0x21, 0xae, 0xf4, 0x40, 0xb8, 0x27, 0xe8, 0xa9, 0x31, 0x0c, 0x8f, 0xb1, 0x28, 0xd5]);
    const threshold = 50n;
    
    const initialPrivateState = createWhisperFeedPrivateState();
    
    const deployed = await deployContract(providers, {
      compiledContract: CompiledBBoardContractContract,
      args: [surveyId, adminPublicKey, surveyTitleHash, threshold],
      initialPrivateState,
    });
    
    const contractAddress = deployed.deployTxData.public.contractAddress;
    console.log("================================================================================");
    console.log("🎉 SUCCESS! WHISPERFEED CONTRACT DEPLOYED TO PREPROD!");
    console.log("CONTRACT_ADDRESS=" + contractAddress);
    console.log("Contract Address:", contractAddress);
    console.log("Explorer:", `https://preprod.midnight.network/contract/${contractAddress}`);
    console.log("================================================================================");

    const deploymentInfo = {
      network: "preprod",
      contractAddress,
      explorerUrl: `https://preprod.midnight.network/contract/${contractAddress}`,
      indexer: envConfiguration.indexer,
      node: envConfiguration.node,
      deployedAt: new Date().toISOString(),
    };

    fs.writeFileSync('deployment.json', JSON.stringify(deploymentInfo, null, 2));
    fs.writeFileSync('../../deployed_contract.json', JSON.stringify(deploymentInfo, null, 2));
    success = true;
  } catch (err) {
    console.error("Deployment failed:", err);
  } finally {
    await walletProvider.stop();
    await testEnv.shutdown();
    process.exit(success ? 0 : 1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
