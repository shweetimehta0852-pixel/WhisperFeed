'use client';

import React, { useState } from 'react';
import { X, Layers, Power, PlusCircle, CheckCircle, FileCode, Shield } from 'lucide-react';
import { PublicLedgerState } from '../lib/midnight-types';
import { whisperContractService } from '../services/whisperContractService';

interface OrganizerModalProps {
  isOpen: boolean;
  state: PublicLedgerState;
  onClose: () => void;
}

export const OrganizerModal: React.FC<OrganizerModalProps> = ({
  isOpen,
  state,
  onClose,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newThreshold, setNewThreshold] = useState<number>(30);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleToggleActive = async () => {
    setLoading(true);
    try {
      await whisperContractService.toggleSurveyStatus();
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setLoading(true);
    try {
      await whisperContractService.createNewSurvey(newTitle.trim(), newThreshold);
      setNewTitle('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md">
      <div className="w-full max-w-xl glass-panel-glow rounded-2xl p-6 sm:p-8 border border-slate-700 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-midnight-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">
              Organizer Governance & Lifecycle
            </h3>
            <p className="text-xs text-slate-400">
              Compact Smart Contract State Controller
            </p>
          </div>
        </div>

        {/* Current State Inspection */}
        <div className="p-4 rounded-xl bg-midnight-900 border border-slate-800 mb-6 font-mono text-xs space-y-2">
          <div className="flex justify-between text-slate-400">
            <span>Survey ID:</span>
            <span className="text-cyan-300">{state.surveyId}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Organizer Public Key:</span>
            <span className="text-slate-300">{state.organizerPubKey.slice(0, 18)}...</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Contract Active Status:</span>
            <span className={state.isActive ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {state.isActive ? 'ACTIVE' : 'PAUSED'}
            </span>
          </div>
        </div>

        {/* Toggle Status */}
        <div className="mb-6 flex items-center justify-between p-4 rounded-xl bg-midnight-900/60 border border-slate-800">
          <div>
            <div className="text-xs font-semibold text-white">Survey Status Control</div>
            <div className="text-[11px] text-slate-400">Pause or reopen submissions for the active survey</div>
          </div>
          <button
            onClick={handleToggleActive}
            disabled={loading}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              state.isActive
                ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
                : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{state.isActive ? 'Pause Survey' : 'Reactivate Survey'}</span>
          </button>
        </div>

        {/* Create New Survey Form */}
        <form onSubmit={handleCreateSurvey} className="space-y-4 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
            <PlusCircle className="w-4 h-4" />
            <span>Deploy New Survey Topic</span>
          </h4>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Survey Title / Topic Question</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g., Midnight Mainnet Upgrade Security Audit Review"
              className="w-full bg-midnight-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Target Response Threshold</label>
            <input
              type="number"
              min="1"
              max="1000"
              value={newThreshold}
              onChange={(e) => setNewThreshold(Number(e.target.value))}
              className="w-full bg-midnight-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading || !newTitle.trim()}
              className="px-5 py-2.5 text-xs font-bold text-midnight-950 bg-gradient-to-r from-cyan-400 to-electric-blue hover:from-cyan-300 hover:to-white rounded-xl shadow-cyan-glow transition-all disabled:opacity-40"
            >
              Deploy Survey to Compact Ledger
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
