import { useEffect, useState } from "react";
import { fetchMediumPosts, MediumPost } from "@/lib/api";
import { Edit3 } from "lucide-react";

export const MediumCard = ({ username = "mqverk" }: { username?: string }) => {
  const [posts, setPosts] = useState<MediumPost[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMediumPosts(username).then((res) => {
      setPosts(res);
      setLoading(false);
    });
  }, [username]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-2 text-zinc-500">
        <Edit3 className="w-5 h-5" />
        <span className="text-sm font-medium">Latest Thoughts</span>
      </div>

      {loading ? (
        <div className="flex-1 mt-2 space-y-3">
          {[1, 2].map((i) => (
             <div key={i} className="h-16 w-full bg-zinc-900 border border-zinc-800 rounded-md animate-pulse"></div>
          ))}
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
          {posts.map((post, idx) => {
             // Extract date
             const pubDate = new Date(post.pubDate).toLocaleDateString('en-US', {
               month: 'short', day: 'numeric', year: 'numeric'
             });

             return (
              <a
                key={idx}
                href={post.link}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-colors"
              >
                <span className="font-medium text-zinc-200 group-hover:text-white line-clamp-2 text-sm">
                  {post.title}
                </span>
                <span className="text-xs text-zinc-500 mt-2">{pubDate}</span>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm border border-zinc-800 rounded-md border-dashed">
          No Medium posts found.
        </div>
      )}
    </div>
  );
};
