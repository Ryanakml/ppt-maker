'use client'

import { JsonValue } from '@prisma/client/runtime/library'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { itemVariants, themes } from '@/lib/constants'
import { useSlideStore } from '@/store/useSlideStore'
import { useRouter } from 'next/navigation'
import ThumbnailPreview from './thumbnail-preview'
import { timeAgo } from '@/lib/utils'
import AlertDialogBox from '../alert-dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type Props = {
  projectId: string
  title: string
  createdAt: string
  src: string
  isDelete: boolean
  slideData: JsonValue
  themeName?: string
}

const ProjectCard = ({
  projectId,
  title,
  createdAt,
  src,
  isDelete,
  slideData,
  themeName,
}: Props) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setSlides } = useSlideStore()
  const router = useRouter()

  const safeSlides =
    slideData && typeof slideData === 'object'
      ? JSON.parse(JSON.stringify(slideData))
      : []

  const handleNavigation = () => {
    setSlides(safeSlides)
    router.push(`/presentation/${projectId}`)
  }

  const theme = themes.find((theme) => theme.name === themeName) || themes[0]

  const handleRecover = () => {
    setLoading(true)

    if (!projectId) {
      toast.error('Project not found', {
        description: 'Please try again later.',
      })
      setLoading(false)
      setOpen(false)
      return
    }

    try {
      const res = await recoverProject(projectId)

    } catch (error) {}
  }

  return (
    <motion.div
      variants={itemVariants}
      className={`group w-full flex flex-col gap-y-3 rounded-xl p-3 transition-colors ${
        isDelete && 'hover:bg-muted-50'
      }`}
    >
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-lg cursor-pointer"
        onClick={handleNavigation}
      >
        <ThumbnailPreview
          theme={theme}
          slide={Array.isArray(safeSlides) ? safeSlides[0] : null}
        />
      </div>
      <div className="w-full">
        <div className="space-y-1">
          <h3 className="font-semibold text-base text-primary line-clamp-1">
            {title || 'Untitled Project'}
          </h3>
          <div className="flex w-full justify-between items-center gap-2">
            <p
              className="text-sm text-muted-foreground"
              suppressHydrationWarning
            >
              {timeAgo(createdAt)}
            </p>
            {/* {isDelete ? ( */}
            <AlertDialogBox
              description="This will recover your project and restore your data."
              className="bg-green-500 text-white dark:bg-green-600 hover:bg-green-600 hover:dark:bg-green-700"
              loading={loading}
              open={open}
              onConfirm={handleRecover}
              confirmLabel="Recover"
              handleOpen={(nextOpen) => setOpen(nextOpen)}
            >
              <Button
                size="sm"
                variant="ghost"
                className="bg-background-80 dark:hover:bg-background-90"
                disabled={loading}
              >
                Recover
              </Button>
            </AlertDialogBox>
            {/* ) : (
              ''
            )} */}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard
