import skillsData from "@/data/skills.json";

const categories = [
  { key: "programmingLanguages", label: "Languages" },
  { key: "frontendTechnologies", label: "Frontend" },
  { key: "backendTechnologies", label: "Backend" },
  { key: "devOpsAndTools", label: "DevOps & Tools" },
  { key: "coreConcepts", label: "Core Concepts" }
];

export const SkillsSection = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #27272a, #27272a 1px, transparent 1px, transparent 10px)' }}></div>
      <div className="relative z-10 flex flex-col gap-8">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-100">
          Skills & Technologies
        </h2>
        <div className="flex flex-col gap-6">
          {categories.map((category) => (
            <div key={category.key} className="flex flex-col gap-3">
              <h3 className="text-sm font-medium text-zinc-400 tracking-wide uppercase">{category.label}</h3>
              <div className="flex flex-wrap gap-2">
                {skillsData[category.key as keyof typeof skillsData]?.map((skill: string) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900/40 text-[13px] font-medium text-zinc-300 shadow-sm transition-colors hover:bg-zinc-800 hover:border-zinc-700 hover:text-zinc-100 cursor-default"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

