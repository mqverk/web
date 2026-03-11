import { Section } from "@/components/layout/PageWrapper";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ProjectsPage = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const navigate = useNavigate();

  return (
    <>
      <Section crosshair className="h-24 md:h-40 relative" delay={0}>
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-900/50 rounded-md border border-zinc-800 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
        </div>
      </Section>

      <Section delay={0.1}>
        <div className="p-6 md:p-10">
          <div className="flex flex-col gap-2 mb-8 border-b border-zinc-800/50 pb-6">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">All Projects</h1>
            <p className="text-sm text-zinc-400">A complete archive of everything I've built, broken down by tech stack and purpose.</p>
          </div>
          <ProjectsSection />
        </div>
      </Section>

      <Section crosshair className="h-40 md:h-72" delay={0.2}>
        <div className="absolute bottom-8 right-6 md:-right-20 z-20">
          <button
            onClick={scrollToTop}
            className="p-3 bg-zinc-200 text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </Section>
    </>
  );
};
