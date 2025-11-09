import { motion } from 'framer-motion'
import usePromptStore from '@/store/usePromptStore'
import React from 'react'
import { containerVariants } from '@/lib/constants'

type Props = {}

const RecentPrompts = (props: Props) => {
  const { prompts, setPage } = usePromptStore()
  return (
    <motion.div 
    variant={containerVariants}
    clasName='space-y-4 mt-20'>
        <motion.h2>
            
        </motion.h2>
    </motion.div>
  )
}

export default RecentPrompts
