import { useEffect, useState } from "react";
import { fetchGithubData, GithubUser, GithubRepo } from "@/lib/api";
import { Github, Star, BookOpen } from "lucide-react";

export const GithubCard = ({ username = import.meta.env.VITE_GITHUB_USERNAME || "mqverk" }: { username?: string }) => {
  const [data, setData] = useState<{ user: GithubUser; repos: GithubRepo[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGithubData(username).then((res) => {
      if (res) setData(res);
      setLoading(false);
    });
  }, [username]);

  return (
    <div className="flex flex-col h-full gap-4 w-full">
      <div className="flex items-center gap-2 text-zinc-500">
        <Github className="w-5 h-5" />
        <span className="text-sm font-medium">GitHub Activity</span>
      </div>

      {loading ? (
        <div className="h-full w-full bg-zinc-900 border border-zinc-800 rounded-md animate-pulse"></div>
      ) : data ? (
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex gap-4 text-xs text-zinc-400">
            <span><strong>{data.user.public_repos}</strong> Repos</span>
            <span><strong>{data.user.followers}</strong> Followers</span>
          </div>
          
          <div className="flex flex-col gap-4 flex-1 overflow-y-auto custom-scrollbar">
            {data.repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="group grid grid-rows-[auto_1fr_auto] gap-1 p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-colors h-[104px] overflow-hidden"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-zinc-400 group-hover:text-zinc-300" />
                  <span className="font-medium text-zinc-200 group-hover:text-white truncate">{repo.name}</span>
                </div>
                {repo.description && (
                  <p className="text-xs text-zinc-500 truncate" title={repo.description}>{repo.description}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-zinc-600"></span>
                    {repo.language || 'Unknown'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" /> {repo.stargazers_count}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm border border-zinc-800 rounded-md border-dashed">
          Failed to load GitHub data.
        </div>
      )}
    </div>
  );
};
