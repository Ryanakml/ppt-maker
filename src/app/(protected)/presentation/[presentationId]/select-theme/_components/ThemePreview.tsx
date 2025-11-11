import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSlideStore } from '@/store/useSlideStore'
import { useEffect } from 'react'
import { useAnimation } from 'framer-motion'
import { Theme } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import ThemeCard from './ThemeCard'

type Props = {}

const ThemePreview = (props: Props) => {
  const params = useParams()
  const router = useRouter()
  const controls = useAnimation()
  const { project, currentTheme } = useSlideStore()
  const [selectedTheme, setSelectedTheme] = React.useState<Theme | null>(
    currentTheme
  )

  useEffect(() => {
    if (!selectedTheme && currentTheme) {
      setSelectedTheme(currentTheme)
    }
  }, [currentTheme, selectedTheme])

  useEffect(() => {
    if (project?.slides) {
      router.prefetch(`/presentation/${params.presentationId}`)
    }
  }, [params.presentationId, project, router])

  useEffect(() => {
    router.prefetch('/create-page')
  }, [router])

  useEffect(() => {
    controls.start('visible')
  }, [controls, selectedTheme])

  const activeTheme = selectedTheme ?? currentTheme

  if (!activeTheme) {
    return null
  }

  const leftCardContent = (
    <div className="space-y-4">
      <div
        className="rounded-xl p-4"
        style={{ background: activeTheme.accentColor + '10' }}
      >
        <h3 className="text-xl font-semibold mb-4">Quick Start Guide</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Choose a template</li>
          <li>Customize your slides</li>
          <li>Add your content</li>
          <li>Preview and publish</li>
        </ol>
        <Button
          className="w-full h-12 text-lg font-medium"
          style={{
            backgroundColor: activeTheme.accentColor,
            color: activeTheme.accentColor,
          }}
        >
          Get Started
        </Button>
      </div>
    </div>
  )

  const mainCardContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: activeTheme.accentColor + '10' }}
        >
          <p style={{ color: activeTheme.accentColor }}>
            This is a preview of the theme: {activeTheme.name}
          </p>
        </div>
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: activeTheme.accentColor + '10' }}
        >
          <p style={{ color: activeTheme.accentColor }}>
            You can change the theme: {activeTheme.name} at any time
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <Button
          className="w-full h-12 text-lg font-medium"
          style={{
            backgroundColor: activeTheme.accentColor,
            color: activeTheme.accentColor,
          }}
        >
          Primary Button
        </Button>
        <Button
          variant="outline"
          className="w-full h-12 text-lg font-medium"
          style={{
            backgroundColor: activeTheme.accentColor,
            color: activeTheme.accentColor,
          }}
        >
          Secondary Button
        </Button>
      </div>
    </div>
  )

  const rightCardContent = (
    <div className="space-y-4">
      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: activeTheme.accentColor + '10' }}
      >
        <h3
          className="text-xl font-semibold mb-4"
          style={{ color: activeTheme.accentColor }}
        >
          Theme Features
        </h3>
        <ul
          className="list-disc list-inside space-y-2"
          style={{ color: activeTheme.accentColor }}
        >
          <li>Customizable layouts</li>
          <li>Drag-and-drop interface</li>
          <li>Image support</li>
          <li>Slide transitions</li>
        </ul>
      </div>
      <Button
        className="w-full h-12 text-lg font-medium"
        style={{
          borderColor: activeTheme.accentColor,
          color: activeTheme.accentColor,
        }}
      >
        Explore Features
      </Button>
    </div>
  )

  return (
    <div
      className="h-screen w-full flex"
      style={{
        backgroundColor: activeTheme.backgroundColor,
        color: activeTheme.accentColor,
        fontFamily: activeTheme.fontFamily,
      }}
    >
      <div className="flex-grow overflow-y-auto">
        <div className="p-12 flex flex-col items-center min-h-screen">
          <Button
            variant="outline"
            className="mb-12 self-start"
            size="lg"
            style={{
              backgroundColor: activeTheme.accentColor + '10',
              color: activeTheme.accentColor,
              borderColor: activeTheme.accentColor + '20',
            }}
            onClick={() => router.push('/create-page')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="w-full flex justify-center items-center relative flex-grow">
            <ThemeCard
              title="Quick Start"
              description="Get started with your presentation quickly"
              content={leftCardContent}
              variant="left"
              theme={activeTheme}
              controls={controls}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThemePreview
