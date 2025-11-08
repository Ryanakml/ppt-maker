import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog'
import React from 'react'

type Props = {
    children: React.ReactNode
    className?: string
    description: string
    loading?: boolean
    onClick?: () => void
    open: boolean
    handleOpen: () => void
}

const AlertDialogBox = ( {
    children,
    className,
    description,
    loading,
    onClick,
    open,
    handleOpen
}: Props) => {
  return (
    <AlertDialog 
    open={open}
    onOpenChange={handleOpen}
    >
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>

        </AlerDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AlertDialogBox