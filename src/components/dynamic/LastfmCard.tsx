import { useEffect, useState, useCallback, useRef } from "react";
import { fetchLastfmData, LastfmData } from "@/lib/api";
import { Music2, Headphones } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const POLL_INTERVAL = 5_000; // 5 seconds for quick track change detection

export const LastfmCard = () => {
  const [data, setData] = useState<LastfmData | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const songStartRef = useRef<number>(0);
  const songKeyRef = useRef<string>("");

  const refresh = useCallback(() => {
    fetchLastfmData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [refresh]);

  // Track song changes — reset start time when song changes
  useEffect(() => {
    if (!data?.nowPlaying) {
      songKeyRef.current = "";
      songStartRef.current = 0;
      setProgress(0);
      return;
    }
    const key = `${data.nowPlaying.songName}|${data.nowPlaying.artistName}`;
    if (key !== songKeyRef.current) {
      songKeyRef.current = key;
      songStartRef.current = Date.now();
      setProgress(0);
    }
  }, [data]);

  // Smooth progress animation using requestAnimationFrame
  useEffect(() => {
    const duration = data?.nowPlaying?.duration;
    if (!duration || !songStartRef.current) return;

    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - songStartRef.current;
      setProgress(Math.min(elapsed / duration, 1));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [data?.nowPlaying?.songName, data?.nowPlaying?.artistName, data?.nowPlaying?.duration]);

  const isPlaying = !!data?.nowPlaying;
  const currentTrack = data?.nowPlaying ?? data?.recentTrack ?? null;

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Now Playing / Recently Played — hero area */}
      <div className="flex-1 relative overflow-hidden rounded-lg">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="absolute inset-0 bg-zinc-900 animate-pulse" />
          ) : currentTrack ? (
            <motion.a
              key={isPlaying ? "np" : "recent"}
              href={currentTrack.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="block absolute inset-0 group cursor-pointer"
            >
              {/* Album art background */}
              {currentTrack.albumArt ? (
                <img
                  src={currentTrack.albumArt}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-zinc-900" />
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

              {/* Top bar: label + live badge */}
              <div className="absolute top-0 inset-x-0 flex items-center justify-between p-3">
                <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
                  <Music2 className="w-3 h-3 text-red-500" />
                  <span className="text-[10px] font-semibold text-zinc-300 uppercase tracking-wider">
                    {isPlaying ? "Now Playing" : "Recently Played"}
                  </span>
                </div>
                {isPlaying && (
                  <div className="flex items-center gap-1.5 bg-red-500/20 backdrop-blur-sm rounded-full px-2.5 py-1">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                    </span>
                    <span className="text-[10px] text-red-400 font-semibold uppercase">Live</span>
                  </div>
                )}
              </div>

              {/* Bottom: track info + equalizer + progress */}
              <div className="absolute bottom-0 inset-x-0 flex flex-col">
                <div className="px-3 pb-2 flex items-end justify-between gap-3">
                  <div className="flex flex-col overflow-hidden min-w-0">
                    <span className="text-base font-semibold text-white truncate drop-shadow-lg">
                      {currentTrack.songName}
                    </span>
                    <span className="text-sm text-zinc-300 truncate drop-shadow-lg">
                      {currentTrack.artistName}
                    </span>
                  </div>
                  {isPlaying && (
                    <div className="flex gap-[3px] items-end h-5 shrink-0 pb-1">
                      {[0, 1, 2, 3].map((i) => (
                        <span
                          key={i}
                          className="w-[3px] bg-red-500 rounded-full animate-bounce"
                          style={{
                            animationDelay: `${i * 0.12}s`,
                            animationDuration: "0.5s",
                            height: `${6 + ((i % 3) * 5)}px`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {/* Progress bar */}
                <div className="h-1 w-full bg-white/10">
                  {isPlaying ? (
                    <div
                      className="h-full bg-red-500 rounded-r-full transition-[width] duration-300 ease-linear"
                      style={{ width: `${progress * 100}%` }}
                    />
                  ) : (
                    <div className="h-full bg-zinc-500/50 w-full" />
                  )}
                </div>
              </div>
            </motion.a>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-zinc-900/80 text-zinc-600"
            >
              <Headphones className="w-8 h-8" />
              <span className="text-xs font-medium">Not listening right now</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Most Listened Artist — Spotify-style */}
      {!loading && data?.topArtist && (
        <motion.a
          href={data.topArtist.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-3 p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors cursor-pointer group"
        >
          {data.topArtist.image ? (
            <img
              src={data.topArtist.image}
              alt={data.topArtist.name}
              loading="lazy"
              className="w-10 h-10 rounded-full object-cover shadow-md ring-1 ring-zinc-700 group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center ring-1 ring-zinc-700">
              <Music2 className="w-4 h-4 text-zinc-600" />
            </div>
          )}
          <div className="flex flex-col overflow-hidden min-w-0">
            <span className="text-sm font-semibold text-zinc-100 truncate group-hover:text-white transition-colors">
              {data.topArtist.name}
            </span>
            <span className="text-xs text-zinc-500">Artist</span>
          </div>
        </motion.a>
      )}
    </div>
  );
};
