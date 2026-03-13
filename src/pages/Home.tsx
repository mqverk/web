import { lazy, Suspense } from "react";
import { Section } from "@/components/layout/PageWrapper";
import { ProfileSection } from "@/components/sections/ProfileSection";
import { ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Lazy load below-the-fold components
const SkillsSection = lazy(() => import("@/components/sections/SkillsSection").then(m => ({ default: m.SkillsSection })));
import { ProjectsSection } from "@/components/sections/ProjectsSection";
const ArticleFeedSection = lazy(() => import("@/components/sections/ArticleFeedSection").then(m => ({ default: m.ArticleFeedSection })));
const QuoteSection = lazy(() => import("@/components/sections/QuoteSection").then(m => ({ default: m.QuoteSection })));
const LastfmCard = lazy(() => import("@/components/dynamic/LastfmCard").then(m => ({ default: m.LastfmCard })));
const GithubCard = lazy(() => import("@/components/dynamic/GithubCard").then(m => ({ default: m.GithubCard })));

const FallbackLoader = () => <div className="p-6 md:p-10 text-zinc-600 text-sm animate-pulse">Loading...</div>;

export const Home = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const navigate = useNavigate();

  return (
    <>
      <Section crosshair className="h-32 md:h-56" delay={0}>
        {null}
      </Section>

      <Section delay={0.1}>
        <ProfileSection />
      </Section>

      <Section delay={0.2} bottomLabel="View All" onBottomLabelClick={() => navigate("/projects")}>
        <Suspense fallback={<FallbackLoader />}>
          <div className="p-6 md:p-10">
            <ProjectsSection limit={4} />
          </div>
        </Suspense>
      </Section>

      <Section delay={0.3} bottomLabel="View All" onBottomLabelClick={() => window.open(import.meta.env.VITE_MEDIUM_URL || "https://github.com/mqverk", "_blank")}>
        <Suspense fallback={<FallbackLoader />}>
          <div className="p-6 md:p-10">
            <ArticleFeedSection limit={4} />
          </div>
        </Suspense>
      </Section>

      <Section delay={0.4}>
        <Suspense fallback={<FallbackLoader />}>
          <div className="p-6 md:p-10">
            <SkillsSection />
          </div>
        </Suspense>
      </Section>

      <Section delay={0.5}>
        <Suspense fallback={<FallbackLoader />}>
          <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <LastfmCard />
            <GithubCard username={import.meta.env.VITE_GITHUB_USERNAME || "mqverk"} />
          </div>
        </Suspense>
      </Section>

      <Section delay={0.6}>
        <Suspense fallback={<FallbackLoader />}>
          <QuoteSection />
        </Suspense>
      </Section>

      <Section crosshair className="h-40 md:h-72" delay={0.7}>
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
