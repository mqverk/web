import projectsData from "@/data/projects.json";
import { ArrowUpRight, Pin, Github, ExternalLink, X } from "lucide-react";
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
  coverImage: string;
  video: string;
}

export const ProjectsSection = ({ limit }: ProjectsSectionProps) => {
  const displayProjects = limit ? projectsData.slice(0, limit) : projectsData;
  const [hoveredId, setHoveredId] = useState<number | null>(null);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayProjects.map((project) => (
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              key={project.id}
              onClick={() => setSelectedProject(project as Project)}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group flex flex-col p-4 rounded-xl border border-zinc-900 bg-zinc-950/50 hover:bg-zinc-900 hover:border-zinc-800 transition-colors cursor-pointer"
            >
              {/* Media Area */}
              <div className="w-full h-40 bg-zinc-900 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden text-zinc-600 font-medium border border-zinc-800/50">
                {project.coverImage ? (
                  <img src={project.coverImage} alt={project.title} loading={limit ? "eager" : "lazy"} className="w-full h-full object-cover transition-opacity duration-300" style={{ opacity: hoveredId === project.id && project.video ? 0 : 1 }} />
                ) : (
                  <span className="text-xl font-bold uppercase tracking-wider text-zinc-50 opacity-20">Coming Soon</span>
                )}
                
                {project.video && hoveredId === project.id && (
                  <video 
                    src={project.video}
                    autoPlay
                    loop 
                    muted 
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                <div className="absolute top-3 left-3 text-[10px] bg-zinc-950/80 backdrop-blur-sm border border-zinc-700/50 text-zinc-300 px-2 py-0.5 rounded uppercase font-semibold">
                  Project
                </div>
                <div className="absolute top-3 right-3 text-zinc-300 bg-zinc-950/80 backdrop-blur-sm rounded-full p-1 border border-zinc-700/50">
                  <Pin className="h-3 w-3" />
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-grow">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-zinc-100">{project.title}</h3>
                  {project.live && <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    Live
                  </div>}
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">
                  {project.description}
                </p>
                
                <div className="mt-auto pt-4 flex items-center text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">
                  View Details <ArrowUpRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
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
              className="relative w-full max-w-3xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col z-10"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 text-zinc-300 rounded-full transition-colors backdrop-blur-md border border-zinc-700/50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full relative bg-zinc-900 border-b border-zinc-800/50" style={{ height: "45vh", minHeight: "250px" }}>
                {selectedProject.video ? (
                  <video 
                    src={selectedProject.video} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : selectedProject.coverImage ? (
                  <img src={selectedProject.coverImage} loading="lazy" className="w-full h-full object-cover" alt="Cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600 font-medium text-xl uppercase tracking-wider">Coming Soon</div>
                )}
                
                {/* Gradient overlay for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
                
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 dropdown-shadow">{selectedProject.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((t) => (
                      <span key={t} className="px-2.5 py-1 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 rounded-md text-xs font-medium text-zinc-300 shadow-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-semibold text-zinc-100">About this project</h3>
                  <p className="text-[15px] leading-relaxed text-zinc-400">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="flex gap-4 pt-4 border-t border-zinc-800/60 mt-2">
                  {selectedProject.github && (
                    <a 
                      href={selectedProject.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 font-medium text-sm rounded-lg border border-zinc-700/50 transition-colors shadow-sm"
                    >
                      <Github className="w-4 h-4" /> View Source
                    </a>
                  )}
                  {selectedProject.live && (
                    <a 
                      href={selectedProject.live} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-100 hover:bg-white text-zinc-900 font-medium text-sm rounded-lg transition-colors shadow-sm"
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
