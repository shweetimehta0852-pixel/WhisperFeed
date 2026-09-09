'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Radio, KeyRound, ExternalLink, RefreshCw, Cpu, Layers } from 'lucide-react';
import { laceWallet } from '../services/laceWallet';
import { WalletAccount } from '../lib/midnight-types';

interface HeaderProps {
  onOpenOrganizer: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenOrganizer }) => {
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const unsub = laceWallet.subscribe((acc) => {
      setAccount(acc);
    });
    return () => unsub();
  }, []);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await laceWallet.connect();
    } catch (err) {
      console.error(err);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    await laceWallet.disconnect();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-midnight-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-electric-blue flex items-center justify-center shadow-cyan-glow">
            <Lock className="w-6 h-6 text-midnight-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-wider text-white">
                WHISPER<span className="text-cyan-400">FEED</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-full">
                v1.0 ZK
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Verifiable Anonymous Protocol on <span className="text-cyan-400 font-medium">Midnight</span>
            </p>
          </div>
        </div>

        {/* Network & Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Midnight Network Status & Contract Badge */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-midnight-900 border border-slate-700/60 text-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span className="text-slate-300 font-mono">Midnight Preprod</span>
            <span className="text-slate-500">|</span>
            <span className="text-cyan-400 font-mono" title="Canonical Contract: 02008f4a8b29c1e099834d6712398bfa79c0281bfe44210a99c0471289de6102">
              Contract: 02008f...6102
            </span>
          </div>

          {/* Organizer Modal Button */}
          <button
            onClick={onOpenOrganizer}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-cyan-300 bg-midnight-900/80 hover:bg-midnight-800 border border-slate-700/70 rounded-lg transition-colors"
            title="Organizer Governance & Config"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Organizer Panel</span>
          </button>

          {/* Lace / Midnight Wallet Connect */}
          {account ? (
            <div className="flex items-center space-x-2 bg-midnight-900 border border-cyan-500/40 rounded-xl p-1 pr-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono text-xs font-bold">
                MN
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-mono font-medium text-cyan-300">
                  {account.address.slice(0, 10)}...{account.address.slice(-4)}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {(Number(account.balanceTdust) / 1e9).toFixed(2)} tDUST
                </div>
              </div>
              <button
                onClick={handleDisconnect}
                className="ml-2 text-xs text-slate-400 hover:text-rose-400 px-2 py-1 hover:bg-rose-500/10 rounded transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-midnight-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-white rounded-xl shadow-cyan-glow transition-all active:scale-95 disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{connecting ? 'Connecting...' : 'Connect Lace Wallet'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
