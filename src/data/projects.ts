export interface Project {
  id: number;
  title: string;
  href?: string;
  live?: string;
  createdAt: string;
  description: string;
  features: string[];
  badge: string[];
  image?: string; // Added image field
}

const projects: Project[] = [
  {
    id: 1,
    title: 'request-spammer',
    href: 'https://github.com/mqverk/request-spammer',
    createdAt: '04-12-2025',
    description:
      'A simple requests abuser written in Python. A lightweight utility for testing and stress-testing HTTP endpoints.',
    features: [
      'Configurable request parameters',
      'Support for multiple HTTP methods',
      'Real-time statistics and monitoring',
      'Easy-to-use command-line interface',
    ],
    badge: ['Python', 'HTTP', 'Testing'],
  },
  {
    id: 2,
    title: 'mqverk',
    href: 'https://github.com/mqverk/mqverk',
    createdAt: '17-04-2025',
    description:
      'Just some config files for my GitHub profile. A collection of configuration and setup files for development environments.',
    features: [
      'GitHub profile configuration',
      'Development environment setup',
      'Configuration templates',
    ],
    badge: ['Config', 'GitHub', 'Setup'],
  },
  {
    id: 3,
    title: 'hi-mqverk',
    href: 'https://github.com/mqverk/hi-mqverk',
    createdAt: '02-12-2025',
    description:
      'A minimal Node.js CLI that prints a custom terminal greeting with ASCII art and user info. A fun little utility for personalizing your terminal experience.',
    features: [
      'Custom ASCII art generation',
      'User information display',
      'Lightweight and minimal',
      'Easy to customize',
    ],
    badge: ['Node.js', 'JavaScript', 'CLI', 'ASCII'],
  },
];

export { projects };
