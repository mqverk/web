import { TechStack, GitHub } from '@/components/myComponents/stats';
import React from 'react';
import { webdev, tools, database, devops } from '@/data/techstack';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'mqverk // about',
  description:
    'Learn more about Maverick, a Full Stack Developer passionate about building scalable web applications with modern technologies like React, Next.js, and TypeScript.',
  openGraph: {
    title: 'mqverk // about',
    description:
      'Learn more about Maverick, a Full Stack Developer passionate about building scalable web applications',
    url: 'https://mqverk.me/about',
    siteName: 'mqverk Portfolio',
    images: [
      {
        url: 'https://mqverk.me/og?title=About%20%E2%80%94%20mqverk&description=Learn%20more%20about%20a%20Full%20Stack%20Developer',
        width: 1200,
        height: 630,
        alt: 'About mqverk',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'mqverk // about',
    description: 'Learn more about a Full Stack Developer.',
    images: [
      'https://mqverk.me/og?title=About%20%E2%80%94%20mqverk&description=Learn%20more%20about%20a%20Full%20Stack%20Developer',
    ],
  },
  alternates: {
    canonical: 'https://mqverk.me/about',
  },
};

export default function page() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://mqverk.me',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About',
        item: 'https://mqverk.me/about',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">About</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            I'm a full stack developer passionate about building scalable web applications with
            modern technologies. I specialize in frontend and backend development, creating seamless
            user experiences paired with robust systems.
          </p>
        </div>

        {/* Tech Stack Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Tech Stack</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                Web Development
              </h3>
              <TechStack techStack={webdev} />
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                Tools & Platforms
              </h3>
              <TechStack techStack={tools} />
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                Databases & Storage
              </h3>
              <TechStack techStack={database} />
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                DevOps & Cloud
              </h3>
              <TechStack techStack={devops} />
            </div>
          </div>
        </section>

        {/* GitHub Contributions */}
        <section className="mb-16 border-t pt-12">
          <h2 className="text-2xl font-bold mb-8">Activity</h2>
          <GitHub />
        </section>

        {/* Interests */}
        <section className="border-t pt-12">
          <h2 className="text-2xl font-bold mb-6">Interests</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">OS Development</h3>
              <p className="text-muted-foreground leading-relaxed">
                Deep diving into kernel internals, memory management, and building operating systems
                from scratch.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Cyber Security</h3>
              <p className="text-muted-foreground leading-relaxed">
                Exploring vulnerabilities, penetration testing, and securing systems against modern
                threats.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Machine Learning</h3>
              <p className="text-muted-foreground leading-relaxed">
                Building models and exploring AI architectures. Enthusiastic about bringing
                intelligence to edge devices.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">FOSS, AOSP & Linux</h3>
              <p className="text-muted-foreground leading-relaxed">
                Contributing to open-source projects, customizing Android Open Source Project, and
                exploring the depths of Linux ecosystems.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
