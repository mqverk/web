import { useEffect, useState, useCallback } from "react";
import { fetchLastfmData, LastfmData, LastfmTrack } from "@/lib/api";
import { Music2, Headphones, Disc3 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const POLL_INTERVAL = 30_000;

export const LastfmCard = () => {
  const [data, setData] = useState<LastfmData | null>(null);
  const [loading, setLoading] = useState(true);

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

  const isPlaying = !!data?.nowPlaying;
  const hasAnyData = isPlaying || !!data?.recentTrack || !!data?.topArtist;

  return (
    <div className="flex flex-col h-full justify-between gap-3">
      {/* Header */}
      <div className="flex items-center justify-between text-zinc-500">
        <div className="flex items-center gap-2">
          <Music2 className="w-5 h-5 text-red-500" />
          <span className="text-sm font-medium">Last.fm</span>
        </div>
        {isPlaying && (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-xs text-red-500 font-medium">Live</span>
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="flex flex-col gap-2 flex-1 justify-end">
        {loading ? (
          <div className="h-20 bg-zinc-900 border border-zinc-800 rounded-md animate-pulse" />
        ) : !hasAnyData ? (
          <div className="flex flex-col items-center justify-center gap-2 py-4 rounded-lg border border-zinc-800 border-dashed text-zinc-600">
            <Headphones className="w-6 h-6" />
            <span className="text-xs font-medium">Not listening right now</span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* Now Playing */}
            {isPlaying && data.nowPlaying && (
              <TrackRow key="now-playing" track={data.nowPlaying} label="Now Playing" isLive />
            )}

            {/* Recently Played (when not currently playing) */}
            {!isPlaying && data?.recentTrack && (
              <TrackRow key="recent" track={data.recentTrack} label="Recently Played" />
            )}

            {/* Top artist fallback */}
            {!isPlaying && !data?.recentTrack && data?.topArtist && (
              <motion.a
                key="artist"
                href={data.topArtist.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700/50 group-hover:scale-105 transition-transform">
                  <Disc3 className="w-6 h-6 text-red-500 animate-[spin_3s_linear_infinite]" />
                </div>
                <div className="flex flex-col overflow-hidden w-full">
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-0.5">
                    Top Artist This Month
                  </span>
                  <span className="text-sm font-medium text-zinc-200 truncate">
                    {data.topArtist.name}
                  </span>
                  <span className="text-xs text-zinc-500 truncate">
                    {data.topArtist.playcount} plays
                  </span>
                </div>
              </motion.a>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

function TrackRow({
  track,
  label,
  isLive,
}: {
  track: LastfmTrack;
  label: string;
  isLive?: boolean;
}) {
  return (
    <motion.a
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors cursor-pointer group"
    >
      <div className="relative">
        {track.albumArt ? (
          <img
            src={track.albumArt}
            alt="Album Art"
            loading="lazy"
            className="w-12 h-12 rounded-md object-cover shadow-md group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-12 h-12 rounded-md bg-zinc-800 flex items-center justify-center">
            <Music2 className="w-5 h-5 text-zinc-600" />
          </div>
        )}
        {isLive && (
          <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-0.5">
            <Music2 className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </div>
      <div className="flex flex-col overflow-hidden w-full">
        <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-0.5">
          {label}
        </span>
        <span className="text-sm font-medium text-zinc-200 truncate">
          {track.songName}
        </span>
        <span className="text-xs text-zinc-500 truncate">
          {track.artistName}
        </span>
      </div>
      {isLive && (
        <div className="flex gap-[3px] items-end h-4 mr-1 shrink-0">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-[3px] bg-red-500 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: "0.6s",
                height: `${8 + ((i % 2) * 6)}px`,
              }}
            />
          ))}
        </div>
      )}
    </motion.a>
  );
}
