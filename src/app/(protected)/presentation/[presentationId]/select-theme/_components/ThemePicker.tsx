'use client'

import React from 'react'
import { Slide, Theme } from '@/lib/types'
import { useParams, useRouter } from 'next/navigation'
import { useSlideStore } from '@/store/useSlideStore'
import { Button } from '@/components/ui/button'
import { Wand2, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'
import { generateLayout } from '@/actions/llama'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type Props = {
  selectedTheme: Theme | null
  themes: Theme[]
  onThemeSelect: (theme: Theme) => void
}

const ThemePicker = ({ selectedTheme, themes, onThemeSelect }: Props) => {
  const params = useParams<{ presentationId: string }>()
  const router = useRouter()
  const { project, setSlides, currentTheme } = useSlideStore()
  const [loading, setLoading] = React.useState(false)
  const activeTheme = selectedTheme ?? currentTheme

  const handleGenerateLayout = async () => {
    if (!activeTheme) {
      toast.error('Error', {
        description: 'Please select a theme',
      })
      return
    }

    if (!project?.id) {
      toast.error('Error', {
        description: 'Project not found',
      })
      router.push('/create-page')
      return
    }

    setLoading(true)
    try {
      const res = await generateLayout(project.id, activeTheme)

      if (res.status !== 200 || !res.data) {
        toast.error('Failed to apply theme', {
          description: res.error ?? 'Please try again.',
        })
        return
      }

      setSlides(res.data as Slide[])
      toast.success('Theme applied', {
        description: `${activeTheme.name} theme is ready.`,
      })

      if (params?.presentationId) {
        router.push(`/presentation/${params.presentationId}`)
      }
    } catch (error) {
      console.error(error)
      toast.error('Error', {
        description: 'Failed to generate layout.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed right-0 top-0 h-screen w-[400px] flex flex-col overflow-y-auto border-l"
      style={{
        backgroundColor:
          currentTheme?.sidebarColor ||
          currentTheme?.backgroundColor ||
          '#FFFFFF',
        borderLeft: `1px solid ${currentTheme?.accentColor || '#0070f3'}20`,
        fontFamily: activeTheme?.fontFamily,
      }}
    >
      <div className="p-8 space-y-6 flex-shrink-0">
        <div className="space-y-2">
          <h2
            className="text-3xl font-bold tracking-tight"
            style={{
              color: currentTheme?.accentColor,
            }}
          >
            Select a Theme
          </h2>
          <p
            className="text-sm"
            style={{
              color: currentTheme?.fontcolor,
            }}
          >
            Choose a theme for your presentation
          </p>
          <Button
            className="w-full h-12 text-lg font-medium mt-6 shadow-lg hover:shadow-xl transition-all duration-300"
            style={{
              backgroundColor: activeTheme?.accentColor,
              color: '#FFFFFF',
            }}
            disabled={loading}
            onClick={handleGenerateLayout}
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
            ) : (
              <Wand2 className="mr-2 h-5 w-5" />
            )}

            {loading ? (
              <p className="animate-pulse">Generating...</p>
            ) : (
              'Apply Theme'
            )}
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-grow p-8 pb-8">
        <div className="grid grid-cols-1 gap-4">
          {themes.map((theme) => {
            const isActive = (selectedTheme ?? currentTheme)?.name === theme.name

            return (
              <motion.div
                key={theme.name}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  disabled={loading}
                  onClick={() => onThemeSelect(theme)}
                  className={cn(
                    'flex flex-col items-start gap-4 w-full p-5 h-auto rounded-2xl border transition-all duration-200 hover:bg-transparent hover:text-inherit focus-visible:ring-0 focus-visible:ring-offset-0',
                    isActive
                      ? 'border-white/80 shadow-lg shadow-black/20'
                      : 'border-white/10 hover:border-white/40'
                  )}
                  style={{
                    fontFamily: theme.fontFamily,
                    color: theme.fontcolor,
                    backgroundColor: theme.backgroundColor,
                    backgroundImage: theme.gradientBackground,
                  }}
                >
                  <div className="flex w-full items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold">{theme.name}</p>
                      <p className="text-sm opacity-80 capitalize">
                        {theme.type} theme
                      </p>
                    </div>
                    {isActive && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="flex w-full items-center justify-between gap-4">
                    <p className="text-sm opacity-80">
                      Accent: {theme.accentColor}
                    </p>
                    <div className="flex items-center gap-2">
                      {[theme.accentColor, theme.fontcolor, theme.backgroundColor]
                        .filter(Boolean)
                        .map((color) => (
                          <span
                            key={`${theme.name}-${color}`}
                            className="h-5 w-5 rounded-full border border-white/40"
                            style={{ backgroundColor: color as string }}
                          />
                        ))}
                    </div>
                  </div>
                </Button>
              </motion.div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

export default ThemePicker
