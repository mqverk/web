import { FaJs, FaReact, FaGithub, FaAws, FaPython } from 'react-icons/fa';
import {
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiPostman,
  SiDocker,
  SiApachekafka,
  SiArchlinux,
  SiExpress,
  SiMongodb,
  SiRedis,
  SiOpenai,
  SiGithubactions,
  SiSass,
  SiVite,
  SiNeovim,
  SiTmux,
  SiNpm,
  SiPnpm,
  SiEslint,
  SiNodedotjs,
  SiJest,
  SiGo,
  SiGnubash,
  SiTensorflow,
  SiPytorch,
  SiKubernetes,
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';

export const webdev = [
  {
    name: 'Go',
    description: 'Systems Programming',
    icon: <SiGo className="text-cyan-500 text-4xl" />,
  },
  {
    name: 'C/C++',
    description: 'Low-level Development',
    icon: <FaReact className="text-blue-600 text-4xl" />,
  },
  {
    name: 'Python',
    description: 'ML & Scripting',
    icon: <FaPython className="text-blue-500 text-4xl" />,
  },
  {
    name: 'Bash/Shell',
    description: 'Shell Scripting',
    icon: <SiGnubash className="text-gray-800 dark:text-gray-400 text-4xl" />,
  },
  {
    name: 'TypeScript',
    description: 'JavaScript with Types',
    icon: <SiTypescript className="text-blue-400 text-3xl" />,
  },
  {
    name: 'JavaScript',
    description: 'Languages of the web',
    icon: <FaJs className="text-yellow-400 text-4xl" />,
  },
  {
    name: 'ReactJS',
    description: 'A JavaScript Library',
    icon: <FaReact className="text-sky-400 text-4xl" />,
  },
  {
    name: 'NextJS',
    description: 'React Framework',
    icon: <SiNextdotjs className="text-foreground text-4xl" />,
  },
];

export const tools = [
  {
    name: 'Git & GitHub',
    description: 'Version Control',
    icon: <FaGithub className="text-gray-800 dark:text-gray-400 text-4xl" />,
  },
  {
    name: 'VS Code',
    description: 'Code Editor',
    icon: <VscVscode className="text-blue-500 text-4xl" />,
  },
  {
    name: 'Neovim',
    description: 'Terminal Text Editor',
    icon: <SiNeovim className="text-green-500 text-4xl" />,
  },
  {
    name: 'Tmux',
    description: 'Terminal Multiplexer',
    icon: <SiTmux className="text-green-500 text-4xl" />,
  },
  {
    name: 'NPM & PNPM',
    description: 'Package Managers',
    icon: <SiNpm className="text-red-500 text-4xl" />,
  },
  {
    name: 'Arch Linux',
    description: 'Linux Distribution',
    icon: <SiArchlinux className="text-blue-400 text-4xl" />,
  },
  {
    name: 'Postman',
    description: 'API Testing',
    icon: <SiPostman className="text-orange-500 text-4xl" />,
  },
  {
    name: 'Docker',
    description: 'Containerization',
    icon: <SiDocker className="text-blue-400 text-4xl" />,
  },
];

export const database = [
  {
    name: 'TensorFlow',
    description: 'ML Framework',
    icon: <SiTensorflow className="text-orange-500 text-4xl" />,
  },
  {
    name: 'PyTorch',
    description: 'Deep Learning',
    icon: <SiPytorch className="text-red-600 text-4xl" />,
  },
  {
    name: 'MongoDB',
    description: 'NoSQL Database',
    icon: <SiMongodb className="text-green-500 text-4xl" />,
  },
  {
    name: 'Redis',
    description: 'In-Memory Data Store',
    icon: <SiRedis className="text-red-500 text-4xl" />,
  },
];

export const devops = [
  {
    name: 'AWS',
    description: 'Cloud Computing',
    icon: <FaAws className="text-orange-500 text-4xl" />,
  },
  {
    name: 'Kubernetes',
    description: 'Container Orchestration',
    icon: <SiKubernetes className="text-blue-600 text-4xl" />,
  },
  {
    name: 'Apache Kafka',
    description: 'Distributed Streaming Platform',
    icon: <SiApachekafka className="text-gray-500 text-4xl" />,
  },
  {
    name: 'CI/CD',
    description: 'CI/CD with GitHub Actions',
    icon: <SiGithubactions className="text-gray-800 dark:text-gray-400 text-4xl" />,
  },
];
