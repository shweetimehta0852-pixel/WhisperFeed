// Lace DApp Connector & Midnight Preprod Wallet Service
import { WalletAccount, MidnightNetworkId } from '../lib/midnight-types';

declare global {
  interface Window {
    midnight?: {
      mnLace?: {
        enable: () => Promise<{
          getPublicKey: () => Promise<string>;
          getAddress: () => Promise<string>;
          getBalance: () => Promise<{ tDust: string }>;
          getNetworkId: () => Promise<MidnightNetworkId>;
          submitTx: (txHex: string) => Promise<string>;
        }>;
        isEnabled: () => Promise<boolean>;
      };
    };
  }
}

class LaceWalletService {
  private currentAccount: WalletAccount | null = null;
  private isSimulated: boolean = false;
  private listeners: Array<(account: WalletAccount | null) => void> = [];

  constructor() {
    // Check if previous mock session was saved
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('whisperfeed_wallet_session');
      if (saved) {
        try {
          this.currentAccount = JSON.parse(saved);
        } catch (e) {
          // ignore
        }
      }
    }
  }

  public subscribe(callback: (account: WalletAccount | null) => void) {
    this.listeners.push(callback);
    callback(this.currentAccount);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.currentAccount));
    if (typeof window !== 'undefined') {
      if (this.currentAccount) {
        localStorage.setItem('whisperfeed_wallet_session', JSON.stringify(this.currentAccount));
      } else {
        localStorage.removeItem('whisperfeed_wallet_session');
      }
    }
  }

  public async isLaceAvailable(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    return !!window.midnight?.mnLace;
  }

  public async connect(preferSimulator: boolean = false): Promise<WalletAccount> {
    // 1. Try real Lace DApp connector if present and not explicitly forced simulator
    if (!preferSimulator && typeof window !== 'undefined' && window.midnight?.mnLace) {
      try {
        const api = await window.midnight.mnLace.enable();
        const address = await api.getAddress();
        const pubKey = await api.getPublicKey();
        const networkId = (await api.getNetworkId()) || 'preprod';
        const balance = await api.getBalance();

        this.isSimulated = false;
        this.currentAccount = {
          address: address || `mn1_${pubKey.slice(0, 16)}...`,
          publicKey: pubKey,
          networkId: networkId,
          balanceTdust: BigInt(balance?.tDust || '5000000000'),
          isConnected: true,
        };
        this.notify();
        return this.currentAccount;
      } catch (err) {
        console.warn('Lace connector connection failed, falling back to simulated preprod account:', err);
      }
    }

    // 2. Fallback to Preprod Developer Identity Simulator
    this.isSimulated = true;
    const randomEntropy = Math.random().toString(16).substring(2, 10);
    this.currentAccount = {
      address: `mn1_preprod_${randomEntropy}9x4k`,
      publicKey: `0x3a9f84b12c8e${randomEntropy}0042d76fba98e3b1c09938f90e8a743126`,
      networkId: 'preprod',
      balanceTdust: 250_000_000_000n, // 250 tDUST
      isConnected: true,
    };

    this.notify();
    return this.currentAccount;
  }

  public async disconnect(): Promise<void> {
    this.currentAccount = null;
    this.notify();
  }

  public getAccount(): WalletAccount | null {
    return this.currentAccount;
  }

  public isUsingSimulator(): boolean {
    return this.isSimulated;
  }
}

export const laceWallet = new LaceWalletService();
