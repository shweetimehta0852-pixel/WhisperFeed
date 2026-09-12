'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { SurveyOverview } from '../components/SurveyOverview';
import { FeedbackStudio } from '../components/FeedbackStudio';
import { PrivacyExplorer } from '../components/PrivacyExplorer';
import { ProofLog } from '../components/ProofLog';
import { ZKProofModal } from '../components/ZKProofModal';
import { OrganizerModal } from '../components/OrganizerModal';
import { whisperContractService } from '../services/whisperContractService';
import {
  PublicLedgerState,
  SubmissionRecord,
  SubmissionWitnessInput,
  ZKProofStep
} from '../lib/midnight-types';

export default function Home() {
  const [ledgerState, setLedgerState] = useState<PublicLedgerState>(() =>
    whisperContractService.getState()
  );
  const [records, setRecords] = useState<SubmissionRecord[]>(() =>
    whisperContractService.getRecords()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrganizerOpen, setIsOrganizerOpen] = useState(false);
  const [proofSteps, setProofSteps] = useState<ZKProofStep[]>([]);
  const [proofError, setProofError] = useState<string | null>(null);
  const [txResult, setTxResult] = useState<{ txHash: string; nullifier: string } | null>(null);

  useEffect(() => {
    const unsubState = whisperContractService.subscribeState((st) => setLedgerState(st));
    const unsubRecords = whisperContractService.subscribeRecords((recs) => setRecords(recs));
    return () => {
      unsubState();
      unsubRecords();
    };
  }, []);

  const handleFormSubmit = async (input: SubmissionWitnessInput) => {
    setIsSubmitting(true);
    setProofError(null);
    setTxResult(null);
    setIsModalOpen(true);

    try {
      const result = await whisperContractService.submitWhisperWithProof(input, (steps) => {
        setProofSteps(steps);
      });
      setTxResult(result);
    } catch (err: any) {
      setProofError(err?.message || 'Failed to generate and submit zero-knowledge proof');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top Navigation */}
      <Header onOpenOrganizer={() => setIsOrganizerOpen(true)} />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10 w-full">
        {/* Active Survey Overview */}
        <section>
          <SurveyOverview state={ledgerState} />
        </section>

        {/* Encrypted Feedback Form Studio */}
        <section>
          <FeedbackStudio
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
            isActive={ledgerState.isActive}
          />
        </section>

        {/* Interactive Privacy Explorer */}
        <section>
          <PrivacyExplorer />
        </section>

        {/* Live Cryptographic Proof Log */}
        <section>
          <ProofLog records={records} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-midnight-950 py-8 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-cyan-400 font-semibold">WhisperFeed Protocol</span> • Powered by Midnight Network Compact Contracts
          </div>
          <div>
            Level 3 Hackathon Implementation • Preprod Testnet Ready
          </div>
        </div>
      </footer>

      {/* ZK Proof Progress Modal */}
      <ZKProofModal
        isOpen={isModalOpen}
        steps={proofSteps}
        error={proofError}
        txResult={txResult}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Organizer Control Modal */}
      <OrganizerModal
        isOpen={isOrganizerOpen}
        state={ledgerState}
        onClose={() => setIsOrganizerOpen(false)}
      />
    </div>
  );
}
