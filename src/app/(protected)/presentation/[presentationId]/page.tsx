'use client'
import React, { useEffect } from 'react'
import { useSlideStore } from '@/store/useSlideStore'
import { useParams } from 'next/navigation'
import { useTheme } from 'next-themes'
import { getProjectById } from '@/actions/project'
import { toast } from 'sonner'
import { redirect } from 'next/navigation'
import { themes } from '@/lib/constants'
import { Loader2 } from 'lucide-react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

type Props = {}

const Page = (props: Props) => {
  const params = useParams()
  const { setTheme } = useTheme()
  const [isLoading, setIsLoading] = React.useState(true)
  const { setSlides, setProject, currentTheme, setCurrentTheme } =
    useSlideStore()

  useEffect(() => {
    ;(async () => {
      try {
        const res = await getProjectById(params.presentationId as string)

        if (res.status !== 200 || !res.data) {
          toast.error('Error', {
            description: 'Failed to load project',
          })
          redirect('/dashboard')
        }

        const findTheme = themes.find(
          (theme) => theme.name === res.data?.themeName
        )

        setCurrentTheme(findTheme || themes[0])
        setTheme(findTheme?.type == 'dark' ? 'dark' : 'light')
        setProject(res.data)
        setSlides(JSON.parse(JSON.stringify(res.data.slides)))
      } catch (error) {
        console.error(error)
        toast.error('Error', {
          description: 'Internal server error',
        })
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  if (isLoading == true) {
    return (
      <div className="flex items-center justify-between h-screen">
        <Loader2 className="animate-spin h-6 w-6 text-gray-600" />
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
    </DndProvider>
  )
}

export default Page
