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
      'A Python-based load testing and stress testing tool designed to hammer HTTP endpoints with configurable request patterns. Perfect for evaluating server performance, identifying bottlenecks, and testing API resilience under high-traffic conditions.',
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
      'A curated collection of GitHub profile configurations, dotfiles, and development environment templates. Streamlines the setup process for new development machines and ensures consistent tooling across projects.',
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
      'A lightweight Node.js CLI tool that transforms your terminal experience with personalized ASCII art greetings and user information display. Adds a touch of personality to your shell startup while maintaining minimal overhead and fast load times.',
    features: [
      'Custom ASCII art generation',
      'User information display',
      'Lightweight and minimal',
      'Easy to customize',
    ],
    badge: ['Node.js', 'JavaScript', 'CLI', 'ASCII'],
  },
  {
    id: 4,
    title: 'calculator',
    href: 'https://github.com/mqverk/calculator',
    createdAt: '19-12-2025',
    description:
      'A feature-rich web-based scientific calculator built with vanilla HTML, CSS, and JavaScript. Supports multiple calculation modes including basic, scientific, advanced, and programmer modes with an intuitive, responsive interface.',
    features: [
      'Multiple calculation modes (basic, scientific, advanced, programmer)',
      'Responsive web design',
      'Real-time calculations',
      'Comprehensive mathematical functions',
    ],
    badge: ['JavaScript', 'HTML', 'CSS', 'Web'],
  },
];

export { projects };
