import Link from 'next/link';
import { Lock, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-midnight-950 text-white">
      <div className="glass-panel p-8 rounded-2xl max-w-md text-center">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold mb-2">404 - Page Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">
          The anonymous feedback or survey route you requested does not exist on Midnight Preprod.
        </p>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-midnight-950 bg-cyan-400 hover:bg-cyan-300 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to WhisperFeed</span>
        </Link>
      </div>
    </div>
  );
}
