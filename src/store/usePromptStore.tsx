import { OutlineCard } from '@/lib/types'
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

type page = 'create' | 'creative-ai' | 'creative-scratch'

type Prompt = {
  id: string
  createdAt: Date
  title: string
  outlines: OutlineCard[] | []
}

type PromptStore = {
  page: page
  setPage: (page: page) => void
  prompts: Prompt[] | []
  addPrompt: (newPrompt: Prompt) => void
  removePrompt: (id: string) => void
}

const usePromptStore = create<PromptStore>()(
  devtools(
    persist(
      (set) => ({
        page: 'create',
        setPage: (page: page) => set({ page }),
        prompts: [],
        addPrompt: (prompt: Prompt) =>
          set((state) => ({ prompts: [prompt, ...state.prompts] })),
        removePrompt: (id: string) =>
          set((state) => ({
            prompts: state.prompts.filter((prompt) => prompt.id !== id),
          })),
      }),
      {
        name: 'prompts',
      }
    )
  )
)

export default usePromptStore
