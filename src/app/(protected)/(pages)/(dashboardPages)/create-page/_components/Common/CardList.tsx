import { OutlineCard } from '@/lib/types'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from './Card'

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
        order: String(index + 1),
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

    editingCard && setEditingCard(null)
    setEditText('')
  }

  const onCardDelete = (id: string) => {
    addMultipleOutlines(
      outlines
        .filter((card) => card.id !== id)
        .map((card, index) => ({ ...card, order: String(index + 1) }))
    )
  }

  const onDragStart = (e: React.DragEvent, card: OutlineCard) => {
    setDraggedItem(card)
    e.dataTransfer.effectAllowed = 'move'
    
  }

  return (
    <motion.div
      className="space-y-2 my-2"
      layout
      onDragOver={(e) => {
        e.preventDefault()
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        if (outlines.length === 0 || e.clientY < rect.bottom - 20) {
          onDragOver(e, outlines.length)
        }
      }}
      onDrop={(e) => {
        e.preventDefault()
        onDrop(e)
      }}
    >
      <AnimatePresence>
        {outlines.map((card, index) => (
          <React.Fragment key={card.id}>
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
              dragOverStyles={
                dragOverItemIndex === index
                  ? { borderTop: '2px solid #f55c7a' }
                  : dragOverItemIndex === index + 1
                    ? { borderBottom: '2px solid #f55c7a' }
                    : {}
              }
            />
          </React.Fragment>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

export default CardList
