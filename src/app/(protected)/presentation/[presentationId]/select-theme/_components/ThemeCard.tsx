'use client'

import React from 'react'
import { Theme } from '@/lib/types'
import { useAnimationControls, motion, Variants } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

type Props = {
  title: string
  description: string
  content: React.ReactNode
  variant: 'left' | 'main' | 'right'
  theme: Theme
  controls: ReturnType<typeof useAnimationControls>
}

const ThemeCard = ({
  title,
  description,
  content,
  variant,
  theme,
  controls,
}: Props) => {
  const variants: Record<Props['variant'], Variants> = {
    left: {
      hidden: { opacity: 0, scale: 0.8, rotateZ: -20 },
      visible: {
        opacity: 0.85,
        scale: 0.85,
        rotateZ: -12,
        x: -180,
        y: -50,
        transition: {
          type: 'spring',
          stiffness: 100,
          damping: 20,
          delay: 0.1,
        },
      },
    },
    main: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: {
        opacity: 1,
        scale: 1,
        rotateZ: 0,
        x: 0,
        y: 0,
        transition: {
          type: 'spring',
          stiffness: 100,
          damping: 20,
          delay: 0.2,
        },
      },
    },
    right: {
      hidden: { opacity: 0, scale: 0.8, rotateZ: 20 },
      visible: {
        opacity: 0.85,
        scale: 0.8,
        rotateZ: 12,
        x: 200,
        y: 80,
        transition: {
          type: 'spring',
          stiffness: 100,
          damping: 20,
          delay: 0.3,
        },
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      animate={controls}
      variants={variants[variant]}
      className="absolute"
      style={{
        transformOrigin: 'center center',
        transformStyle: 'preserve-3d',
        zIndex: variant === 'main' ? 30 : variant === 'left' ? 20 : 10,
        width: '600px',
        maxWidth: '90vw',
      }}
    >
      <Card
        className="shadow-2xl backdrop-blur-sm overflow-hidden"
        style={{
          backgroundColor: theme.slideBackgroundColor!,
          border: `1px solid ${theme.accentColor}20`,
        }}
      >
        <div className="flex flex-col md:flex-row">
          <CardContent className="flex-1 p-8 space-y-6">
            <div className="space-y-3">
              <h2
                className="text-3xl font-bold tracking-tight"
                style={{ color: theme.accentColor }}
              >
                {title}
              </h2>
              <p
                className="text-lg"
                style={{ color: `${theme.accentColor}90` }}
              >
                {description}
              </p>
            </div>
            {content}
          </CardContent>
          <div className="relative w-full md:w-1/2 h-80 md:h-auto overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1605012551487-3e3fe4d02ae2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1287"
              alt="White printer paper with drawing"
              width={800}
              height={600}
              className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default ThemeCard
