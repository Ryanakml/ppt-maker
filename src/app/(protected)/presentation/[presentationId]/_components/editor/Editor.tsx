'use client'

import React from 'react'
import { useSlideStore } from '@/store/useSlideStore'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LayoutSlides } from '@/lib/types'
import { useDrop } from 'react-dnd'
import { cn } from '@/lib/utils'
import { v4 as uuidv4 } from 'uuid'
import { useEffect, useRef } from 'react'
import { Slide } from '@/lib/types'
import { useDrag } from 'react-dnd'
import ContentRendered from './MasterRecursiveComponent'
import { Popover, PopoverContent } from '@/components/ui/popover'
import { PopoverTrigger } from '@radix-ui/react-popover'
import { EllipsisVertical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DropZoneProps {
  index: number
  onDrop: (
    item: {
      type: string
      layoutType: string
      component: LayoutSlides
      index: number
    },
    dropIndex: number
  ) => void
  isEditable: boolean
}

export const DropZone: React.FC<DropZoneProps> = ({
  onDrop,
  index,
  isEditable,
}) => {
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ['SLIDED', 'LAYOUT'],
    canDrop: () => isEditable,
    drop: (item: {
      type: string
      layoutType: string
      component: LayoutSlides
      index: number
    }) => onDrop(item, index),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  })

  if (!isEditable) return null

  return (
    <div
      className={cn(
        'h-4 rounded-md transition-all duration-200 border',
        isOver && canDrop ? 'border-green-500 bg-green-100' : 'border-gray-300',
        canDrop ? 'border-blue-300' : ''
      )}
    >
      {isOver && canDrop && (
        <span className="h-full flex items-center justify-center text-green-500">
          Drop Here
        </span>
      )}
    </div>
  )
}

interface DraggableSlideProps {
  slide: Slide
  index: number
  isEditable: boolean
  moveSlide: (dragIndex: number, hoverIndex: number) => void
  handleDelete: (id: string) => void
}

export const DraggableSlide: React.FC<DraggableSlideProps> = ({
  slide,
  index,
  isEditable,
  moveSlide,
  handleDelete,
}) => {
  const ref = useRef(null)
  const [{ isDragging }, drag] = useDrag({
    type: 'SLIDE',
    item: { index, type: 'SLIDE' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isEditable,
  })

  const { currentSlide, setCurrentSlide, currentTheme, updateContentItem } =
    useSlideStore()

  const handleOnContentChange = (
    contentId: string,
    newContent: string | string[] | string[][]
  ) => {
    console.log('Updating content for slide:', slide, contentId, newContent)
    if (isEditable) {
      updateContentItem(slide.id, contentId, newContent)
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        'w-full rounded-lg shadow-lg relative p-0 min-h-[400px] max-h-[800px]',
        'shadow-xl transition-shadow duration-300',
        'flex flex-col',
        index === currentSlide ? 'ring-2 ring-blue-500 ring-offset-2' : '',
        slide.className,
        isDragging ? 'opacity-50' : 'opacity-100'
      )}
      style={{
        backgroundImage: currentTheme?.gradientBackground,
      }}
      onClick={() => setCurrentSlide(index)}
    >
      <div className="h-full w-full flex-grow overflow-hidden">
        <ContentRendered
          isEditable={isEditable}
          content={slide.content}
          slideId={slide.id}
          isPreview={false}
          onContentChange={handleOnContentChange}
        />
      </div>
      {isEditable && (
        <Popover>
          <PopoverTrigger asChild className="absolute top-2 left-2">
            <Button size={'sm'} variant={'outline'}>
              <EllipsisVertical className="w-5 h-5" />
              <span className="sr-only">Slide Options</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-0">
            <div className="flex space-y-2">
              <Button variant={'ghost'} onClick={() => handleDelete(slide.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
                <span className="sr-only">Delete Slide</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

type Props = {
  isEditable: boolean
}

const Editor = ({ isEditable }: Props) => {
  const {
    getOrderedSlides,
    currentSlide,
    removeSlide,
    addSlideAtIndex,
    reorderSlides,
    slides,
    project,
  } = useSlideStore()

  const orderedSlides = getOrderedSlides()

  const slideRefs = React.useRef<Array<HTMLDivElement | null>>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const moveSlide = (dragIndex: number, hoverIndex: number) => {
    if (isEditable) {
      reorderSlides(dragIndex, hoverIndex)
    }
  }

  const handleDrop = (
    item: {
      type: string
      layoutType: string
      component: LayoutSlides
      index: number
    },
    dropIndex: number
  ) => {
    if (isEditable) return
    if (item.type === 'LAYOUT') {
      addSlideAtIndex(
        {
          ...item.component,
          id: uuidv4(),
          slideOrder: dropIndex,
        },
        dropIndex
      )
    } else if (item.type === 'SLIDED' && item.index !== undefined) {
      moveSlide(item.index, dropIndex)
    }
  }

  const handleDelete = (id: string) => {
    if (isEditable) {
      console.log('Deleting slide with id:', id)
      removeSlide(id)
    }
  }

  useEffect(() => {
    if (slideRefs.current[currentSlide]) {
      slideRefs.current[currentSlide].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [currentSlide])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoading(false)
    }
  }, [])

  return (
    <div className="flex-1 flex flex-col h-full max-w-3xl mx-auto px-4 mb-20">
      {isLoading ? (
        <div className="w-full px-4 flex flex-col space-y-6">
          <Skeleton className="h-52 w-full" />
          <Skeleton className="h-52 w-full" />
          <Skeleton className="h-52 w-full" />
        </div>
      ) : (
        <ScrollArea className="flex-1 mt-8">
          <div className="px-4 pb-4 space-y-4 pt-2">
            {isEditable ? (
              <DropZone index={0} onDrop={handleDrop} isEditable={isEditable} />
            ) : (
              ''
            )}

            {orderedSlides.map((slide, index) => (
              <React.Fragment key={slide.id || index}>
                <DraggableSlide
                  slide={slide}
                  index={index}
                  isEditable={isEditable}
                  moveSlide={moveSlide}
                  handleDelete={handleDelete}
                />
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

export default Editor
