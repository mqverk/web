import { motion } from "framer-motion";
import { Music, Languages, BrainCircuit } from "lucide-react";

export const BeyondTechSection = () => {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-medium tracking-tight text-zinc-50">
        Beyond Tech
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Audio Space Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex flex-col p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-colors gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-full">
              <Music className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="font-medium text-zinc-100">Audio Space</h3>
          </div>
          <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
            Not Playing — Spotify integration coming soon.
          </p>
        </motion.div>

        {/* Strategy Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex flex-col p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-colors gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-full">
              <BrainCircuit className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="font-medium text-zinc-100">Strategy</h3>
          </div>
          <p className="text-sm text-zinc-400">
            Chess enthusiast. Exploring logic, foresight, and systematic planning.
          </p>
        </motion.div>

        {/* Linguistics Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex flex-col p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-colors gap-4 lg:col-span-1 md:col-span-2"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-full">
              <Languages className="h-5 w-5 text-purple-500" />
            </div>
            <h3 className="font-medium text-zinc-100">Linguistics</h3>
          </div>
          <p className="text-sm text-zinc-400 flex flex-wrap gap-2 mt-1">
            <span className="px-2 py-1 bg-zinc-800/50 rounded-md">Tamil</span>
            <span className="px-2 py-1 bg-zinc-800/50 rounded-md">Bengali</span>
            <span className="px-2 py-1 bg-zinc-800/50 rounded-md">Japanese</span>
            <span className="px-2 py-1 bg-zinc-800/50 rounded-md">ASL</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
