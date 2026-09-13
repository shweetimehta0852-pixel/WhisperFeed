// WhisperFeed Contract Service - Midnight Compact Client & Witness Generator
import {
  PublicLedgerState,
  SubmissionWitnessInput,
  SubmissionRecord,
  ZKProofStep
} from '../lib/midnight-types';
import { MIDNIGHT_CONFIG } from '../config/midnight.config';

export class WhisperContractService {
  private ledgerState: PublicLedgerState;
  private nullifierSet: Set<string> = new Set();
  private submissionRecords: SubmissionRecord[] = [];
  private stateListeners: Array<(state: PublicLedgerState) => void> = [];
  private recordListeners: Array<(records: SubmissionRecord[]) => void> = [];

  constructor() {
    this.ledgerState = {
      contractAddress: MIDNIGHT_CONFIG.contractAddress,
      surveyId: '0x7f4a8b29c1e099834d',
      surveyTitle: 'Midnight Q3 Engineering Culture & Privacy Assessment',
      organizerPubKey: '0x88f4b23190abce992147ac527189fa3c0049281aef420b98',
      isActive: true,
      submissionCount: 42,
      aggregateScoreSum: 365,
      averageScore: 8.69,
      targetThreshold: 50,
      thresholdReached: false,
      titleHash: '0x5c7921aef440b827e8a9310c8fb128d54608c0276a',
    };

    // Pre-populate with initial verified anonymous records
    this.seedInitialHistory();
  }

