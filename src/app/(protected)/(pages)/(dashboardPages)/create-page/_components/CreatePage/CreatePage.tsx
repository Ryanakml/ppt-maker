'use client'
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  itemVariants,
  containerVariants,
  CreatePageCard,
} from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import RecentPrompts from '../GenerateAi/RecentPrompts'
import usePromptStore from '@/store/usePromptStore'

type Props = {
  onSelectOption: (option: string) => void
}

const CreatePage = ({ onSelectOption }: Props) => {
  const { prompts, setPage } = usePromptStore()
  // useEffect(() => {
  //   setPage('create')
  // }, [setPage])
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      <motion.div variants={itemVariants} className="space-y-3 text-center">
        <h1 className="text-l font-bold tracking-tight text-white sm:text-5xl">
          How would you like to get started?
        </h1>
        <p className="text-base text-white/60">
          Choose your preferred method to begin
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-3">
        {CreatePageCard.map((option) => (
          <motion.div
            key={option.type}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onSelectOption(option.type)
              }
            }}
            onClick={() => onSelectOption(option.type)}
            variants={itemVariants}
            className="group relative h-full w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f55c7a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
          >
            <div
              className={cn(
                'rounded-[32px] border border-white/10 bg-[#0c0c10] p-0 shadow-[0_25px_80px_rgba(3,3,3,0.65)] transition-transform duration-300 hover:-translate-y-1',
                option.highlight &&
                  'border-transparent bg-gradient-to-r from-[#f55c7a] via-[#f97978] to-[#f8a07d] p-[1px]'
              )}
            >
              <div
                className={cn(
                  'flex h-full flex-col justify-between rounded-[30px] bg-[#0a0a0e] px-6 py-8 text-white sm:px-8',
                  option.highlight && 'bg-[#070709]'
                )}
              >
                <div className="space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                    {option.title}
                  </span>
                  <p
                    className={cn(
                      'text-4xl font-semibold leading-tight text-white sm:text-5xl',
                      option.highlight &&
                        'bg-gradient-to-r from-[#fde08b] via-[#f79a7a] to-[#ff6f90] bg-clip-text text-transparent'
                    )}
                  >
                    {option.highlightedText}
                  </p>
                  <p className="text-sm text-white/70">{option.description}</p>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button
                    className={cn(
                      'rounded-full px-6 text-sm font-semibold shadow-lg transition-colors',
                      option.highlight
                        ? 'bg-white text-gray-900 hover:bg-white/90'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    )}
                    onClick={(event) => {
                      event.stopPropagation()
                      onSelectOption(option.type)
                    }}
                  >
                    {option.cta}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {prompts.length > 0 && (
        <div className="mt-20 mb-20">
          <RecentPrompts />
        </div>
      )}
    </motion.div>
  )
}

export default CreatePage
