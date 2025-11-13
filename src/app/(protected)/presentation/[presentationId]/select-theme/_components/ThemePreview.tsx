'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSlideStore } from '@/store/useSlideStore'
import { useEffect } from 'react'
import { useAnimation } from 'framer-motion'
import { Theme } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import ThemeCard from './ThemeCard'
import ThemePicker from './ThemePicker'
import { themes } from '@/lib/constants'

const ThemePreview = () => {
  const params = useParams<{ presentationId: string }>()
  const router = useRouter()
  const controls = useAnimation()
  const { project, currentTheme, setCurrentTheme } = useSlideStore()
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
    <div className="space-y-6">
      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: activeTheme.slideBackgroundColor }}
      >
        <p style={{ color: activeTheme.fontcolor }}>
          This is a preview of the theme: {activeTheme.name}
        </p>
        <p style={{ color: activeTheme.fontcolor }}>
          You can change the theme: {activeTheme.name} at any time
        </p>
      </div>
      <div className="flex flex-wrap gap-4">
        <Button
          className="w-full h-12 text-lg font-medium"
          style={{
            backgroundColor: activeTheme.accentColor,
            color: '#ffffff',
          }}
        >
          Primary Button
        </Button>
        <Button
          variant="outline"
          className="w-full h-12 text-lg font-medium"
          style={{
            backgroundColor: activeTheme.accentColor,
            color: activeTheme.fontcolor,
          }}
        >
          Secondary Button
        </Button>
      </div>
    </div>
  )

  const mainCardContent = (
    <div className="space-y-4">
      <div
        className="rounded-xl p-8"
        style={{
          backgroundColor: activeTheme.slideBackgroundColor,
          backgroundImage: activeTheme.gradientBackground,
        }}
      >
        <h3
          className="text-xl font-semibold mb-4"
          style={{
            color: activeTheme.fontcolor,
          }}
        >
          Quick Start Guide
        </h3>
        <ol
          className="list-decimal list-inside space-y-2 text-sm"
          style={{ color: activeTheme.fontcolor }}
        >
          <li>Choose a template</li>
          <li>Customize your slides</li>
          <li>Add your content</li>
          <li>Preview and publish</li>
        </ol>
        <Button
          className="w-full h-12 text-lg font-medium mt-4"
          style={{
            backgroundColor: activeTheme.accentColor,
            color: '#ffffff',
          }}
        >
          Get Started
        </Button>
      </div>
    </div>
  )

  const rightCardContent = (
    <div className="space-y-4">
      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: activeTheme.slideBackgroundColor }}
      >
        <h3
          className="text-xl font-semibold mb-4"
          style={{ color: activeTheme.fontcolor }}
        >
          Theme Features
        </h3>
        <ul
          className="list-disc list-inside space-y-2"
          style={{ color: activeTheme.fontcolor }}
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
          color: activeTheme.fontcolor,
        }}
      >
        Explore Features
      </Button>
    </div>
  )

  const applyThemes = (theme: Theme) => {
    setSelectedTheme(theme)
    setCurrentTheme(theme)
  }

  return (
    <div
      className="h-screen w-full flex"
      style={{
        backgroundColor: activeTheme.backgroundColor,
        color: activeTheme.fontcolor,
        fontFamily: activeTheme.fontFamily,
      }}
    >
      {/* LEFT SIDE — PREVIEW SECTION */}
      <div className="flex-grow overflow-y-auto">
        <div className="p-12 flex flex-col items-center min-h-screen">
          {/* Back button */}
          <Button
            variant="outline"
            className="mb-12 self-start"
            size="lg"
            style={{
              backgroundColor: activeTheme.accentColor + '10',
              color: activeTheme.fontcolor,
              borderColor: activeTheme.accentColor + '20',
            }}
            onClick={() => router.push('/create-page')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {/* 3D Cards Preview */}
          <div
            className="relative w-full flex items-center justify-center"
            style={{
              height: 'calc(100vh - 200px)',
              perspective: '2000px',
              perspectiveOrigin: 'center center',
            }}
          >
            <div
              className="relative"
              style={{ width: '800px', height: '700px' }}
            >
              <ThemeCard
                title="Quick Start"
                description="Get started with your presentation quickly"
                content={leftCardContent}
                variant="left"
                theme={activeTheme}
                controls={controls}
              />
              <ThemeCard
                title="Main Preview"
                description="See your theme in action"
                content={mainCardContent}
                variant="main"
                theme={activeTheme}
                controls={controls}
              />
              <ThemeCard
                title="Features"
                description="Explore what this theme offers"
                content={rightCardContent}
                variant="right"
                theme={activeTheme}
                controls={controls}
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE — THEME PICKER SIDEBAR */}
      <ThemePicker
        selectedTheme={selectedTheme}
        themes={themes}
        onThemeSelect={applyThemes}
      />
    </div>
  )
}

export default ThemePreview
