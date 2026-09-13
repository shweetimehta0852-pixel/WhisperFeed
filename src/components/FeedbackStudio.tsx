'use client';

import React, { useState } from 'react';
import {
  Lock,
  EyeOff,
  Sliders,
  Sparkles,
  Shield,
  Send,
  Check,
  AlertTriangle,
  FileCode2,
  Key
} from 'lucide-react';
import { SubmissionWitnessInput } from '../lib/midnight-types';

interface FeedbackStudioProps {
  onSubmit: (input: SubmissionWitnessInput) => void;
  isSubmitting: boolean;
  isActive: boolean;
}

export const FeedbackStudio: React.FC<FeedbackStudioProps> = ({
  onSubmit,
  isSubmitting,
  isActive
}) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [score, setScore] = useState<number>(9);
  const [secretKey, setSecretKey] = useState<string>(
    '0x3a9f84b12c8e102938470042d76fba98e3b1c09938f90e8a7431260011223344'
  );
  const [authToken, setAuthToken] = useState<string>('0x7f1190ab7762cc409812e987ac11874982635418a09b8c716253448899aabbcc');
  const [showAdvancedWitness, setShowAdvancedWitness] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    onSubmit({
      participantSecretKey: secretKey,
      surveyAuthToken: authToken,
      confidentialScore: score,
      feedbackText: feedbackText.trim()
    });
  };

  const regenerateEntropy = () => {
    setSecretKey('0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(''));
  };

  const getScoreColor = (val: number) => {
    if (val >= 8) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (val >= 5) return 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  return (
    <div className="glass-panel-glow rounded-2xl p-6 sm:p-8 relative">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-wide">
              Encrypted Feedback Studio
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Constructing off-chain private witness for Compact circuit execution
          </p>
        </div>

        {/* Dynamic Privacy Tag */}
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow">
            <Lock className="w-3 h-3 mr-1.5 text-cyan-400" />
            Private Witness: Encrypted
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Slider with Explicit Witness vs Public Badge */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Confidential Evaluation Rating</span>
            </label>
            <div className={`px-3 py-1 rounded-xl text-base font-bold font-mono border ${getScoreColor(score)}`}>
              {score} <span className="text-xs font-normal text-slate-400">/ 10</span>
            </div>
          </div>

          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full h-2 bg-midnight-900 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-slate-700"
          />

          <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
            <span>1 (Critical / Unsatisfied)</span>
            <span>5 (Neutral)</span>
            <span>10 (Exemplary / Flawless)</span>
          </div>
        </div>

        {/* Confidential Feedback Text Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <EyeOff className="w-4 h-4 text-cyan-400" />
              <span>Confidential Report & Feedback Payload</span>
            </label>
            <span className="text-[11px] font-mono text-cyan-400/90 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Off-Chain Witness Only
            </span>
          </div>

          <textarea
            rows={4}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Share candid engineering feedback, culture remarks, or sensitive organizational whistleblowing reports. This text is never stored publicly or linked to your wallet identity..."
            className="w-full bg-midnight-900/90 border border-slate-700/80 focus:border-cyan-400 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-sans resize-none"
            required
          />
        </div>

        {/* Data Secrecy Ledger Distinction Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-midnight-900/80 border border-cyan-500/30">
            <div className="flex items-center text-cyan-400 font-bold mb-1 space-x-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Private Witness (Stays on Device)</span>
            </div>
            <ul className="text-slate-400 space-y-1 text-[11px]">
              <li>• Participant Secret Key: <span className="text-slate-300">{secretKey.slice(0, 10)}...</span></li>
              <li>• Exact Feedback Text & Report Body</li>
              <li>• Local Authorization Invocation Seed</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-midnight-900/80 border border-slate-700/80">
            <div className="flex items-center text-purple-400 font-bold mb-1 space-x-1.5">
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Public Ledger (Disclosed State)</span>
            </div>
            <ul className="text-slate-400 space-y-1 text-[11px]">
              <li>• Deterministic Nullifier (Prevents replay)</li>
              <li>• Increment Aggregate Submission Counter (+1)</li>
              <li>• Disclose Rating Delta to Public Sum</li>
            </ul>
          </div>
        </div>

        {/* Advanced Witness Collapsible */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAdvancedWitness(!showAdvancedWitness)}
            className="text-xs text-slate-400 hover:text-cyan-300 flex items-center space-x-1.5 transition-colors"
          >
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span>{showAdvancedWitness ? 'Hide' : 'Inspect'} Participant Witness & Entropy Seed</span>
          </button>

          {showAdvancedWitness && (
            <div className="mt-3 p-4 rounded-xl bg-midnight-950 border border-slate-800 space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Participant Secret Key (`participant_sk`):</span>
                  <button
                    type="button"
                    onClick={regenerateEntropy}
                    className="text-cyan-400 hover:underline text-[10px]"
                  >
                    Regenerate Entropy
                  </button>
                </div>
                <input
                  type="text"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full bg-midnight-900 border border-slate-800 rounded p-2 text-cyan-300 text-[11px] focus:outline-none"
                />
              </div>

              <div>
                <div className="text-slate-400 mb-1">Survey Auth Token Hash (`survey_auth_token`):</div>
                <input
                  type="text"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  className="w-full bg-midnight-900 border border-slate-800 rounded p-2 text-slate-300 text-[11px] focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Action Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting || !isActive || !feedbackText.trim()}
            className="w-full py-4 px-6 text-base font-bold text-midnight-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-electric-blue hover:from-cyan-300 hover:to-white rounded-xl shadow-cyan-glow transition-all active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          >
            <Send className="w-5 h-5 text-midnight-950" />
            <span>
              {isSubmitting ? 'Generating Zero-Knowledge Proof...' : 'Submit Anonymous Whisper (Zero-Knowledge)'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
