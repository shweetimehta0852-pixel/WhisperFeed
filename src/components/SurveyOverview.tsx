'use client';

import React from 'react';
import { ShieldCheck, BarChart3, Users, Sparkles, CheckCircle2, Lock, EyeOff } from 'lucide-react';
import { PublicLedgerState } from '../lib/midnight-types';

interface SurveyOverviewProps {
  state: PublicLedgerState;
}

export const SurveyOverview: React.FC<SurveyOverviewProps> = ({ state }) => {
  const progressPercent = Math.min(100, Math.round((state.submissionCount / state.targetThreshold) * 100));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Active Survey Main Card */}
      <div className="lg:col-span-2 glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1.5 animate-pulse" />
              {state.isActive ? 'Active Survey' : 'Survey Closed'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Survey ID: {state.surveyId.slice(0, 10)}...
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono bg-midnight-900/90 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="text-cyan-400">Contract ID:</span>
            <span className="text-slate-200" title={state.contractAddress}>
              {state.contractAddress.slice(0, 8)}...{state.contractAddress.slice(-6)}
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
          {state.surveyTitle}
        </h1>
        <p className="text-sm text-slate-300 mb-6 max-w-2xl leading-relaxed">
          Submit your candid rating and qualitative whistleblowing report. Your identity is mathematically detached from the submission using Midnight’s Compact ZK circuits.
        </p>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div>
            <div className="text-xs text-slate-400 mb-1 flex items-center space-x-1">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verifiable Whispers</span>
            </div>
            <div className="text-2xl font-black text-white font-mono flex items-baseline space-x-2">
              <span>{state.submissionCount}</span>
              <span className="text-xs text-slate-500 font-normal">/ {state.targetThreshold} goal</span>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 mb-1 flex items-center space-x-1">
              <BarChart3 className="w-3.5 h-3.5 text-electric-blue" />
              <span>Aggregate Rating</span>
            </div>
            <div className="text-2xl font-black text-cyan-400 font-mono">
              {state.averageScore} <span className="text-xs text-slate-500">/ 10.0</span>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <div className="text-xs text-slate-400 mb-1 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Threshold Status</span>
            </div>
            <div className="text-xs font-semibold">
              {state.thresholdReached ? (
                <span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30 inline-block">
                  Threshold Reached
                </span>
              ) : (
                <span className="text-amber-300 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/30 inline-block">
                  {state.targetThreshold - state.submissionCount} more needed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
            <span>Participation Progress</span>
            <span className="text-cyan-400">{progressPercent}%</span>
          </div>
          <div className="w-full bg-midnight-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-cyan-500 to-electric-blue h-full rounded-full transition-all duration-700 ease-out shadow-cyan-glow"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Zero-Knowledge Guarantees Checklist */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between border-cyan-500/20">
        <div>
          <div className="flex items-center space-x-2 text-cyan-300 text-sm font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span>ZK Privacy Guarantees</span>
          </div>

          <ul className="space-y-3.5 text-xs text-slate-300">
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Zero Identity Leakage:</strong> Wallet address is never written to public ledger state.
              </span>
            </li>
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Nullifier Non-Repetition:</strong> Replay protection without linking multiple surveys.
              </span>
            </li>
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Selective Disclosure:</strong> Individual scores remain private; only mathematical sum updates.
              </span>
            </li>
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Private Witness Proofs:</strong> Compact circuits prove validity directly on-client.
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-6 p-3 rounded-xl bg-midnight-900/90 border border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
          <span className="flex items-center space-x-1.5">
            <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zero-Knowledge Proof: Active</span>
          </span>
          <span className="text-cyan-400 font-bold">Midnight Preprod</span>
        </div>
      </div>
    </div>
  );
};
