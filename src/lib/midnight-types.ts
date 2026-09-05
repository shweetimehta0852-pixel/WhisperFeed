// Type definitions for Midnight Network, Lace DApp Connector, and WhisperFeed Protocol

export type MidnightNetworkId = 'preprod' | 'testnet' | 'mainnet' | 'local-simulator';

export interface WalletAccount {
  address: string;
  networkId: MidnightNetworkId;
  publicKey: string;
  balanceTdust: bigint;
  isConnected: boolean;
}

export interface SubmissionWitnessInput {
  participantSecretKey: string;     // Hex 32-byte secret entropy
  surveyAuthToken: string;          // Authorization token hash or invite credential
  confidentialScore: number;         // Rating (1 - 10)
  feedbackText: string;              // Confidential whistleblowing / review payload
  feedbackHash?: string;             // SHA-256 hash
}

export interface PublicLedgerState {
  contractAddress: string;
  surveyId: string;
  surveyTitle: string;
  organizerPubKey: string;
  isActive: boolean;
  submissionCount: number;
  aggregateScoreSum: number;
  averageScore: number;
  targetThreshold: number;
  thresholdReached: boolean;
  titleHash: string;
}

export interface SubmissionRecord {
  id: string;
  txHash: string;
  nullifier: string;
  timestamp: number;
  surveyId: string;
  blockHeight: number;
  scoreDisclosed: number;
  status: 'verified' | 'pending' | 'rejected';
  gasFee: string;
}

export interface ZKProofStep {
  step: number;
  title: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  timeMs?: number;
}
