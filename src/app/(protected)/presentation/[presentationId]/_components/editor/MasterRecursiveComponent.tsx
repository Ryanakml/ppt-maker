'use client'

import { ContentItem } from '@/lib/types'
import { animate, motion } from 'framer-motion'
import React, { useCallback } from 'react'
import { Heading1 } from '@/components/global/editor/Headings'

type MasterResoinsuceComponentProps = {
  content: ContentItem
  onContentChange: (
    contentId: string,
    newContent: string | string[] | string[][]
  ) => void
  isPreview?: boolean
  isEditable?: boolean
  slideId: string
  index: number
}


const ContentRendered: React.FC<MasterResoinsuceComponentProps> = React.memo(
  ({ content, onContentChange, isPreview, isEditable, slideId, index }) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onContentChange(content.id, e.target.value)
      },
      [content.id, onContentChange]
    )

    const commonProps = {
      placeholder: content.placeholder || '',
      value: content.content as string,
      onChange: handleChange,
      isPreview: isPreview,
    }

    const animationProps = {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
    }
    switch (content.type) {
      case 'heading1':
        return (
          <motion.div className="w-full h-full" {...animationProps}>
            <Heading1 {...commonProps} />
          </motion.div>
        )
      default:
    }
  }
)

export default ContentRendered
