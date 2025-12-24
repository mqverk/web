'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  Music,
  MessageSquare,
  MapPin,
  BookOpen,
  Monitor,
  Zap,
  Cat,
  GitCommit,
  PenTool,
  ArrowUpRight,
  Github,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import NowPlayingInline from './NowPlayingInLine';
import DiscordStatusInline from './Discord';
import LocationTime from './LocationTime';
import LatestCommitActivity from './LatestCommitActivity';

// Reusable Card Component
const ActivityCard = ({
  className,
  onClick,
  href,
  icon: Icon,
  label,
  children,
  actionIcon = true,
}: {
  className?: string;
  onClick?: () => void;
  href?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  children: React.ReactNode;
  actionIcon?: boolean;
}) => {
  const content = (
    <>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
          <Icon size={12} className="shrink-0" />
          <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
        </div>
        {actionIcon && (
          <ArrowUpRight
            size={13}
            className="text-muted-foreground/20 group-hover:text-foreground/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
          />
        )}
      </div>
      <div className="font-medium text-xs text-foreground/90 leading-relaxed wrap-break-word">
        {children}
      </div>
    </>
  );

  const baseStyles = cn(
    // Base Layout
    'group relative flex flex-col p-3 rounded-lg border transition-all duration-300 overflow-hidden backdrop-blur-sm',
    // Light Mode Styles (Clean White)
    'bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-sm',
    // Dark Mode Styles (Glassmorphism Dark)
    'dark:bg-zinc-900/40 dark:border-zinc-800/50 dark:hover:bg-zinc-900/60 dark:hover:border-zinc-700/50',
    // Interactive states
    (onClick || href) && 'cursor-pointer active:scale-[0.99]',
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseStyles}>
        {content}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={baseStyles}>
      {content}
    </div>
  );
};

