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
          <Icon size={13} className="shrink-0" />
          <span className="text-[10px] font-semibold uppercase tracking-widest">{label}</span>
        </div>
        {actionIcon && (
          <ArrowUpRight
            size={14}
            className="text-muted-foreground/30 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
          />
        )}
      </div>
      <div className="font-medium text-xs sm:text-sm text-foreground/90 leading-relaxed wrap-break-word">
        {children}
      </div>
    </>
  );

  const baseStyles = cn(
    // Base Layout
    'group relative flex flex-col p-3 sm:p-4 rounded-xl border transition-all duration-300 overflow-hidden backdrop-blur-sm',
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
    <section className="mt-12 space-y-8">
      <div className="space-y-3">
        <h2 className="text-3xl font-bold tracking-tight">What I'm up to</h2>
        <p className="text-muted-foreground text-sm max-w-md">
          Real-time snapshot of my activity—currently reading, listening to, and building.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Row 1: Music & Discord */}
        <ActivityCard
          className="sm:col-span-2 min-h-[100px]"
          icon={Music}
          label="Now Playing"
          onClick={() => window.dispatchEvent(new CustomEvent('open-now-playing-modal'))}
        >
          <div className="line-clamp-1 mt-1" title="Click to view details">
            <NowPlayingInline />
          </div>
        </ActivityCard>

        <ActivityCard
          className="sm:col-span-2 min-h-[100px]"
          icon={MessageSquare}
          label="Discord"
          onClick={() => window.dispatchEvent(new CustomEvent('open-discord-modal'))}
        >
          <div className="truncate mt-1">
            <DiscordStatusInline />
          </div>
        </ActivityCard>

        {/* Row 2: Location, Reading, Watching, Status */}
        <ActivityCard icon={MapPin} label="Location" actionIcon={false} className="min-h-[120px]">
          <div className="leading-tight mt-1">
            <LocationTime />
          </div>
        </ActivityCard>

        <ActivityCard icon={BookOpen} label="Reading" actionIcon={false} className="min-h-[120px]">
          <span className="italic block mt-1" title="LOTM >.<">
            White Nights
            <br />
            <b>by Dostoevsky</b>
          </span>
        </ActivityCard>

        <ActivityCard icon={Monitor} label="Watching" actionIcon={false} className="min-h-[120px]">
          <span className="italic block mt-1 truncate" title="Open-Source...">
            "Open-Source...
          </span>
        </ActivityCard>

        <ActivityCard icon={Zap} label="Status" actionIcon={false} className="min-h-[120px]">
          <div className="line-clamp-3 mt-1" title="Building 🚀">
            Building 🚀
          </div>
        </ActivityCard>

        {/* Row 3: Git, Guestbook, Cat (Desktop) */}
        <ActivityCard
          className="sm:col-span-2 min-h-[100px]"
          icon={GitCommit}
          label="Latest Commit"
          onClick={() => window.dispatchEvent(new CustomEvent('open-commit-modal'))}
        >
          <div className="mt-1">
            <LatestCommitActivity />
          </div>
        </ActivityCard>

        <ActivityCard href="/guestbook" icon={PenTool} label="Guestbook" className="min-h-[100px]">
          <div className="line-clamp-2 mt-1">Sign my guestbook ✨</div>
        </ActivityCard>

        {isDesktop && (
          <ActivityCard icon={Cat} label="Oneko" onClick={toggleOneko} className="min-h-[100px]">
            <div className="flex items-center gap-2 mt-1">
              <span
                className={cn(
                  'w-1.5 h-1.5 rounded-full ring-2 ring-background/50',
                  onekoEnabled ? 'bg-green-500' : 'bg-zinc-400'
                )}
              />
              <span
                className={cn(
                  'text-xs font-medium',
                  onekoEnabled ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {onekoEnabled ? 'On' : 'Off'}
              </span>
            </div>
          </ActivityCard>
        )}

        {/* Row 4: Contribution Graph */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-4 relative group">
          <div className="p-4 rounded-xl border transition-all duration-300 backdrop-blur-sm overflow-hidden bg-white border-zinc-200 hover:border-zinc-300 dark:bg-zinc-900/30 dark:border-zinc-800/50 dark:hover:border-zinc-700">
            <div className="flex items-center gap-2 mb-4">
              <Github size={13} className="text-muted-foreground" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                GitHub Contributions
              </span>
            </div>

            <div className="overflow-hidden rounded-lg">
              {!mounted ? (
                <div className="h-[120px] animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
              ) : !imageError ? (
                <img
                  src={graphUrl}
                  className="w-full h-auto rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-500 saturate-0 group-hover:saturate-100"
                  alt="GitHub Contributions"
                />
              ) : (
                <div className="h-[120px] flex flex-col items-center justify-center text-center text-muted-foreground space-y-2 bg-muted/5 rounded-lg border border-dashed border-border/30">
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
