'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import usePromptStore from '@/store/usePromptStore'
import { motion, useUnmountEffect } from 'framer-motion'
import { containerVariants } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import useScratchStore from '@/store/useStartScratchStore'
import { itemVariants } from '@/lib/constants'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import CardList from '../Common/CardList'
import { OutlineCard } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'
import { createProject } from '@/actions/project'
import { useSlideStore } from '@/store/useSlideStore'

type Props = {
  onBack: () => void
}

const ScratchPage = ({ onBack }: Props) => {
  const router = useRouter()
  const { setProject } = useSlideStore()
  const [editingCard, setEditingCard] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [editText, setEditText] = React.useState('')
  const { outlines, resetOutlines, addOutline, addMultipleOutlines } =
    useScratchStore()

  const handleBack = () => {
    resetOutlines()
    onBack()
  }

  const resetCards = () => {
    setEditText('')
    resetOutlines()
  }

  const handleAddCards = () => {
    const newCard: OutlineCard = {
      id: uuidv4(),
      title: editText || 'New Section',
      order: outlines.length + 1,
    }
    setEditText('')
    addOutline(newCard)
  }

  const handleGenerate = async () => {
    if (outlines.length === 0) {
      toast('Error', {
        description: 'Please add at least one card to create the slides',
      })

      return
    }

    const res = await createProject(outlines?.[0]?.title, outlines)

    if (res.status !== 200) {
      toast('Error', {
        description: 'Failed to create project',
      })
      return
    }

    if (res.data) {
      setProject(res.data)
      resetOutlines()
      toast.success('Success', {
        description: 'Project created successfully',
      })
      router.push(`/presentation/${res.data.id}/select-theme`)
    } else {
        toast.error('Error', {
        description: 'Failed to create project',
        })
    }
  }

  return (
    <motion.div
      className="space-y-6 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Button className="mb-4" variant="outline" onClick={handleBack}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <h1 className="text-4xl font-bold text-center">Start from Scratch</h1>
      <motion.div
        className="bg-primary/10 p-4 rounded-xl"
        variants={itemVariants}
      >
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-center rounded-xl">
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Enter prompt and add to the cards..."
            className="text-base sm:text-xl border-0 focus-visible:ring-0 shadow-none p-0 bg-transparent flex-grow"
          />
          <div className="flex items-center gap-3">
            <Select
              value={outlines.length > 0 ? outlines.length.toString() : '0'}
              onValueChange={() => {}}
            >
              <SelectTrigger className="w-fit gap-2 font-semibold shadow-xl">
                <SelectValue placeholder="Select number of cards" />
              </SelectTrigger>
              <SelectContent>
                {outlines.length === 0 ? (
                  <SelectItem value="0" className="font-semibold">
                    No Cards
                  </SelectItem>
                ) : (
                  Array.from({ length: outlines.length }, (_, i) => i + 1).map(
                    (num) => (
                      <SelectItem
                        key={num}
                        value={num.toString()}
                        className="font-semibold"
                      >
                        {num} {num === 1 ? 'Card' : 'Cards'}
                      </SelectItem>
                    )
                  )
                )}
              </SelectContent>
            </Select>
            <Button
              variant="destructive"
              onClick={resetCards}
              size="icon"
              aria-label="Reset Cards"
              className="bg-transparent"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
      <CardList
        outlines={outlines}
        addOutline={addOutline}
        addMultipleOutlines={addMultipleOutlines}
        editingCard={editingCard}
        selectedCard={selectedCard}
        editText={editText}
        onEditChange={setEditText}
        onCardSelect={setSelectedCard}
        setEditText={setEditText}
        setEditingCard={setEditingCard}
        setSelectedCard={setSelectedCard}
        onCardDoubleClick={(id, title) => {
          setEditingCard(id)
          setEditText(title)
        }}
      />

      <Button
        onClick={handleAddCards}
        variant="secondary"
        className="w-full bg-primary-10"
      >
        Add Cards
      </Button>

      {outlines.length > 0 && (
        <Button className="w-full" onClick={handleGenerate}>
          Generate Slides
        </Button>
      )}
    </motion.div>
  )
}

export default ScratchPage
