import { Variants } from 'framer-motion'
import { Theme } from './types'

export const data = {
  user: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/avatar/johndoe.png',
  },

  navMain: [
    {
      title: 'Home',
      url: '/dashboard',
      icon: 'home',
    },
    {
      title: 'Share',
      url: '/share',
      icon: 'share',
    },
    {
      title: 'Trash',
      url: '/trash',
      icon: 'trash2',
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: 'settings',
    },
  ],
}

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
}

export const themes: Theme[] = [
  {
    name: 'Light',
    type: 'light',
    fontFamily: 'Inter, sans-serif',
    fontcolor: '#1E293B',
    backgroundColor: '#F3F4F6',
    slideBackgroundColor: '#FFFFFF',
    accentColor: '#2563EB',
    gradientBackground: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
    sidebarColor: '#F9FAFB',
    navColor: '#FFFFFF',
  },
  {
    name: 'Dark',
    type: 'dark',
    fontFamily: 'Inter, sans-serif',
    fontcolor: '#FFFFFF',
    backgroundColor: '#1E1E1E',
    slideBackgroundColor: '#232526',
    accentColor: '#8B5CF6',
    gradientBackground: 'linear-gradient(135deg, #232526 0%, #1E1E1E 100%)',
    sidebarColor: '#2A2A2A',
    navColor: '#181818',
  },
  {
    name: 'Midnight Purple',
    type: 'dark',
    fontFamily: 'Poppins, sans-serif',
    fontcolor: '#E0E0E0',
    backgroundColor: '#0B0B1A',
    slideBackgroundColor: '#1A103D',
    accentColor: '#9D4EDD',
    gradientBackground: 'linear-gradient(135deg, #3A0CA3 0%, #7209B7 100%)',
    sidebarColor: '#130C2E',
    navColor: '#1E1E2E',
  },
  {
    name: 'Solar Dawn',
    type: 'light',
    fontFamily: 'Nunito, sans-serif',
    fontcolor: '#222222',
    backgroundColor: '#FFF8E7',
    slideBackgroundColor: '#FFF2CC',
    accentColor: '#FF9900',
    gradientBackground: 'linear-gradient(135deg, #FFE259 0%, #FFA751 100%)',
    sidebarColor: '#FFF3D0',
    navColor: '#FFF5E1',
  },
  {
    name: 'Cyber Neon',
    type: 'dark',
    fontFamily: 'Orbitron, sans-serif',
    fontcolor: '#D1F7FF',
    backgroundColor: '#050505',
    slideBackgroundColor: '#0A0A0A',
    accentColor: '#00FFFF',
    gradientBackground: 'linear-gradient(135deg, #00FFFF 0%, #FF00FF 100%)',
    sidebarColor: '#0D0D0D',
    navColor: '#050505',
  },
]

export const CreatePageCard = [
  {
    title: 'Use a',
    highlightedText: 'Template',
    description: 'Write a prompt and leave everything else for us to handle',
    type: 'template',
    cta: 'Continue',
  },
  {
    title: 'Generate with',
    highlightedText: 'Creative AI',
    description: 'Write a prompt and leave everything else for us to handle',
    type: 'creative-ai',
    highlight: true,
    cta: 'Generate',
  },
  {
    title: 'Start from',
    highlightedText: 'Scratch',
    description: 'Write a prompt and leave everything else for us to handle',
    type: 'create-scratch',
    cta: 'Continue',
  },
]