export default function Activities() {
  const { resolvedTheme } = useTheme();
  const light_url = '/github-contributions-light.svg';
  const dark_url = '/github-contributions-dark.svg';

  const [mounted, setMounted] = useState(false);
  const [graphUrl, setGraphUrl] = useState<string>(dark_url);
  const [imageError, setImageError] = useState<boolean>(true);
  const [onekoEnabled, setOnekoEnabled] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  // Handle mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.matchMedia('(min-width: 768px)').matches);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('oneko-enabled');
      if (saved !== null) setOnekoEnabled(saved === 'true');
    }

    const handleOnekoToggle = (event: CustomEvent) => setOnekoEnabled(event.detail.enabled);
    window.addEventListener('oneko-toggle', handleOnekoToggle as EventListener);

    return () => {
      window.removeEventListener('resize', checkDesktop);
      window.removeEventListener('oneko-toggle', handleOnekoToggle as EventListener);
    };
  }, []);

  const toggleOneko = () => {
    const newState = !onekoEnabled;
    setOnekoEnabled(newState);
    localStorage.setItem('oneko-enabled', newState.toString());
    window.dispatchEvent(new CustomEvent('oneko-toggle', { detail: { enabled: newState } }));
  };

  useEffect(() => {
    if (!mounted) return;

    setImageError(true);
    const img = new Image();
    img.src = resolvedTheme === 'dark' ? dark_url : light_url;
    img.onload = () => {
      setGraphUrl(img.src);
      setImageError(false);
    };
    img.onerror = () => setImageError(true);
  }, [resolvedTheme, mounted]);

  return (
    <section className="mt-16 space-y-4">
      <div className="flex items-center gap-3 mb-5">
        <Zap className="h-4 w-4 text-primary" />
        <h2 className="text-base font-semibold tracking-tight text-foreground">Live Activity</h2>
        <div className="h-px bg-gradient-to-r from-border/60 to-transparent flex-1" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Row 1: Music & Discord */}
        <ActivityCard
          className="col-span-2 min-h-[90px]"
          icon={Music}
          label="Now Playing"
          onClick={() => window.dispatchEvent(new CustomEvent('open-now-playing-modal'))}
        >
          <div className="line-clamp-1 mt-1" title="Click to view details">
            <NowPlayingInline />
          </div>
        </ActivityCard>

        <ActivityCard
          className="col-span-2 min-h-[90px]"
          icon={MessageSquare}
          label="Discord"
          onClick={() => window.dispatchEvent(new CustomEvent('open-discord-modal'))}
        >
          <div className="truncate mt-1">
            <DiscordStatusInline />
          </div>
        </ActivityCard>

        {/* Row 2: Location, Reading, Watching, Status */}
        <ActivityCard icon={MapPin} label="Location" actionIcon={false} className="min-h-[110px]">
          <div className="leading-tight text-[11px] mt-1">
            <LocationTime />
          </div>
        </ActivityCard>

        <ActivityCard icon={BookOpen} label="Reading" actionIcon={false} className="min-h-[110px]">
          <span className="italic block mt-1 text-[11px] truncate" title="LOTM >.<">
            "LOTM {'>.<'}"
          </span>
        </ActivityCard>

        <ActivityCard icon={Monitor} label="Watching" actionIcon={false} className="min-h-[110px]">
          <span className="italic block mt-1 text-[11px] truncate" title="Open-Source 👒">
            "Open-Source 👒"
          </span>
        </ActivityCard>

        <ActivityCard icon={Zap} label="Status" actionIcon={false} className="min-h-[110px]">
          <div className="line-clamp-2 text-[11px] mt-1" title="Building 🚀">
            Building 🚀
          </div>
        </ActivityCard>

        {/* Row 3: Git, Guestbook, Cat (Desktop) */}
        <ActivityCard
          className="col-span-2 min-h-[90px]"
          icon={GitCommit}
          label="Latest Commit"
          onClick={() => window.dispatchEvent(new CustomEvent('open-commit-modal'))}
        >
          <div className="mt-1">
            <LatestCommitActivity />
          </div>
        </ActivityCard>

        <ActivityCard
          href="/guestbook"
          icon={PenTool}
          label="Guestbook"
          className="col-span-1 min-h-[90px]"
        >
          <div className="line-clamp-2 text-[11px] mt-1">Sign my guestbook ✨</div>
        </ActivityCard>

        {isDesktop && (
          <ActivityCard
            icon={Cat}
            label="Oneko"
            onClick={toggleOneko}
            className="col-span-1 min-h-[90px]"
          >
            <div className="flex items-center gap-2 mt-1">
              <span
                className={cn(
                  'w-1.5 h-1.5 rounded-full ring-2 ring-background/50',
                  onekoEnabled ? 'bg-green-500' : 'bg-zinc-400'
                )}
              />
              <span
                className={cn(
                  'text-[11px] font-medium',
                  onekoEnabled ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {onekoEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </ActivityCard>
        )}

        {/* Row 4: Contribution Graph */}
        <div className="col-span-2 lg:col-span-4 relative group">
          <div className="p-3 rounded-xl border transition-all duration-300 backdrop-blur-sm overflow-hidden bg-white border-zinc-200 hover:border-zinc-300 dark:bg-zinc-900/30 dark:border-zinc-800/50 dark:hover:border-zinc-700">
            <div className="flex items-center gap-2 mb-3">
              <Github size={13} className="text-muted-foreground" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                GitHub Contributions
              </span>
            </div>

            <div className="overflow-hidden rounded-lg">
              {!mounted ? (
                <div className="h-[110px] animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
              ) : !imageError ? (
                <img
                  src={graphUrl}
                  className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                  alt="GitHub Contributions"
                />
              ) : (
                <div className="h-[110px] flex flex-col items-center justify-center text-center text-muted-foreground space-y-2 bg-muted/5 rounded-lg border border-dashed border-border/30">
                  <Github className="h-6 w-6 opacity-20" />
                  <p className="text-[10px] font-mono">Graph unavailable</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
