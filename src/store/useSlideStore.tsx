import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Slide } from '@/lib/types'
import { Project } from '@prisma/client'
import { Theme } from '@/lib/types'

interface SlideState {
  slides: Slide[]
  project: Project | null
  setProject: (project: Project) => void

  setSlides: (slides: Slide[]) => void
  currentTheme: Theme | null
  setCurrentTheme: (theme: Theme) => void
}

const defaultTheme: Theme = {
  name: 'Default',
  fontFamily: 'Arial, sans-serif',
  fontcolor: '#000000',
  backgroundColor: '#FFFFFF',
  slideBackgroundColor: '#F0F0F0',
  accentColor: '#0070f3',
  sidebarColor: '#FFFFFF',
  navColor: '#FFFFFF',
  type: 'light',
}

export const useSlideStore = create(
  persist<SlideState>(
    (set) => ({
      project: null,
      slides: [],
      currentTheme: defaultTheme,
      setSlides: (slides: Slide[]) => set({ slides }),
      setProject: (project: Project) => set({ project }),
      setCurrentTheme: (theme: Theme) => set({ currentTheme: theme }),
    }),
    {
      name: 'slide-storage',
    }
  )
)
