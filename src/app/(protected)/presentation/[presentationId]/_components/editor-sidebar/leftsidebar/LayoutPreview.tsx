import React from 'react'
import { useSlideStore } from '@/store/useSlideStore'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect } from 'react'

type Props = {}
const LayoutPreview = (props: Props) => {
  const { getOrderedSlides, reorderSlides } = useSlideStore()
  const slides = getOrderedSlides()
  const [isLoading, setIsLoading] = React.useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') setIsLoading(false)
  }, [])

  return (
    <div className="w-64 h-full fixed top-20 border-r overflow-y-auto">
      <ScrollArea className="h-full w-full" suppressHydrationWarning>
        {isLoading ? (
          <div className="w-full p-4 flex flex-col space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="p-4 pb-32 space-y-6">
            <div className="flex justify-between mb-6">
              <h2 className="text-sm font-medium dark:text-gray-100 text-gray-500">
                SLIDES
              </h2>
              <span
                className="text-sm dark:text-gray-200 text-gray-400"
                suppressHydrationWarning
              >
                {slides.length} slides
              </span>
            </div>
            {/* {slides.map((slide, index) => {
              <DraggableSlidePreview 
              key={slide.id}
              slide={slide} 
              index={index}
              moveSlide={moveSlide} />
            })} */}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

export default LayoutPreview