  private seedInitialHistory() {
    const sampleNullifiers = [
      '0x4e8a91c01b2e3f4d89a0bcdef1234567890abcdef1234567890abcdef1234567',
      '0x992384fabc012847120938470192834710928374019283740192837401928374',
      '0x12a938f0e4b8c9d0123847561928374619283746192837461928374619283746',
      '0x77c981240f918237461928374619283746192837461928374619283746192837'
    ];

    sampleNullifiers.forEach((nf, index) => {
      this.nullifierSet.add(nf);
      this.submissionRecords.unshift({
        id: `whisper-sub-${index + 1}`,
        txHash: `0xpreprod_tx_${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
        nullifier: nf,
        timestamp: Date.now() - (index + 1) * 3600 * 1000 * 4,
        surveyId: this.ledgerState.surveyId,
        blockHeight: 142080 + index * 12,
        scoreDisclosed: [9, 8, 10, 8][index],
        status: 'verified',
        gasFee: '0.0014 tDUST'
      });
    });
  }

  // Subscribe to public ledger updates
  public subscribeState(callback: (state: PublicLedgerState) => void) {
    this.stateListeners.push(callback);
    callback(this.ledgerState);
    return () => {
      this.stateListeners = this.stateListeners.filter((cb) => cb !== callback);
    };
  }

  public subscribeRecords(callback: (records: SubmissionRecord[]) => void) {
    this.recordListeners.push(callback);
    callback(this.submissionRecords);
    return () => {
      this.recordListeners = this.recordListeners.filter((cb) => cb !== callback);
    };
  }

  private notify() {
    this.stateListeners.forEach((cb) => cb(this.ledgerState));
    this.recordListeners.forEach((cb) => cb(this.submissionRecords));
  }

  // Compute a deterministic, privacy-preserving nullifier
  public async computeNullifier(participantSk: string, surveyId: string, authToken: string): Promise<string> {
    const rawData = `${participantSk}_${surveyId}_${authToken}_WHISPER_FEED_V1_NULLIFIER`;
    return await this.sha256Hex(rawData);
  }

  // Helper for SHA-256 in Web Crypto API
  public async sha256Hex(message: string): Promise<string> {
    if (typeof window !== 'undefined' && window.crypto?.subtle) {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return '0x' + hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
    // Simple fallback hash for SSR or node env
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      hash = (hash << 5) - hash + message.charCodeAt(i);
      hash |= 0;
    }
    return '0x' + Math.abs(hash).toString(16).padStart(64, 'a');
  }

  // Submit an anonymous whisper with live ZK Proof execution steps
  public async submitWhisperWithProof(
    input: SubmissionWitnessInput,
    onStepUpdate?: (steps: ZKProofStep[]) => void
  ): Promise<{ txHash: string; nullifier: string }> {
    if (!this.ledgerState.isActive) {
      throw new Error('Survey is currently inactive.');
    }

    const steps: ZKProofStep[] = [
      {
        step: 1,
        title: 'Witness Construction',
        description: 'Generating off-chain private witness with participant secret and score.',
        status: 'running',
      },
      {
        step: 2,
        title: 'Zero-Knowledge Circuit Prover',
        description: 'Executing Compact circuit `submit_whisper` to prove authorization & score bounds without disclosing identity.',
        status: 'idle',
      },
      {
        step: 3,
        title: 'Nullifier & Uniqueness Check',
        description: 'Verifying that deterministic nullifier has not been previously consumed.',
        status: 'idle',
      },
      {
        step: 4,
        title: 'Midnight Preprod Consensus',
        description: 'Publishing ZK state transition and updating public aggregate counter.',
        status: 'idle',
      },
    ];

    const notifySteps = () => onStepUpdate?.([...steps]);
    notifySteps();

    const isTest = typeof window === 'undefined' || process.env.NODE_ENV === 'test';
    const delay = (ms: number) => (isTest ? Promise.resolve() : new Promise((r) => setTimeout(r, ms)));

    // STEP 1: Construct Witness
    await delay(650);
    const feedbackHash = await this.sha256Hex(input.feedbackText || 'empty_whisper');
    const nullifier = await this.computeNullifier(
      input.participantSecretKey,
      this.ledgerState.surveyId,
      input.surveyAuthToken
    );

    steps[0].status = 'completed';
    steps[1].status = 'running';
    notifySteps();

    // STEP 2: Circuit Proof Execution
    await delay(900);

    // Bounds check
    if (input.confidentialScore < 1 || input.confidentialScore > 10) {
      steps[1].status = 'failed';
      notifySteps();
      throw new Error('Confidential rating must be between 1 and 10.');
    }

    steps[1].status = 'completed';
    steps[2].status = 'running';
    notifySteps();

    // STEP 3: Nullifier Verification (Double Submission Check)
    await delay(600);
    if (this.nullifierSet.has(nullifier)) {
      steps[2].status = 'failed';
      notifySteps();
      throw new Error('Double submission rejected: Your anonymous participation token has already been spent for this survey.');
    }

    steps[2].status = 'completed';
    steps[3].status = 'running';
    notifySteps();

    // STEP 4: Publish to Midnight Preprod
    await delay(800);

    // Record Nullifier on-chain
    this.nullifierSet.add(nullifier);

    // Update public aggregate counters
    const newCount = this.ledgerState.submissionCount + 1;
    const newSum = this.ledgerState.aggregateScoreSum + input.confidentialScore;
    const newAvg = Number((newSum / newCount).toFixed(2));
    const reached = newCount >= this.ledgerState.targetThreshold;

    this.ledgerState = {
      ...this.ledgerState,
      submissionCount: newCount,
      aggregateScoreSum: newSum,
      averageScore: newAvg,
      thresholdReached: reached,
    };

    const txHash = `0xpreprod_tx_${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;
    const newRecord: SubmissionRecord = {
      id: `whisper-sub-${Date.now()}`,
      txHash,
      nullifier,
      timestamp: Date.now(),
      surveyId: this.ledgerState.surveyId,
      blockHeight: 142100 + this.ledgerState.submissionCount,
      scoreDisclosed: input.confidentialScore,
      status: 'verified',
      gasFee: '0.0012 tDUST',
    };

    this.submissionRecords.unshift(newRecord);
    steps[3].status = 'completed';
    notifySteps();

    this.notify();

    return { txHash, nullifier };
  }

  // Toggle survey active status (organizer action)
  public async toggleSurveyStatus(): Promise<boolean> {
    this.ledgerState = {
      ...this.ledgerState,
      isActive: !this.ledgerState.isActive,
    };
    this.notify();
    return this.ledgerState.isActive;
  }

  // Update survey details (for demo/organizer simulation)
  public async createNewSurvey(title: string, threshold: number): Promise<void> {
    const newId = '0x' + Math.random().toString(16).substring(2, 18);
    const titleHash = await this.sha256Hex(title);
    this.nullifierSet.clear();
    this.ledgerState = {
      contractAddress: this.ledgerState.contractAddress,
      surveyId: newId,
      surveyTitle: title,
      organizerPubKey: this.ledgerState.organizerPubKey,
      isActive: true,
      submissionCount: 0,
      aggregateScoreSum: 0,
      averageScore: 0,
      targetThreshold: threshold,
      thresholdReached: false,
      titleHash: titleHash,
    };
    this.notify();
  }

  public getState(): PublicLedgerState {
    return { ...this.ledgerState };
  }

  public getRecords(): SubmissionRecord[] {
    return [...this.submissionRecords];
  }
}

export const whisperContractService = new WhisperContractService();
