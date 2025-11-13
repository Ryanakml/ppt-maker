import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ContentItem, Slide, Theme } from '@/lib/types'
import { Project } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

interface SlideState {
  slides: Slide[]
  project: Project | null
  currentTheme: Theme | null
  currentSlide: number

  setProject: (project: Project) => void
  setSlides: (slides: Slide[]) => void
  setCurrentTheme: (theme: Theme) => void

  getOrderedSlides: () => Slide[]
  reorderSlides: (fromIndex: number, toIndex: number) => void

  removeSlide: (id: string) => void
  addSlideAtIndex: (slide: Slide, index: number) => void

  setCurrentSlide: (index: number) => void
  updateContentItem: (
    slideId: string,
    contentId: string,
    newContent: string | string[] | string[][]
  ) => void
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
    (set, get) => ({
      project: null,
      slides: [],
      currentTheme: defaultTheme,
      currentSlide: 0,

      setProject: (project) => set({ project }),
      setSlides: (slides) => set({ slides }),
      setCurrentTheme: (theme) => set({ currentTheme: theme }),

      getOrderedSlides: () => {
        const { slides } = get()
        return [...slides].sort((a, b) => a.slideOrder - b.slideOrder)
      },

      setCurrentSlide: (index: number) => set({ currentSlide: index }),

      reorderSlides: (fromIndex, toIndex) => {
        set((state) => {
          const newSlides = [...state.slides]
          const [removed] = newSlides.splice(fromIndex, 1)
          newSlides.splice(toIndex, 0, removed)

          return {
            slides: newSlides.map((slide, index) => ({
              ...slide,
              slideOrder: index,
            })),
          }
        })
      },

      updateContentItem: (slideId, contentId, newContent) => {
        set((state) => {
          const updateContentRecursively = (item: ContentItem): ContentItem => {
            if (item.id === contentId) {
              return { ...item, content: newContent }
            }

            if (
              Array.isArray(item.content) &&
              item.content.every((i) => typeof i === 'string')
            ) {
              return {
                ...item,
                content: item.content.map((subItem) => {
                  if (typeof subItem === 'string') {
                    return updateContentRecursively(
                      subItem as unknown as ContentItem
                    )
                  }
                  return subItem
                }),
              }
            }

            return item
          }

          return {
            slides: state.slides.map((slide) =>
              slide.id === slideId
                ? { ...slide, content: updateContentRecursively(slide.content) }
                : slide
            ),
          }
        })
      },

      removeSlide: (id) =>
        set((state) => ({
          slides: state.slides.filter((slide) => slide.id !== id),
        })),

      addSlideAtIndex: (slide, index) =>
        set((state) => {
          const newSlides = [...state.slides]
          newSlides.splice(index, 0, { ...slide, id: uuidv4() })
          const reordered = newSlides.map((s, idx) => ({
            ...s,
            slideOrder: idx,
          }))
          return { slides: reordered, currentSlide: index }
        }),
    }),
    {
      name: 'slide-storage',
    }
  )
)
