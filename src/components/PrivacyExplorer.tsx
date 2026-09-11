'use client';

import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, Unlock, Database, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

export const PrivacyExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'admin' | 'hidden'>('hidden');

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-wide">
              Privacy Explorer Architecture
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive breakdown of Midnight Compact selective disclosure
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-xl bg-midnight-900 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab('hidden')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'hidden'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>What Stays Hidden (Off-Chain)</span>
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'admin'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-purple-glow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>What the Admin Sees (On-Chain)</span>
          </button>
        </div>
      </div>

      {/* Interactive Visual Display */}
      {activeTab === 'hidden' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-midnight-900/90 border border-cyan-500/30 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-cyan-500/20">
              <Lock className="w-16 h-16" />
            </div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 font-bold flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Participant Wallet ID</span>
            </div>
            <p className="text-xs text-slate-300 relative z-10 leading-relaxed">
              Your Midnight Lace wallet public key or address is completely detached from the transaction proof. Even blockchain explorers cannot link your submission to your wallet balance or history.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-midnight-900/90 border border-cyan-500/30 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-cyan-500/20">
              <Shield className="w-16 h-16" />
            </div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 font-bold flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Exact Feedback Text</span>
            </div>
            <p className="text-xs text-slate-300 relative z-10 leading-relaxed">
              Whistleblowing reports or raw text descriptions are stored solely in the off-chain witness structure. The circuit verifies you wrote a valid response without placing the text on the public ledger.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-midnight-900/90 border border-cyan-500/30 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-cyan-500/20">
              <EyeOff className="w-16 h-16" />
            </div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 font-bold flex items-center space-x-1.5">
              <EyeOff className="w-3.5 h-3.5" />
              <span>Participant Secret Key</span>
            </div>
            <p className="text-xs text-slate-300 relative z-10 leading-relaxed">
              Used only within local SNARK evaluation to deterministically generate the one-time nullifier. The secret key never leaves your device memory.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-midnight-900/90 border border-purple-500/30 relative overflow-hidden">
            <div className="text-xs font-mono text-purple-400 uppercase tracking-wider mb-2 font-bold flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>Deterministic Nullifier</span>
            </div>
            <p className="text-xs text-slate-300 relative z-10 leading-relaxed">
              A cryptographic hash `Hash(sk, surveyId, token)` consumed to verify participation validity and prevent duplicate submissions while preserving respondent anonymity.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-midnight-900/90 border border-purple-500/30 relative overflow-hidden">
            <div className="text-xs font-mono text-purple-400 uppercase tracking-wider mb-2 font-bold flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Incremented Aggregate Count</span>
            </div>
            <p className="text-xs text-slate-300 relative z-10 leading-relaxed">
              Public counter increments by +1 upon valid proof verification. Organizers can mathematically verify how many genuine members voted without seeing who voted when.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-midnight-900/90 border border-purple-500/30 relative overflow-hidden">
            <div className="text-xs font-mono text-purple-400 uppercase tracking-wider mb-2 font-bold flex items-center space-x-1.5">
              <Unlock className="w-3.5 h-3.5" />
              <span>Disclosed Rating Delta</span>
            </div>
            <p className="text-xs text-slate-300 relative z-10 leading-relaxed">
              Deliberately disclosed value to calculate cumulative score averages across all respondents without attaching the score to any identity or individual record.
            </p>
          </div>
        </div>
      )}

      {/* Circuit Pipeline Explanation Flow */}
      <div className="mt-6 p-4 rounded-xl bg-midnight-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono font-bold text-[10px]">1</span>
          <span>Witness Generation</span>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-600 hidden md:block" />
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono font-bold text-[10px]">2</span>
          <span>Compact Circuit Execution</span>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-600 hidden md:block" />
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono font-bold text-[10px]">3</span>
          <span>Nullifier Verification</span>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-600 hidden md:block" />
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-mono font-bold text-[10px]">4</span>
          <span>Public Ledger Update</span>
        </div>
      </div>
    </div>
  );
};
