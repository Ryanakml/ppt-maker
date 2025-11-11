'use client'

import { Button } from '@/components/ui/button'
import { containerVariants, itemVariants } from '@/lib/constants'
import { motion } from 'framer-motion'
import { ChevronLeft, Loader2, RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import useCreativeAIStore from '@/store/useCreativeAIStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import CardList from '../Common/CardList'
import usePromptStore from '@/store/usePromptStore'
import RecentPrompts from './RecentPrompts'
import { toast } from 'sonner'
import { generateCreativePrompt } from '@/actions/llama'
import { v4 as uuidv4 } from 'uuid'
import { OutlineCard } from '@/lib/types'
import { createProject } from '@/actions/project'
import { useSlideStore } from '@/store/useSlideStore'

type Props = {
  onBack: () => void
}

const CreateAI = ({ onBack }: Props) => {
  const router = useRouter()
  const { setProject } = useSlideStore()
  const [editingCard, setEditingCard] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const { prompts, addPrompt } = usePromptStore()

  const {
    currentAiPrompt,
    setCurrentAiPrompt,
    outlines,
    resetOutlines,
    addOutline,
    addMultipleOutlines,
  } = useCreativeAIStore()

  const [numOfSlides, setNumOfSlides] = useState<number | null>(null)

  const handleBack = () => {
    onBack()
  }

  const resetCard = () => {
    setEditingCard(null)
    setSelectedCard(null)
    setEditText('')

    setCurrentAiPrompt('')
    resetOutlines()
    setNumOfSlides(null)
  }

  const generateOutline = async () => {
    if (currentAiPrompt.trim() === '') {
      toast.error('Error', { description: 'Please enter a prompt' })
      return
    }
    if (!numOfSlides || numOfSlides < 1) {
      toast.error('Error', {
        description: 'Select how many cards you want (max 10).',
      })
      return
    }
    if (numOfSlides > 10) {
      toast.error('Error', {
        description: 'Creative AI can generate up to 10 cards at once.',
      })
      return
    }
    setIsGenerating(true)
    try {
      const outlinesFromLLM = await generateCreativePrompt(currentAiPrompt)

      const generatedOutlines: OutlineCard[] = outlinesFromLLM
        .slice(0, numOfSlides)
        .map((title, index) => ({
          id: uuidv4(),
          title: title.trim(),
          order: index + 1,
        }))

      addMultipleOutlines(generatedOutlines)
      setSelectedCard(null)
      setEditingCard(null)
      setEditText('')
      setNumOfSlides(generatedOutlines.length)

      addPrompt({
        id: uuidv4(),
        createdAt: new Date(),
        title: currentAiPrompt.trim(),
        outlines: generatedOutlines,
      })

      toast.success('Slides ready!', {
        description: `Generated ${generatedOutlines.length} cards from your prompt.`,
      })

      setCurrentAiPrompt('')
      resetOutlines()
    } catch (error) {
      console.error('Error generating outlines:', error)
      toast.error('Error', {
        description: 'Failed to generate outlines. Please try again.',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    if (outlines.length === 0) {
      toast.error('Error', {
        description: 'Please add at least one card to create the slides',
      })
      return
    }

    try {
      const res = await createProject(
        currentAiPrompt || 'Untitled',
        outlines.slice(0, numOfSlides || outlines.length)
      )

      if (res.status !== 200) {
        throw new Error('Failed to create project')
      }

      const projectData = res.data!
      router.prefetch(`/presentation/${projectData.id}/select-theme`)
      router.push(`/presentation/${projectData.id}/select-theme`)

      setTimeout(() => {
        setProject(projectData)
        addPrompt({
          id: uuidv4(),
          createdAt: new Date(),
          title: currentAiPrompt || outlines[0]?.title || 'Untitled',
          outlines: outlines,
        })
      }, 0)
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Error', { description: 'Failed to create project.' })
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    if (outlines.length > 0) {
      setNumOfSlides(outlines.length)
    }
  }, [outlines.length])

  return (
    <motion.div
      className="space-y-6 w-full max-2-4xl mx-auto px-4 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Button variant="outline" className="mb-4" onClick={handleBack}>
        <ChevronLeft />
        Back
      </Button>
      <motion.div variants={itemVariants} className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary">
          Generate with
          <span className="text-vivid"> Creative AI</span>
        </h1>
        <p className="text-primary/80">What would you like to create today?</p>
      </motion.div>
      <motion.div
        variants={itemVariants}
        className="bg-primary/10 p-4 rounded-xl"
      >
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-center">
          <Input
            value={currentAiPrompt || ''}
            onChange={(e) => setCurrentAiPrompt(e.target.value)}
            placeholder="Enter prompts and add to the cards..."
            className="text-base sm:text-xl border-0 focus-visible:ring-0 shadow-none bg-transparent p-0 flex-grow"
            required
          />
          <div className="flex items-center gap-3">
            <Select
              value={numOfSlides ? numOfSlides.toString() : undefined}
              onValueChange={(value) => setNumOfSlides(parseInt(value))}
              disabled={isGenerating}
            >
              <SelectTrigger className="w-fit gap-2 font-semibold shadow-xl">
                <SelectValue placeholder="Select number of cards (max 10)" />
              </SelectTrigger>
              <SelectContent className="w-fit">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <SelectItem
                    key={num}
                    value={num.toString()}
                    className="font-semibold"
                  >
                    {num} {num === 1 ? 'Card' : 'Cards'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="destructive"
              size="icon"
              onClick={resetCard}
              aria-label="Reset Slides"
              className="bg-transparent hover:bg-red-600/20 focus:ring-0 border-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
      <div className="w-full flex justify-center items-center">
        <Button
          className="font-medium text-lg flex-gap-2 items-center"
          onClick={generateOutline}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin mr-2" /> Generating...
            </>
          ) : (
            'Generate Outline'
          )}
        </Button>
      </div>
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

      {outlines.length > 0 && (
        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin mr-2" /> Generating...
            </>
          ) : (
            'Generate'
          )}
        </Button>
      )}

      {prompts?.length > 0 && <RecentPrompts />}
    </motion.div>
  )
}

export default CreateAI
