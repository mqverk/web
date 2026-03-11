import { PageWrapper, Section } from "./components/layout/PageWrapper";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home").then(module => ({ default: module.Home })));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage").then(module => ({ default: module.ProjectsPage })));

function App() {
  return (
    <PageWrapper>
      <Suspense fallback={<div className="min-h-screen w-full bg-[#0a0a0a]" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
      </Suspense>
      
      <footer className="w-full flex justify-center py-8 relative z-10 bg-[#0a0a0a] border-t border-zinc-900/50">
        <div className="w-full max-w-3xl px-6 flex flex-col items-center gap-2 text-[11px] text-zinc-500 font-medium tracking-tight">
          <p>© {new Date().getFullYear()} Maverick. Built with React & Tailwind.</p>
          <div className="flex items-center gap-3 text-zinc-600">
            <span className="h-1 w-1 rounded-full bg-zinc-800" />
            <span>High Signal, Low Noise</span>
            <span className="h-1 w-1 rounded-full bg-zinc-800" />
          </div>
        </div>
      </footer>
    </PageWrapper>
  );
}

export default App;
