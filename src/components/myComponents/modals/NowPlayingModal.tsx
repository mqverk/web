'use client';

import { X, Play, Pause, ExternalLink, Music, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NowPlayingModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: {
    isPlaying: boolean;
    title: string;
    artist: string;
    album: string;
    albumImageUrl?: string;
    songUrl: string;
    source: string;
  } | null;
}

export function NowPlayingModal({ isOpen, onClose, data }: NowPlayingModalProps) {
  const isSpotify = data?.source?.toLowerCase() === 'spotify';
  const isPlaying = data?.isPlaying || false;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{
              duration: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background border border-border rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/20 bg-gradient-to-r from-foreground/[0.04] via-foreground/[0.01] to-background">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-foreground/8">
                  <Radio
                    size={18}
                    className={
                      data?.isPlaying ? 'text-foreground animate-pulse' : 'text-foreground/60'
                    }
                  />
                </div>
                <h3 className="text-lg font-bold tracking-tight">Now Playing</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-foreground/10 rounded-full transition-all duration-200 text-foreground/60 hover:text-foreground hover:shadow-sm"
                title="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {isPlaying && data ? (
                <div className="flex items-start gap-6 mb-6">
                  {/* Left: Album Art */}
                  <div className="relative shrink-0">
                    <div
                      className={`w-32 h-32 rounded-xl shadow-lg overflow-hidden border border-border/50 ${data?.isPlaying ? 'ring-2 ring-foreground/20' : ''}`}
                    >
                      {data.albumImageUrl ? (
                        <img
                          src={data.albumImageUrl}
                          alt={`${data.album} cover`}
                          // NO HOVER EFFECT: Removed transition-transform and hover:scale-110
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}

                      {/* Fallback if image fails or doesn't exist */}
                      <div
                        className={`w-full h-full bg-muted flex flex-col items-center justify-center text-muted-foreground ${data.albumImageUrl ? 'hidden' : ''}`}
                      >
                        <Music size={40} />
                      </div>
                    </div>

                    {/* Status Icon Overlay */}
                    <div className="absolute -bottom-3 -right-3 bg-background rounded-full p-1.5 shadow-md border border-border z-10">
                      {/* MONOCHROME: Both states now use standard neutral colors instead of green */}
                      {data?.isPlaying ? (
                        <div className="bg-foreground text-background p-1 rounded-full">
                          <Play size={16} className="fill-current" />
                        </div>
                      ) : (
                        <div className="bg-muted text-muted-foreground p-1 rounded-full">
                          <Pause size={16} className="fill-current" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center h-32">
                    {/* Source Badge */}
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-foreground/8 text-foreground/70 capitalize border border-border/30 uppercase tracking-widest">
                        {data.source}
                      </span>
                    </div>

                    {/* Song Info */}
                    <div className="space-y-1.5">
                      <h4
                        className="font-bold text-lg leading-tight text-foreground truncate"
                        title={data.title}
                      >
                        {data.title}
                      </h4>
                      <p
                        className="text-sm font-medium text-foreground/70 truncate"
                        title={data.artist}
                      >
                        {data.artist}
                      </p>
                      <p className="text-xs text-foreground/50 truncate" title={data.album}>
                        {data.album}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center mb-4">
                    <Music size={32} className="text-muted-foreground" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">Not Playing</h4>
                  <p className="text-muted-foreground">
                    No music is currently playing. Check back later or start playing some tunes!
                  </p>
                </div>
              )}

              {/* Footer Action */}
              {isPlaying && data && (
                <div className="pt-4">
                  <a
                    href={data.songUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white text-black font-medium rounded-xl transition-all duration-300 active:scale-[0.98] border border-white hover:border-white/80 hover:bg-white/90 hover:shadow-lg"
                  >
                    <ExternalLink size={16} />
                    <span>Open on {isSpotify ? 'Spotify' : 'Last.fm'}</span>
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
