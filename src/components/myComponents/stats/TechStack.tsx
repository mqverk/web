'use client';

import { motion } from 'framer-motion';

type Tech = {
  icon: React.ReactNode;
  name: string;
  description: string;
};

type TechStackProps = {
  techStack: Tech[];
};

export default function TechStack({ techStack }: TechStackProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {techStack.map((tech, index) => (
        <motion.div
          key={index}
          className="flex items-center gap-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-200 cursor-pointer"
          whileHover={{
            y: -2,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
          }}
        >
          <div className="flex-shrink-0">{tech.icon}</div>
          <div>
            <h4 className="text-foreground font-semibold text-sm">{tech.name}</h4>
            <p className="text-muted-foreground text-xs">{tech.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
