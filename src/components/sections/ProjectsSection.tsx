import projectsData from "@/data/projects.json";
import { ArrowUpRight, Github, ExternalLink, X } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ProjectsSectionProps {
  limit?: number;
}

interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  github: string;
  live: string;
}

export const ProjectsSection = ({ limit }: ProjectsSectionProps) => {
  const displayProjects = limit ? projectsData.slice(0, limit) : projectsData;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Lock scroll when modal is open
  if (selectedProject) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "unset";
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-100">
          Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayProjects.map((project) => (
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={project.id}
              onClick={() => setSelectedProject(project as Project)}
              className="group flex flex-col p-6 rounded-2xl border border-zinc-800/50 bg-zinc-950/30 backdrop-blur-sm hover:bg-zinc-900/40 hover:border-zinc-700 transition-all duration-300 cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-zinc-100 mb-1 group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                  {project.live && (
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                      Live
                    </div>
                  )}
                </div>
                <div className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-zinc-400 leading-relaxed mb-6 flex-grow">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-xs font-medium text-zinc-300 transition-colors group-hover:bg-zinc-700/50 group-hover:border-zinc-600"
                  >
                    {tech}
                  </span>
                ))}
                {project.tech.length > 4 && (
                  <span className="px-2.5 py-1 text-xs font-medium text-zinc-500">
                    +{project.tech.length - 4} more
                  </span>
                )}
              </div>

              {/* Action Links */}
              <div className="flex gap-3">
                {project.github && (
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    <Github className="h-3.5 w-3.5" />
                    Source
                  </div>
                )}
                {project.live && (
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Live Demo
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Expansion Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-2xl max-h-[80vh] bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col z-10"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 text-zinc-300 rounded-full transition-colors backdrop-blur-md border border-zinc-700/50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="p-6 md:p-8 border-b border-zinc-800/50">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-white pr-4">{selectedProject.title}</h2>
                  {selectedProject.live && (
                    <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                      Live
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech.map((t) => (
                    <span key={t} className="px-3 py-1.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-sm font-medium text-zinc-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto flex-grow">
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-semibold text-zinc-100">About this project</h3>
                  <p className="text-[15px] leading-relaxed text-zinc-400">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Links */}
                <div className="flex gap-4 pt-4 border-t border-zinc-800/60 mt-auto">
                  {selectedProject.github && (
                    <a 
                      href={selectedProject.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 font-medium text-sm rounded-lg border border-zinc-700/50 transition-colors shadow-sm"
                    >
                      <Github className="w-4 h-4" /> View Source
                    </a>
                  )}
                  {selectedProject.live && (
                    <a 
                      href={selectedProject.live} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-100 hover:bg-white text-zinc-900 font-medium text-sm rounded-lg transition-colors shadow-sm"
                    >
                      <ExternalLink className="w-4 h-4" /> Visit Live Site
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
