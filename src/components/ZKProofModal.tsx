'use client';

import React from 'react';
import { Shield, CheckCircle2, Loader2, XCircle, Sparkles, Lock, ArrowRight } from 'lucide-react';
import { ZKProofStep } from '../lib/midnight-types';

interface ZKProofModalProps {
  isOpen: boolean;
  steps: ZKProofStep[];
  error: string | null;
  txResult: { txHash: string; nullifier: string } | null;
  onClose: () => void;
}

export const ZKProofModal: React.FC<ZKProofModalProps> = ({
  isOpen,
  steps,
  error,
  txResult,
  onClose,
}) => {
  if (!isOpen) return null;

  const isAllCompleted = steps.every((s) => s.status === 'completed');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg glass-panel-glow rounded-2xl p-6 sm:p-8 border border-cyan-500/40 relative shadow-cyan-glow-lg animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">
              Zero-Knowledge Circuit Prover
            </h3>
            <p className="text-xs text-slate-400">
              Midnight Compact Proof Pipeline Execution
            </p>
          </div>
        </div>

        {/* Steps Timeline */}
        <div className="space-y-4 mb-6">
          {steps.map((step) => {
            const isRunning = step.status === 'running';
            const isCompleted = step.status === 'completed';
            const isFailed = step.status === 'failed';

            return (
              <div
                key={step.step}
                className={`p-3.5 rounded-xl border transition-all ${
                  isRunning
                    ? 'bg-cyan-950/50 border-cyan-500/50 shadow-cyan-glow'
                    : isCompleted
                    ? 'bg-midnight-900/80 border-slate-800'
                    : isFailed
                    ? 'bg-rose-950/40 border-rose-500/40'
                    : 'bg-midnight-900/30 border-slate-800/40 opacity-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="shrink-0 mt-0.5">
                    {isRunning ? (
                      <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : isFailed ? (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                        {step.step}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>{step.title}</span>
                      {isRunning && (
                        <span className="text-[10px] font-mono text-cyan-400 animate-pulse uppercase tracking-wider">
                          Proving...
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error message if any */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-start space-x-2">
            <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div>
              <strong className="block font-semibold">Verification Aborted:</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Success Details */}
        {isAllCompleted && txResult && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs font-mono space-y-2">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-bold font-sans">
              <Sparkles className="w-4 h-4" />
              <span>Whisper Successfully Recorded On-Chain!</span>
            </div>
            <div className="text-slate-300 text-[11px]">
              <span className="text-slate-500">Tx Hash: </span>
              <span className="text-cyan-300">{txResult.txHash}</span>
            </div>
            <div className="text-slate-300 text-[11px] truncate">
              <span className="text-slate-500">Nullifier: </span>
              <span className="text-slate-400">{txResult.nullifier}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            disabled={!isAllCompleted && !error}
            className="px-5 py-2.5 text-xs font-bold text-midnight-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all disabled:opacity-40"
          >
            {isAllCompleted ? 'Close & Return' : error ? 'Dismiss' : 'Processing Circuit...'}
          </button>
        </div>
      </div>
    </div>
  );
};
