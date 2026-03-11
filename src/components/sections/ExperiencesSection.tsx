import { ChevronUp, ChevronDown } from "lucide-react";
import experiences from "@/data/experiences.json";

export const ExperiencesSection = () => {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-100">
        Experience & Education
      </h2>
      <div className="flex flex-col gap-8">
        {experiences.map((exp) => (
          <div key={exp.id} className="flex flex-col gap-4 relative">
            <div className="flex justify-between items-start group cursor-pointer">
              <div className="flex gap-4 pr-8 sm:pr-0">
                <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 flex items-center justify-center p-1">
                  <img src={exp.logo} alt={exp.company} className="h-full w-full object-contain rounded-md" />
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-zinc-100">{exp.company}</h3>
                    {exp.type && (
                      <span className="px-1.5 py-0.5 text-[10px] uppercase font-medium bg-zinc-900 border border-zinc-800 rounded text-zinc-400 whitespace-nowrap">
                        {exp.type}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500">{exp.role}</p>
                  
                  {/* Mobile Date & Location */}
                  <div className="flex sm:hidden flex-wrap items-center gap-1.5 mt-1.5">
                    <span className="text-xs text-zinc-400 font-medium whitespace-nowrap">{exp.date}</span>
                    <span className="text-xs text-zinc-600 px-0.5">•</span>
                    <span className="text-xs text-zinc-500 whitespace-nowrap">{exp.location}</span>
                  </div>
                </div>
              </div>

              {/* Desktop Date & Location, and Chevron */}
              <div className="flex gap-4 items-start shrink-0 absolute right-0 sm:relative">
                 <div className="hidden sm:flex flex-col items-end gap-1">
                   <span className="text-sm text-zinc-300 font-medium">{exp.date}</span>
                   <span className="text-xs text-zinc-500">{exp.location}</span>
                 </div>
                 {exp.highlights.length > 0 ? (
                    <ChevronUp className="h-4 w-4 text-zinc-600 mt-1 sm:mt-0.5" />
                 ) : (
                    <ChevronDown className="h-4 w-4 text-zinc-600 mt-1 sm:mt-0.5" />
                 )}
              </div>
            </div>

            {exp.highlights.length > 0 && (
              <div className="ml-14 flex flex-col gap-4">
                <ul className="flex flex-col gap-2 mt-2">
                  {exp.highlights.map((highlight, idx) => (
                    <li key={idx} className="text-sm text-zinc-400 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:bg-zinc-600 before:rounded-full">
                      {highlight}
                    </li>
                  ))}
                </ul>

                {exp.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {exp.skills.map((skill) => (
                      <span key={skill} className="px-2 py-1 rounded-md bg-zinc-900/40 border border-zinc-800/80 text-xs text-zinc-500">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
