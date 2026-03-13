import { useEffect, useState, useCallback, useRef } from "react";
import { fetchLastfmData, LastfmData } from "@/lib/api";
import { Music2, Headphones } from "lucide-react";
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
  const duration = data?.nowPlaying?.duration || 0;
  const elapsed = duration > 0 ? Math.min(duration, Math.floor(progress * duration)) : 0;

  const formatMs = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full gap-4 w-full">
      {/* Heading */}
      <div className="flex items-center gap-2 text-zinc-500">
        <Music2 className="w-5 h-5" />
        <span className="text-sm font-medium">Music</span>
      </div>

      {loading ? (
        <div className="h-full w-full bg-zinc-900 border border-zinc-800 rounded-md animate-pulse"></div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Stats row */}
          {data?.userStats && (
            <div className="flex gap-4 text-xs text-zinc-400">
              <span><strong>{data.userStats.scrobbles.toLocaleString()}</strong> Scrobbles</span>
              <span><strong>{data.userStats.artistCount.toLocaleString()}</strong> Artists</span>
            </div>
          )}

          {/* Now Playing — compact horizontal */}
          <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 h-[104px]">
            <AnimatePresence mode="wait">
              {currentTrack ? (
                <motion.a
                  key={isPlaying ? "np" : "recent"}
                  href={currentTrack.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3 p-3 group h-[102px]"
                >
                  <div className="relative shrink-0">
                    {currentTrack.albumArt ? (
                      <img
                        src={currentTrack.albumArt}
                        alt=""
                        className="w-14 h-14 rounded-xl object-cover shadow-md"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center">
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
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-zinc-500">
                      <span className="px-1.5 py-0.5 rounded border border-zinc-700/70 bg-zinc-800/70 uppercase tracking-wide">
                        {isPlaying ? "Live" : "Recent"}
                      </span>
                      {duration > 0 && (
                        <span>{formatMs(elapsed)} / {formatMs(duration)}</span>
                      )}
                    </div>
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
            {currentTrack && (
              <div className="h-0.5 w-full bg-zinc-800">
                <div
                  className="h-full bg-red-500 transition-[width] duration-300 ease-linear"
                  style={{ width: isPlaying ? `${progress * 100}%` : "100%" }}
                />
              </div>
            )}
          </div>

          {/* Most Listened This Week */}
          {data?.topTrack && (
            <motion.a
              href={data.topTrack.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="group block p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-colors h-[104px]"
            >
              <div className="flex items-center gap-3">
                {data.topTrack.albumArt ? (
                  <img
                    src={data.topTrack.albumArt}
                    alt=""
                    loading="lazy"
                    className="w-14 h-14 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
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
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-zinc-500">
                    <span className="px-1.5 py-0.5 rounded border border-zinc-700/70 bg-zinc-800/70">Top Track</span>
                    <span>Window: 7 days</span>
                  </div>
                </div>
              </div>
            </motion.a>
          )}

          {/* Favourite Artist — hardcoded */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="group block p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 h-[104px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shrink-0 shadow-md">
                <span className="text-xs font-bold text-white">BWU</span>
              </div>
              <div className="flex flex-col overflow-hidden min-w-0">
                <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-0.5">
                  Favourite Artist
                </span>
                <span className="text-sm font-semibold text-zinc-100 truncate">BoyWithUke</span>
                <span className="text-xs text-zinc-500 truncate">
                  {currentTrack?.artistName === "BoyWithUke" ? `Currently playing: ${currentTrack.songName}` : "Pinned pick"}
                </span>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-zinc-500">
                  <span className="px-1.5 py-0.5 rounded border border-zinc-700/70 bg-zinc-800/70">Pinned</span>
                  <span>Always featured</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};
