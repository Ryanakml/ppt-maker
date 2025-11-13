'use client'

import { cn } from '@/lib/utils'
import React, { useRef, useEffect } from 'react'

interface HeadingProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  style?: React.CSSProperties
  isPreview?: boolean
}

const createHeading = (displayName: string, defaultClassName: string) => {
  const Heading = React.forwardRef<HTMLTextAreaElement, HeadingProps>(
    ({ children, style, isPreview = false, className, ...props }, ref) => {
      const textAreaRef = useRef<HTMLTextAreaElement>(null)

      useEffect(() => {
        const textArea = textAreaRef.current

        if (textArea && isPreview) {
          const adjustHeight = () => {
            textArea.style.height = '0'
            textArea.style.height = textArea.scrollHeight + 'px'
          }

          textArea.addEventListener('input', adjustHeight)
          adjustHeight()

          return () => {
            textArea.removeEventListener('input', adjustHeight)
          }
        }
      }, [isPreview])

      const previewClassName = isPreview ? 'text-xs' : ''

      return (
        <textarea
          className={cn(
            `
      w-full bg-transparent ${defaultClassName} ${previewClassName} font-normal text-gray-900 placeholder:text-gray-300 focus:outline-none resize-none overflow-hidden leading-tight
    `,
            className
          )}
        >
                
        </textarea>
      )
    }
  )
}
const Heading1 = createHeading('Heading1', 'text-4xl')

export { Heading1 }
