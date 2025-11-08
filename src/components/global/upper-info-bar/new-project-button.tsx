'use client'

import { Button } from '@/components/ui/button'
import { User } from '@prisma/client'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
  user: User
}

const NewProjectButton = ({ user }: Props) => {
  const router = useRouter()
  return (
    <div>
      <Button
        size={'lg'}
        className="rounded-lg font-semibold"
        disabled={!user.subscription}
        onClick={() => router.push('/new-project')}
      >
        <Plus />
        New Project
      </Button>
    </div>
  )
}

export default NewProjectButton
