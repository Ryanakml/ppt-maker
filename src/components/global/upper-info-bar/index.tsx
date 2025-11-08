import { User } from '@prisma/client'
import React from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import SearchBar from '@/components/global/upper-info-bar/upper-info-searchbar'
import ThemeSwitcher from '@/components/global/mode-toggle'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import NewProjectButton from './new-project-button'

type Props = {
  user: User
}

const UpperInfoBar = ({ user }: Props) => {
  return (
    <div className="sticky top-0 z-[10] border-b bg-background">
      <header className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
        </div>
        <div className="flex-1 max-w-xl">
          <SearchBar />
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
        </div>
        <div className="flex flex-wrap gap-4 items-center justify-end">
          <Button className="bg-primary-80 rounded-lg hover:bg-backround-80 text-primary font-semibold cursor-not-allowed">
            <Upload />
            Upload
          </Button>
          <NewProjectButton user={user} />
        </div>
      </header>
    </div>
  )
}
export default UpperInfoBar
