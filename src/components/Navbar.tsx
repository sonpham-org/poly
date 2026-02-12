import Link from 'next/link';
import { Activity } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="border-b border-border px-4 md:px-8 h-14 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
        <Activity className="w-5 h-5 text-accent" />
        <span>Poly Replay</span>
      </Link>
      <div className="flex items-center gap-6 text-sm text-muted">
        <Link href="/" className="hover:text-foreground transition-colors">
          Markets
        </Link>
        <Link href="/learn" className="hover:text-foreground transition-colors">
          How it Works
        </Link>
      </div>
    </nav>
  );
}
