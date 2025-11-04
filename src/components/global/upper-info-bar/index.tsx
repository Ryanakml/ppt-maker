import { User } from '@prisma/client'
import React from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import SearchBar from '@/components/global/upper-info-bar/upper-info-searchbar'
import ThemeSwitcher from '@/components/global/mode-toggle'

type Props = {
  user: User
  children: React.ReactNode
}

const UpperInfoBar = ({ user, children }: Props) => {
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
      </header>
      <div className="p-4 pt-0">{children}</div>
    </div>
  )
}
export default UpperInfoBar
