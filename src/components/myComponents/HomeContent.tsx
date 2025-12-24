'use client';

import { lazy, Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { Copy, Check, Terminal, Code, Briefcase, BookOpen } from 'lucide-react';
import Link from 'next/link';

// Dynamically import heavy animation libraries
const Typewriter = dynamic(() => import('typewriter-effect'), {
  ssr: false,
  loading: () => <span className="text-2xl">Full Stack Developer, India</span>,
});

// Lazy load components below the fold
const Activities = lazy(() => import('@/components/myComponents/Activities/Activities'));
const DiscordMessageBox = lazy(() => import('@/components/myComponents/Contact/MessageBox'));

export default function HomeContent() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText('npx hello-maverick');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Who is Maverick?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Maverick is a Full Stack Developer from India, specializing in building scalable and efficient web applications using modern technologies like React, Next.js, and TypeScript.',
        },
      },
      {
        '@type': 'Question',
        name: 'What technologies does Maverick work with?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Maverick works with React, Next.js, TypeScript, JavaScript, Node.js, Tailwind CSS, and various other modern web development tools and frameworks.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="flex flex-col">
        <main className="grow px-4 max-w-4xl mx-auto py-8">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="mb-6">
              <h1 className="text-5xl sm:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Maverick
              </h1>
              <div className="text-lg sm:text-xl text-muted-foreground font-medium h-8 flex items-center mb-6">
                <span className="mr-2 text-foreground/40">{'>'}</span>
                <Typewriter
                  options={{
                    strings: ['Full Stack Developer', 'Tech Enthusiast', 'Open For Internships'],
                    autoStart: true,
                    loop: true,
                    delay: 50,
                    deleteSpeed: 30,
                    cursor: '_',
                  }}
                />
              </div>
            </div>

            {/* Introduction */}
            <div className="space-y-4 mb-8">
              <p className="text-base sm:text-lg text-foreground/80 leading-relaxed max-w-2xl">
                I build scalable web applications with modern technologies. Passionate about clean
                code, great user experiences, and solving real-world problems through software.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                Full Stack Developer specializing in React, Next.js, and TypeScript. Currently
                exploring OS development, cybersecurity, and machine learning.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={handleCopy}
                className="group cursor-pointer flex items-center gap-3 px-4 py-2.5 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:shadow-sm"
                aria-label="Copy npx command"
              >
                <Terminal className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <code className="font-mono text-sm text-foreground">npx hello-maverick</code>
                <div className="pl-2 border-l border-border/50 ml-1">
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-500 animate-in zoom-in" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </div>
              </button>

              <Link
                href="/projects"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-foreground/5 hover:bg-foreground/10 transition-all duration-200 text-foreground/80 hover:text-foreground font-medium text-sm hover:shadow-sm"
              >
                <Briefcase className="h-4 w-4" />
                View Projects
              </Link>

              <Link
                href="/blog"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-foreground/5 hover:bg-foreground/10 transition-all duration-200 text-foreground/80 hover:text-foreground font-medium text-sm hover:shadow-sm"
              >
                <BookOpen className="h-4 w-4" />
                Read Blog
              </Link>
            </div>
          </div>
        </main>

        {/* Activity Feed Section */}
        <div className="px-4 max-w-4xl mx-auto w-full">
          <Suspense fallback={<div className="h-40 animate-pulse bg-muted rounded-lg" />}>
            <Activities />
          </Suspense>
        </div>

        {/* Contact Section */}
        <section className="mt-16 border-t pt-12 px-4 max-w-4xl mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Let's Connect</h2>
            <p className="text-muted-foreground">
              Have a question or want to collaborate? Drop me a message.
            </p>
          </div>

          <Suspense fallback={<div className="h-32 animate-pulse bg-muted rounded-lg" />}>
            <DiscordMessageBox />
          </Suspense>
        </section>

        {/* Footer Spacing */}
        <div className="h-8" />
      </div>
    </>
  );
}
