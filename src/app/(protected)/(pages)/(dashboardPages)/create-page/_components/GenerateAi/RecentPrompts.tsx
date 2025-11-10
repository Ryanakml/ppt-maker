import { motion } from 'framer-motion'
import usePromptStore from '@/store/usePromptStore'
import useCreativeAIStore from '@/store/useCreativeAIStore'
import React from 'react'
import { containerVariants, itemVariants } from '@/lib/constants'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Props = {}

const RecentPrompts = (props: Props) => {
  const { prompts, setPage } = usePromptStore()
  const { addMultipleOutlines, setCurrentAiPrompt } = useCreativeAIStore()
  const handleEdit = (id?: string) => {
    const prompt = prompts.find((prompt) => prompt?.id === id)
    if (prompt) {
      setPage('creative-ai')
      addMultipleOutlines(prompt?.outlines || [])
      setCurrentAiPrompt(prompt?.title || '')
    }
  }
  return (
    <motion.div variants={containerVariants} className="space-y-4 mt-20">
      <motion.h2
        variants={itemVariants}
        className="text-4xl font-semibold text-center"
      >
        Recent Prompts
      </motion.h2>
      <motion.div
        variants={containerVariants}
        className="space-y-2 w-full lg:max-w-[80%] mx-auto"
      >
        {/* {prompts.map((prompt, index) => ( */}
        <motion.div
          variants={containerVariants}
          className="space-y-2 w-full lg:max-w-[80%] mx-auto"
        >
          <motion.div variants={itemVariants}>
            <Card className="p-4 flex items-center justify-between hover:bg-accent/50 transition-colors duration-300 border">
              <div className="max-w-[70%]">
                <h3 className="font-semibold text-xl line-clamp-1">
                  test prompt title
                </h3>
                <p className="font-semibold text-sm text-muted-foreground">
                  2 days ago
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-vivid">Creative Ai</span>
                <Button
                  variant="default"
                  size="sm"
                  className="rounded-xl bg-primary-20 dark:hover:bg-gray-700 hover:bg-gray-200 text-primary"
                  onClick={() => handleEdit(prompt?.id)}
                >
                  Edit
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
        {/* }) */}
      </motion.div>
    </motion.div>
  )
}

export default RecentPrompts
