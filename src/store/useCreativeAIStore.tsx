import { OutlineCard } from '@/lib/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CreativeAIStore = {
  outlines: OutlineCard[] | []
  addMultipleOutlines: (newOutlines: OutlineCard[]) => void
  addOutline: (newOutline: OutlineCard) => void
  currentAiPrompt: string
  setCurrentAiPrompt: (prompt: string) => void
  resetOutlines: () => void
}

const useCreativeAIStore = create<CreativeAIStore>()(
  persist(
    (set) => ({
      currentAiPrompt: '',
      setCurrentAiPrompt: (prompt: string) => set({ currentAiPrompt: prompt }),
      outlines: [],
      addMultipleOutlines: (newOutlines: OutlineCard[]) =>
        set(() => ({
          outlines: newOutlines,
        })),
      addOutline: (newOutline: OutlineCard) =>
        set((state) => ({
          outlines: [...state.outlines, newOutline],
        })),
      resetOutlines: () => set({ outlines: [] }),
    }),
    {
      name: 'creative-ai',
    }
  )
)

export default useCreativeAIStore
