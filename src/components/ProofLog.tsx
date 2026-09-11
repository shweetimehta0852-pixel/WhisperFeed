'use client';

import React from 'react';
import { ShieldCheck, ExternalLink, Clock, Hash, CheckCircle, Database } from 'lucide-react';
import { SubmissionRecord } from '../lib/midnight-types';

interface ProofLogProps {
  records: SubmissionRecord[];
}

export const ProofLog: React.FC<ProofLogProps> = ({ records }) => {
  const formatTime = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-wide">
              Cryptographic Proof Log (Preprod)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable, zero-knowledge verified submissions recorded on Midnight
          </p>
        </div>

        <div className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/30 flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Live Ledger Feed</span>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          No verified proofs recorded yet. Be the first to whisper!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Status / Verification</th>
                <th className="pb-3 font-semibold">Preprod Tx Hash</th>
                <th className="pb-3 font-semibold">Deterministic Nullifier</th>
                <th className="pb-3 font-semibold">Block Height</th>
                <th className="pb-3 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/30 transition-colors">
                  {/* Status */}
                  <td className="py-3.5 pr-4">
                    <span className="inline-flex items-center space-x-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-sans font-semibold">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      <span>ZK Verified</span>
                    </span>
                  </td>

                  {/* Tx Hash */}
                  <td className="py-3.5 pr-4 text-cyan-300">
                    <div className="flex items-center space-x-1 hover:text-cyan-200 cursor-pointer">
                      <span>{rec.txHash.slice(0, 14)}...{rec.txHash.slice(-6)}</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </div>
                  </td>

                  {/* Nullifier */}
                  <td className="py-3.5 pr-4 text-slate-400">
                    <span title={rec.nullifier}>
                      {rec.nullifier.slice(0, 12)}...{rec.nullifier.slice(-6)}
                    </span>
                  </td>

                  {/* Block Height */}
                  <td className="py-3.5 pr-4 text-slate-300">
                    #{rec.blockHeight}
                  </td>

                  {/* Time */}
                  <td className="py-3.5 text-slate-500 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(rec.timestamp)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
