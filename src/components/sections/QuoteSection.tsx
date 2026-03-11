import { useMemo } from "react";
import quotes from "@/data/quotes.json";

export const QuoteSection = () => {
  const quote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], []);

  return (
    <div className="py-24 px-6 md:px-10 flex justify-center text-center">
      <div className="flex flex-col items-center gap-6 max-w-lg">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-zinc-800">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className="text-zinc-200 font-medium italic text-lg md:text-xl leading-snug">
          &ldquo;{quote.text}&rdquo;
        </p>
        <div className="flex items-center gap-4 w-full mt-2">
          <div className="h-px bg-zinc-800 flex-grow"></div>
          <p className="text-zinc-500 text-[10px] tracking-[0.2em] font-medium uppercase">{quote.author}</p>
          <div className="h-px bg-zinc-800 flex-grow"></div>
        </div>
      </div>
    </div>
  );
}
