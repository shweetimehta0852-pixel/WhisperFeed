import { describe, it, expect, beforeEach } from 'vitest';
import { WhisperContractService } from '../src/services/whisperContractService';
import { SubmissionWitnessInput } from '../src/lib/midnight-types';

describe('WhisperFeed Protocol & Compact Contract Logic Suite', () => {
  let contractService: WhisperContractService;

  beforeEach(() => {
    contractService = new WhisperContractService();
  });

  it('Test 1: should successfully construct witness, compute nullifier, and increment public aggregate counters', async () => {
    const initialState = contractService.getState();
    const initialSubmissions = initialState.submissionCount;
    const initialSum = initialState.aggregateScoreSum;

    const testInput: SubmissionWitnessInput = {
      participantSecretKey: '0x11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff',
      surveyAuthToken: '0xaabbccddeeff00112233445566778899aabbccddeeff00112233445566778899',
      confidentialScore: 10,
      feedbackText: 'Superb engineering culture and robust privacy architecture on Midnight!',
    };

    const result = await contractService.submitWhisperWithProof(testInput);

    expect(result.txHash).toBeDefined();
    expect(result.nullifier).toMatch(/^0x[a-f0-9]{64}$/i);

    const updatedState = contractService.getState();
    expect(updatedState.submissionCount).toBe(initialSubmissions + 1);
    expect(updatedState.aggregateScoreSum).toBe(initialSum + 10);

    const records = contractService.getRecords();
    const latestRecord = records[0];
    expect(latestRecord.nullifier).toBe(result.nullifier);
    expect(latestRecord.status).toBe('verified');
  });

  it('Test 2: should reject double-submission using the same participant secret key & nullifier', async () => {
    const testInput: SubmissionWitnessInput = {
      participantSecretKey: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
      surveyAuthToken: '0x0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20',
      confidentialScore: 8,
      feedbackText: 'First anonymous submission.',
    };

    // First submission must succeed
    const firstResult = await contractService.submitWhisperWithProof(testInput);
    expect(firstResult.txHash).toBeDefined();

    // Second submission with identical participant key for the same survey must be rejected
    await expect(
      contractService.submitWhisperWithProof(testInput)
    ).rejects.toThrow(/Double submission rejected/i);
  });

  it('Test 3: should enforce response score range bounds within private circuit', async () => {
    const invalidLowInput: SubmissionWitnessInput = {
      participantSecretKey: '0x99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa',
      surveyAuthToken: '0x0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20',
      confidentialScore: 0, // Invalid: below min bound 1
      feedbackText: 'Out of bounds score test',
    };

    await expect(
      contractService.submitWhisperWithProof(invalidLowInput)
    ).rejects.toThrow(/between 1 and 10/i);

    const invalidHighInput: SubmissionWitnessInput = {
      participantSecretKey: '0x99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa',
      surveyAuthToken: '0x0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20',
      confidentialScore: 15, // Invalid: above max bound 10
      feedbackText: 'Out of bounds score test',
    };

    await expect(
      contractService.submitWhisperWithProof(invalidHighInput)
    ).rejects.toThrow(/between 1 and 10/i);
  });

  it('Test 4: should prevent submissions when survey is paused/closed by organizer', async () => {
    // Organizer pauses survey
    await contractService.toggleSurveyStatus();
    expect(contractService.getState().isActive).toBe(false);

    const testInput: SubmissionWitnessInput = {
      participantSecretKey: '0x445566778899aabbccddeeff00112233445566778899aabbccddeeff00112233',
      surveyAuthToken: '0x0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20',
      confidentialScore: 7,
      feedbackText: 'Submission while paused',
    };

    await expect(
      contractService.submitWhisperWithProof(testInput)
    ).rejects.toThrow(/inactive/i);

    // Reactivate and verify submission succeeds
    await contractService.toggleSurveyStatus();
    expect(contractService.getState().isActive).toBe(true);

    const result = await contractService.submitWhisperWithProof(testInput);
    expect(result.txHash).toBeDefined();
  });
});
