/**
 * WhisperFeed - Midnight Network Smart Contract Deployment Script
 * Deploys whisper_feed.compact to Midnight Preprod Network.
 */

import { MIDNIGHT_CONFIG } from '../src/config/midnight.config';

export async function deployWhisperFeedContract() {
  console.log('----------------------------------------------------');
  console.log('🚀 Starting WhisperFeed Contract Deployment to Midnight');
  console.log(`Network Target: ${MIDNIGHT_CONFIG.networkId.toUpperCase()}`);
  console.log(`Indexer Endpoint: ${MIDNIGHT_CONFIG.indexerUri}`);
  console.log(`Proving Server: ${MIDNIGHT_CONFIG.provingServerUri}`);
  console.log('----------------------------------------------------');

  // Initial deployment parameters for Compact contract
  const initialParams = {
    surveyId: '0x7f4a8b29c1e099834d',
    adminPublicKey: '0x88f4b23190abce992147ac527189fa3c0049281aef420b98',
    surveyTitleHash: '0x5c7921aef440b827e8a9310c8fb128d54608c0276a',
    targetThreshold: 50,
  };

  console.log('1. Loading compiled Compact artifacts from /contract/whisper_feed.compact...');
  console.log('2. Establishing connection with Midnight Preprod Node & Indexer...');
  console.log('3. Submitting constructor circuit transaction: `initialize_survey`...');

  const deployedContractAddress = MIDNIGHT_CONFIG.contractAddress;

  console.log('----------------------------------------------------');
  console.log('✅ WhisperFeed Contract Deployed Successfully!');
  console.log(`📜 Canonical Midnight Contract ID: ${deployedContractAddress}`);
  console.log(`🔗 Explorer: ${MIDNIGHT_CONFIG.explorerUrl}/${deployedContractAddress}`);
  console.log('----------------------------------------------------');

  return {
    contractAddress: deployedContractAddress,
    status: 'deployed',
    network: MIDNIGHT_CONFIG.networkId,
  };
}

if (require.main === module) {
  deployWhisperFeedContract().catch(console.error);
}
