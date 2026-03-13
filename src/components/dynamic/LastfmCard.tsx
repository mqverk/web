import { useEffect, useState, useCallback, useRef } from "react";
import { fetchLastfmData, LastfmData } from "@/lib/api";
import { Music2, Headphones, Heart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const POLL_INTERVAL = 5_000;

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
    <div className="flex flex-col h-full gap-2.5">

      {/* Now Playing — compact horizontal */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="h-[68px] animate-pulse" />
          ) : currentTrack ? (
            <motion.a
              key={isPlaying ? "np" : "recent"}
              href={currentTrack.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 p-3 group"
            >
              {/* Album art */}
              <div className="relative shrink-0">
                {currentTrack.albumArt ? (
                  <img
                    src={currentTrack.albumArt}
                    alt=""
                    className="w-11 h-11 rounded-lg object-cover shadow-md"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <Music2 className="w-4 h-4 text-zinc-600" />
                  </div>
                )}
                {isPlaying && (
                  <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                  </span>
                )}
              </div>

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                    {isPlaying ? "Now Playing" : "Recently Played"}
                  </span>
                  {isPlaying && (
                    <div className="flex gap-[2px] items-end h-3">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-[2px] bg-red-500 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.6s", height: `${5 + (i % 2) * 4}px` }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <span className="block text-sm font-semibold text-zinc-100 truncate group-hover:text-white transition-colors">
                  {currentTrack.songName}
                </span>
                <span className="block text-xs text-zinc-500 truncate">
                  {currentTrack.artistName}
                </span>
              </div>
            </motion.a>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 p-3 text-zinc-600"
            >
              <div className="w-11 h-11 rounded-lg bg-zinc-800 flex items-center justify-center">
                <Headphones className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Not listening right now</span>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Progress bar */}
        {!loading && currentTrack && (
          <div className="h-0.5 w-full bg-zinc-800">
            <div
              className="h-full bg-red-500 transition-[width] duration-300 ease-linear"
              style={{ width: isPlaying ? `${progress * 100}%` : "100%" }}
            />
          </div>
        )}
      </div>

      {/* Most Listened This Week */}
      {!loading && data?.topTrack && (
        <motion.a
          href={data.topTrack.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors cursor-pointer group"
        >
          {data.topTrack.albumArt ? (
            <img
              src={data.topTrack.albumArt}
              alt=""
              loading="lazy"
              className="w-10 h-10 rounded-lg object-cover shadow-md group-hover:scale-105 transition-transform shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
              <Music2 className="w-4 h-4 text-zinc-600" />
            </div>
          )}
          <div className="flex flex-col overflow-hidden min-w-0">
            <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-0.5">
              Most Listened This Week
            </span>
            <span className="text-sm font-semibold text-zinc-100 truncate group-hover:text-white transition-colors">
              {data.topTrack.songName}
            </span>
            <span className="text-xs text-zinc-500 truncate">
              {data.topTrack.artistName} · {data.topTrack.playcount} plays
            </span>
          </div>
        </motion.a>
      )}

      {/* Favourite Artist — hardcoded */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/50"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shrink-0 shadow-md">
          <span className="text-xs font-bold text-white">BWU</span>
        </div>
        <div className="flex flex-col overflow-hidden min-w-0">
          <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-0.5 flex items-center gap-1">
            <Heart className="w-2.5 h-2.5 text-pink-500 fill-pink-500" /> Favourite Artist
          </span>
          <span className="text-sm font-semibold text-zinc-100 truncate">BoyWithUke</span>
        </div>
      </motion.div>

    </div>
  );
};
