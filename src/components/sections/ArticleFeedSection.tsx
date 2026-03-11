import { ArrowUpRight, CalendarDays, Eye, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ArticleFeedSectionProps {
  limit?: number;
}

interface MediumArticle {
  title: string;
  pubDate: string;
  link: string;
  categories: string[];
}

export const ArticleFeedSection = ({ limit }: ArticleFeedSectionProps) => {
  const [articles, setArticles] = useState<MediumArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const username = "mqverk";
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${username}`);
        const data = await res.json();
        
        if (data.items) {
          const formattedArticles = data.items.map((item: any) => ({
             title: item.title,
             pubDate: new Date(item.pubDate.replace(' ', 'T')).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
             link: item.link,
             categories: item.categories || [],
          }));
          setArticles(limit ? formattedArticles.slice(0, limit) : formattedArticles);
        }
      } catch (err) {
        console.error("Failed to fetch Medium articles", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [limit]);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-100">
        Blogs
      </h2>
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex justify-center items-center py-10">
             <Loader2 className="h-6 w-6 text-zinc-500 animate-spin" />
          </div>
        ) : articles.length > 0 ? (
          articles.map((article, idx) => (
            <a
              key={idx}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col p-4 rounded-xl border border-transparent hover:border-zinc-800 hover:bg-zinc-900/50 transition-all gap-2 relative"
            >
              <div className="absolute top-4 right-4 text-zinc-600 group-hover:text-zinc-400 transition-colors">
                <ArrowUpRight className="h-4 w-4" />
              </div>
              <h3 className="font-medium text-zinc-200 group-hover:text-zinc-50 transition-colors pr-8">
                {article.title}
              </h3>
              
              <div className="flex items-center gap-1 text-xs text-zinc-500 mb-2 mt-1">
                <CalendarDays className="h-3 w-3" />
                <span>{article.pubDate}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex gap-2 flex-wrap">
                   {article.categories.map((tag: string) => (
                     <span key={tag} className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900/40 text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                       {tag.length > 15 ? tag.substring(0, 15) + '...' : tag}
                     </span>
                   ))}
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="text-zinc-500 text-sm py-4">No articles found.</div>
        )}
      </div>
    </div>
  );
};
