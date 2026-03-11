import { useEffect, useState } from "react";
import { fetchSpotifyTop, SpotifyTopData } from "@/lib/api";
import { Music2, Disc3 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const SpotifyCard = () => {
  const [data, setData] = useState<SpotifyTopData | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayMode, setDisplayMode] = useState<"track" | "artist">("track");

  useEffect(() => {
    fetchSpotifyTop().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  // Cycle the card every 5 seconds if we have both track and artist data
  useEffect(() => {
    if (!loading && data?.topTrack && data?.topArtist) {
      const interval = setInterval(() => {
        setDisplayMode((prev) => (prev === "track" ? "artist" : "track"));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [loading, data]);

  return (
    <div className="flex flex-col h-full justify-between gap-4">
      <div className="flex items-center justify-between text-zinc-500">
        <div className="flex items-center gap-2">
          <Music2 className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium">Rotating on Spotify</span>
        </div>
        
        {/* Progress indicator dots */}
        {!loading && data?.topArtist && data?.topTrack && (
           <div className="flex gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full transition-colors ${displayMode === 'track' ? 'bg-green-500' : 'bg-zinc-700'}`} />
              <div className={`w-1.5 h-1.5 rounded-full transition-colors ${displayMode === 'artist' ? 'bg-green-500' : 'bg-zinc-700'}`} />
           </div>
        )}
      </div>

      <div className="relative h-20 w-full mt-2">
        {loading ? (
          <div className="absolute inset-0 bg-zinc-900 border border-zinc-800 rounded-md animate-pulse"></div>
        ) : data?.error ? (
          <div className="absolute inset-0 flex items-center justify-center p-3 rounded-lg border border-zinc-800 border-dashed text-zinc-500 text-sm">
            Failed to load Spotify stats.
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {displayMode === "track" && data?.topTrack && (
              <motion.a
                key="track"
                href={data.topTrack.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center gap-3 p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors cursor-pointer group"
              >
                <img src={data.topTrack.albumArt} alt="Album Art" loading="lazy" className="w-12 h-12 rounded-md object-cover shadow-md group-hover:scale-105 transition-transform" />
                <div className="flex flex-col overflow-hidden w-full">
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-0.5">Top Track This Month</span>
                  <span className="text-sm font-medium text-zinc-200 truncate">{data.topTrack.songName}</span>
                  <span className="text-xs text-zinc-500 truncate">{data.topTrack.artistName}</span>
                </div>
              </motion.a>
            )}

            {displayMode === "artist" && data?.topArtist && (
              <motion.a
                key="artist"
                href={data.topArtist.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center gap-3 p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors cursor-pointer group"
              >
                <img src={data.topArtist.image} alt="Artist" loading="lazy" className="w-12 h-12 rounded-full object-cover shadow-md group-hover:scale-105 transition-transform border border-zinc-700/50" />
                <div className="flex flex-col overflow-hidden w-full">
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-0.5">Top Artist This Month</span>
                  <span className="text-sm font-medium text-zinc-200 truncate flex items-center gap-1.5">
                      {data.topArtist.name}
                      <Disc3 className="w-3 h-3 text-green-500 animate-[spin_3s_linear_infinite]" />
                  </span>
                  <span className="text-xs text-zinc-500 truncate uppercase mt-0.5">{data.topArtist.genres}</span>
                </div>
              </motion.a>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
