'use client';

import { lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Briefcase, BookOpen, Mail } from 'lucide-react';
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
        <main className="grow px-4 max-w-4xl mx-auto py-8 w-full">
          {/* Hero Section */}
          <div>
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
            <div className="flex flex-wrap gap-3 mb-6">
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

            {/* Divider */}
            <div className="h-px bg-border/50 my-6" />
          </div>
        </main>

        {/* Activity Feed Section */}
        <div className="px-4 max-w-4xl mx-auto w-full">
          <Suspense fallback={<div className="h-40 animate-pulse bg-muted rounded-lg" />}>
            <Activities />
          </Suspense>
        </div>

        {/* Contact Section */}
        <section className="px-4 max-w-4xl mx-auto w-full mt-16">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-6 w-6 text-foreground/60" />
              <h2 className="text-3xl font-bold">Get In Touch</h2>
            </div>
            <p className="text-muted-foreground max-w-md">
              Have a question, idea, or opportunity? I'd love to hear from you. Send me a message
              and I'll get back to you as soon as possible.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/5 to-transparent rounded-2xl pointer-events-none" />
            <div className="relative border border-border/50 rounded-2xl p-8 bg-gradient-to-br from-foreground/[0.02] to-transparent backdrop-blur-sm">
              <Suspense fallback={<div className="h-32 animate-pulse bg-muted rounded-lg" />}>
                <DiscordMessageBox />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Footer Spacing */}
        <div className="h-8" />
      </div>
    </>
  );
}
