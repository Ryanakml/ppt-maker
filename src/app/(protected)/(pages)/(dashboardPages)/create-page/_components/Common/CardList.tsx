'use client'

import { OutlineCard } from '@/lib/types'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from './Card'
import AddCardButton from './AddCardButton'

type Props = {
  outlines: OutlineCard[] | []
  editingCard: string | null
  selectedCard: string | null
  editText: string
  addOutline?: (card: OutlineCard) => void
  onEditChange: (value: string) => void
  onCardSelect: (id: string) => void
  onCardDoubleClick: (id: string, title: string) => void
  setEditText: (value: string) => void
  setEditingCard: (id: string | null) => void
  setSelectedCard: (id: string | null) => void
  addMultipleOutlines: (cards: OutlineCard[]) => void
}

const CardList = ({
  outlines,
  editingCard,
  selectedCard,
  editText,
  addOutline,
  onEditChange,
  onCardSelect,
  onCardDoubleClick,
  setEditText,
  setEditingCard,
  setSelectedCard,
  addMultipleOutlines,
}: Props) => {
  const [draggedItem, setDraggedItem] = React.useState<OutlineCard | null>(null)
  const [dragOverItemIndex, setDragOverItemIndex] = React.useState<
    number | null
  >(null)

  const dragOffsetY = React.useRef<number>(0)

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (!draggedItem) return

    const rect = e.currentTarget.getBoundingClientRect()

    const y = e.clientY - rect.top
    const threshold = rect.height / 2

    if (y < threshold) {
      setDragOverItemIndex(index)
    } else {
      setDragOverItemIndex(index + 1)
    }
  }

  const onAddCard = (index?: number) => {
    const newCard: OutlineCard = {
      id: Math.random().toString(36).substr(2, 9),
      title: editText || 'New Section',
      order: (index !== undefined ? index + 1 : outlines.length) + 1,
    }

    const updatedCards =
      index !== undefined
        ? [
            ...outlines.slice(0, index + 1),
            newCard,
            ...outlines
              .slice(index + 1)
              .map((card) => ({ ...card, order: card.order + 1 })),
          ]
        : [...outlines, newCard]

    addMultipleOutlines(updatedCards)
    setEditText('')
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedItem || dragOverItemIndex === null) return

    const updatedCard = [...outlines]

    const draggedIndex = updatedCard.findIndex(
      (card) => card.id === draggedItem.id
    )

    if (draggedIndex === -1 || draggedIndex === dragOverItemIndex) return

    const [removeCard] = updatedCard.splice(draggedIndex, 1)

    updatedCard.splice(
      dragOverItemIndex > draggedIndex
        ? (dragOverItemIndex ?? 0) - 1
        : (dragOverItemIndex ?? 0),
      0,
      removeCard
    )

    addMultipleOutlines(
      updatedCard.map((card, index) => ({
        ...card,
        order: index + 1,
      }))
    )

    setDraggedItem(null)
    setDragOverItemIndex(null)
  }

  const onCardUpdate = (id: string, newTitle: string) => {
    addMultipleOutlines(
      outlines.map((card) =>
        card.id === id ? { ...card, title: newTitle } : card
      )
    )

    setEditingCard(null)
    setEditingCard(null)
    setEditText('')
  }

  const onCardDelete = (id: string) => {
    addMultipleOutlines(
      outlines
        .filter((card) => card.id !== id)
        .map((card, index) => ({ ...card, order: index + 1 }))
    )
  }

  const onDragStart = (e: React.DragEvent, card: OutlineCard) => {
    setDraggedItem(card)
    e.dataTransfer.effectAllowed = 'move'

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()

    dragOffsetY.current = e.clientY - rect.top

    const draggedEl = e.currentTarget.cloneNode(true) as HTMLElement

    draggedEl.style.position = 'absolute'
    draggedEl.style.top = '-9999px'
    draggedEl.style.opacity = '0.8'
    draggedEl.style.width = `${(e.currentTarget as HTMLElement).offsetWidth}px`
    document.body.appendChild(draggedEl)
    e.dataTransfer.setDragImage(draggedEl, 0, dragOffsetY.current)

    setTimeout(() => {
      setDragOverItemIndex(outlines.findIndex((c) => c.id === card.id))
      document.body.removeChild(draggedEl)
    }, 0)
  }

  const onDragEnd = () => {
    setDraggedItem(null)
    setDragOverItemIndex(null)
  }

  const getDragOverStyles = (cardIndex: number) => {
    if (dragOverItemIndex === null || draggedItem === null) return {}
    if (cardIndex === dragOverItemIndex) {
      return {
        borderTop: '2px solid #000',
        marginTop: '8px',
        transition: 'margin 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
      }
    } else if (cardIndex === dragOverItemIndex - 1) {
      return {
        borderBottom: '2px solid #000',
        marginBottom: '8px',
        transition: 'margin 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
      }
    }

    return {}
  }

  const renderDropIndicator = (position: number) => {
    if (
      draggedItem === null ||
      dragOverItemIndex === null ||
      dragOverItemIndex !== position
    ) {
      return null
    }

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scaleX: 0.8 }}
        animate={{ opacity: 1, scaleX: 1 }}
        exit={{ opacity: 0, scaleX: 0.8 }}
        transition={{ duration: 0.15 }}
        className="px-1"
      >
        <div className="h-[3px] rounded-full bg-primary" />
      </motion.div>
    )
  }

  return (
    <motion.div
      className="space-y-2 my-2"
      layout
      onDragOver={(e) => {
        e.preventDefault()
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        if (outlines.length === 0 || e.clientY > rect.bottom - 20) {
          onDragOver(e, outlines.length)
        }
      }}
      onDrop={(e) => {
        e.preventDefault()
        onDrop(e)
      }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {outlines.map((card, index) => (
          <motion.div key={card.id} layout className="space-y-1">
            {renderDropIndicator(index)}
            <Card
              onDragOver={(e) => onDragOver(e, index)}
              card={card}
              isEditing={editingCard === card.id}
              isSelected={selectedCard === card.id}
              editText={editText}
              onEditChange={onEditChange}
              onEditBlur={() => onCardUpdate(card.id, editText)}
              onEditKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onCardUpdate(card.id, editText)
                }
              }}
              onCardClick={() => onCardSelect(card.id)}
              onCardDoubleClick={() => onCardDoubleClick(card.id, card.title)}
              onDeleteClick={() => onCardDelete(card.id)}
              dragHandlers={{
                onDragStart: (e) => onDragStart(e, card),
                onDragEnd: () => onDragEnd(),
              }}
              dragOverStyles={getDragOverStyles(index)}
            />
            <AddCardButton onAddCard={() => onAddCard(index)} />
          </motion.div>
        ))}
        {renderDropIndicator(outlines.length)}
      </AnimatePresence>
    </motion.div>
  )
}

export default CardList
