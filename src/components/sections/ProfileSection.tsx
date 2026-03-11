import { useState, useEffect } from "react";
import profileData from "@/data/profile.json";
import { Mail, Eye, Github, Link } from "lucide-react";
import { GithubContributionGraph } from "@/components/dynamic/GithubContributionGraph";
import { motion } from "framer-motion";
import { RotatingTitle } from "@/components/ui/RotatingTitle";

const socialLinks = [
  { icon: Github, href: profileData.socials?.github || "https://github.com", label: "GitHub" }
];

export const ProfileSection = () => {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/view")
      .then(res => res.json())
      .then(data => setViews(data.count ?? data.views))
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col gap-10 p-6 md:p-10">
      {/* Top Header info */}
      <div className="flex items-start justify-between">
        <div className="flex gap-4 items-center">
           <div className="flex flex-col gap-0.5">
             <h1 className="text-[28px] md:text-[34px] font-semibold text-zinc-100" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{profileData.name}</h1>
             <div className="text-[19px] text-zinc-500 min-h-[24px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
               <RotatingTitle titles={profileData.rotatingTitles} />
             </div>
           </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
           <Eye className="w-3.5 h-3.5" /> {typeof views === "number" ? views.toLocaleString() : "..."}
        </div>
      </div>

      {/* Bio */}
      <div className="text-[17px] leading-relaxed text-zinc-300 space-y-5">
        <p>Hey, I'm {profileData.name.split(" ")[0]} — a developer interested in OS development, cybersecurity, and free & open-source software. I build tools and explore low-level systems, with a focus on security and performance.</p>
        <p>I run Arch Linux, live in the terminal, and prefer working close to the metal. Always open to collaborating on interesting FOSS projects.</p>
      </div>

      {/* CTAs */}
      <div className="flex gap-3">
        <motion.a 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          href={`https://github.com/${import.meta.env.VITE_GITHUB_USERNAME || "mqverk"}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-200 text-zinc-900 font-medium text-[13px] shadow-sm cursor-pointer whitespace-nowrap"
        >
           <Github className="w-4 h-4" /> View GitHub
        </motion.a>
        <motion.a 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          href={`mailto:${profileData.socials?.email || ""}`}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-900/50 border border-zinc-800 text-zinc-300 font-medium text-[13px] hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap"
        >
           <Mail className="w-4 h-4" /> Send an email
        </motion.a>
      </div>

      {/* Socials & GitHub */}
      <div className="flex flex-col gap-4 mt-2">
         <h2 className="text-sm font-medium text-zinc-100">Here are my socials</h2>
         <div className="flex flex-wrap gap-2">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <motion.a
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900/50 text-[13px] font-medium text-zinc-400 hover:text-zinc-50 hover:border-zinc-700 hover:bg-zinc-800 transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.label}
                </motion.a>
              );
            })}
         </div>

         {/* GitHub Graph */}
         <div className="w-full mt-4">
           <GithubContributionGraph username={import.meta.env.VITE_GITHUB_USERNAME || "mqverk"} />
         </div>
      </div>
    </div>
  );
};
