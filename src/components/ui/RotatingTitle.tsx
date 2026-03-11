import { useState, useEffect, useCallback } from "react";

interface RotatingTitleProps {
  titles: string[];
}

export const RotatingTitle = ({ titles }: RotatingTitleProps) => {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const current = titles[index];
    if (!isDeleting) {
      setDisplayed(current.slice(0, displayed.length + 1));
      if (displayed.length + 1 === current.length) {
        setTimeout(() => setIsDeleting(true), 1800);
        return;
      }
    } else {
      setDisplayed(current.slice(0, displayed.length - 1));
      if (displayed.length - 1 === 0) {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % titles.length);
        return;
      }
    }
  }, [displayed, isDeleting, index, titles]);

  useEffect(() => {
    if (!titles || titles.length === 0) return;
    const speed = isDeleting ? 35 : 65;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, titles, isDeleting]);

  if (!titles || titles.length === 0) return null;

  return (
    <span className="inline-flex items-center" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <span className="text-zinc-600 mr-1">&gt;</span>
      <span>{displayed}</span>
      <span className="ml-0.5 inline-block animate-pulse">_</span>
    </span>
  );
};
