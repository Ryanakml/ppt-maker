'use client'

import { Button } from '@/components/ui/button'
import { containerVariants, itemVariants } from '@/lib/constants'
import { motion } from 'framer-motion'
import { ChevronLeft, Loader2, RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import useCreativeAIStore from '@/store/useCreativeAIStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import CardList from '../Common/CardList'

type Props = {
  onBack: () => void
}

const CreateAI = ({ onBack }: Props) => {
  const router = useRouter()
  const handleBack = () => {
    onBack()
  }

  const [editingCard, setEditingCard] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  const {
    currentAiPrompt,
    setCurrentAiPrompt,
    outlines,
    resetOutlines,
    addOutline,
    addMultipleOutlines,
  } = useCreativeAIStore()

  const [numOfSlides, setNumOfSlides] = useState(0)

  const resetCard = () => {
    setEditingCard(null)
    setSelectedCard(null)
    setEditText('')

    setCurrentAiPrompt('')
    resetOutlines()
  }

  //   'WIP' const generateOutline = () => {}

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
        <p className="text-secondary">What would you like to create today?</p>
      </motion.div>
      <motion.div
        variants={itemVariants}
        className="bg-primary/10 p-4 rounded-xl"
      >
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-center ">
          <Input
            value={currentAiPrompt || ''}
            onChange={(e) => setCurrentAiPrompt(e.target.value)}
            placeholder="Enter prompts and add to the cards..."
            className="text-base sm:text-xl border-0 focus-visible:ring-0 shadow-none bg-transparent p-0 flex-grow"
            required
          />
          <div className="flex items-center gap-3">
            <Select
              value={numOfSlides.toString()}
              onValueChange={(value) => setNumOfSlides(parseInt(value))}
            >
              <SelectTrigger className="w-fit gap-2 font-semibold shadow-xl">
                <SelectValue placeholder="Number of Slides" />
              </SelectTrigger>
              <SelectContent className="w-fit">
                {outlines.length === 0 ? (
                  <SelectItem value="0" className="font-semibold">
                    No Slides
                  </SelectItem>
                ) : (
                  Array.from({ length: outlines.length }, (_, i) => i + 1).map(
                    (num) => (
                      <SelectItem
                        key={num}
                        value={num.toString()}
                        className="font-semibold"
                      >
                        {num} {num === 1 ? 'Slide' : 'Slides'}
                      </SelectItem>
                    )
                  )
                )}
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
          //   onClick={generateOutline}
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
    </motion.div>
  )
}

export default CreateAI
