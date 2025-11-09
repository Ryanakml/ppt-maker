'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import React from 'react'
import usePromptStore from '@/store/usePromptStore'
import CreatePage from './CreatePage/CreatePage'

type Props = {}

const RenderPage = (props: Props) => {
  const router = useRouter()
  const { page, setPage } = usePromptStore()

  const renderStep = () => {
    switch (page) {
      case 'create':
        return <CreatePage onSelectOption={() => {}} />
      case 'creative-scratch':
        return <div>Step 3 Content</div>
      case 'creative-ai':
        return <div>Step 2 Content</div>
      default:
        return <div>Default Step Content</div>
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={page}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
      >
        {renderStep()}
      </motion.div>
    </AnimatePresence>
  )
}

export default RenderPage
