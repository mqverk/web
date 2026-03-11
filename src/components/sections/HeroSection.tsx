import { Button } from "@/components/ui/button";
import { Mail, Calendar } from "lucide-react";
import profileData from "@/data/profile.json";
import { RotatingTitle } from "@/components/ui/RotatingTitle";

export const HeroSection = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 shrink-0 rounded-xl bg-zinc-800 overflow-hidden border border-zinc-700 shadow-sm">
          <img
            src="https://avatars.githubusercontent.com/u/189636445?v=4"
            alt={profileData.name}
            className="h-full w-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-500"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-50">
            {profileData.name}
          </h1>
          <div className="text-zinc-500 text-sm min-h-[20px]">
            <RotatingTitle titles={profileData.rotatingTitles} />
          </div>
        </div>
      </div>

      <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
        Hey, I'm {profileData.name.split(" ")[0]} — a developer interested in OS development, cybersecurity, and free & open-source software. I build tools and explore low-level systems, with a focus on security and performance.
        <br/><br/>
        I run Arch Linux, live in the terminal, and prefer working close to the metal. Always open to collaborating on interesting FOSS projects.
      </p>

      <div className="flex items-center gap-3 pt-2">
        <Button
          className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition-all font-medium text-sm h-9 px-4 rounded-md shadow-[0_0_15px_rgba(255,255,255,0.05)]"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Book an intro call
        </Button>
        <Button
          variant="outline"
          className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-50 transition-all font-medium text-sm h-9 px-4 rounded-md"
        >
          <Mail className="mr-2 h-4 w-4" />
          Send an email
        </Button>
      </div>
    </div>
  );
};
