'use client'

import { ContentItem } from '@/lib/types'
import { motion } from 'framer-motion'
import React, { useCallback } from 'react'
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Title,
} from '@/components/global/editor/Headings'
import { cn } from '@/lib/utils'
import Dropzone from './Dropzone'

type MasterRecursiveComponentProps = {
  content: ContentItem
  onContentChange: (
    contentId: string,
    newContent: string | string[] | string[][]
  ) => void
  isPreview?: boolean
  isEditable?: boolean
  slideId: string
}

const ContentRenderer: React.FC<MasterRecursiveComponentProps> = React.memo(
  ({ content, onContentChange, isPreview, isEditable, slideId }) => {
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
      isPreview,
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
            <Heading2 {...commonProps} />
          </motion.div>
        )

      case 'heading2':
        return (
          <motion.div className="w-full h-full" {...animationProps}>
            <Heading3 {...commonProps} />
          </motion.div>
        )

      case 'heading3':
        return (
          <motion.div className="w-full h-full" {...animationProps}>
            <Heading4 {...commonProps} />
          </motion.div>
        )

      case 'heading4':
        return (
          <motion.div className="w-full h-full" {...animationProps}>
            <Heading4 {...commonProps} />
          </motion.div>
        )

      case 'title':
        return (
          <motion.div className="w-full h-full" {...animationProps}>
            <Title {...commonProps} />
          </motion.div>
        )

      case 'column':
        if (Array.isArray(content.content)) {
          const items = content.content as ContentItem[]

          return (
            <motion.div
              className={cn(
                'w-full h-full flex flex-col gap-4',
                content.className
              )}
              {...animationProps}
            >
              {items.length > 0 ? (
                items.map((subItem, subIndex) => (
                  <React.Fragment key={subItem.id || `item-${subIndex}`}>
                    {isPreview &&
                      !subItem.restrictToDrop &&
                      subIndex === 0 &&
                      isEditable && (
                        <Dropzone
                          index={0}
                          parentId={content.id}
                          slideId={slideId}
                        />
                      )}
                    <MasterRecursiveComponent
                      content={subItem}
                      onContentChange={onContentChange}
                      isPreview={isPreview}
                      isEditable={isEditable}
                      slideId={slideId}
                    />
                    {isPreview && !subItem.restrictToDrop && isEditable && (
                      <Dropzone
                        index={subIndex + 1}
                        parentId={content.id}
                        slideId={slideId}
                      />
                    )}
                  </React.Fragment>
                ))
              ) : isEditable ? (
                <Dropzone index={0} parentId={content.id} slideId={slideId} />
              ) : null}
            </motion.div>
          )
        }

        return null

      default:
        return null
    }
  }
)

const MasterRecursiveComponent: React.FC<MasterRecursiveComponentProps> =
  React.memo((props) => {
    if (props.isPreview) {
      return <ContentRenderer {...props} />
    }

    return (
      <React.Fragment>
        <ContentRenderer {...props} />
      </React.Fragment>
    )
  })

export default MasterRecursiveComponent
