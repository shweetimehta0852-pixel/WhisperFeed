import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WhisperFeed | Anonymous Feedback & Survey Protocol on Midnight Network',
  description: 'Confidential organizational feedback, whistleblowing, and verifiable survey participation powered by Midnight Zero-Knowledge Smart Contracts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-midnight-950 text-slate-100 antialiased bg-cyber-grid selection:bg-cyan-500 selection:text-midnight-950">
        <div className="fixed inset-0 pointer-events-none bg-midnight-mesh opacity-80 z-0" />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
