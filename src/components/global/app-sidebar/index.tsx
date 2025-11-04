'use client'

import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { Project, User } from '@prisma/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { NavMain } from './nav-main'
import { data } from '@/lib/constants'
import RecentOpened from './recent-open'
import NavFooter from './nav-footer'

type AppSidebarProps = {
  recentProjects: Project[]
  user: User
} & React.ComponentProps<typeof Sidebar>

const AppSidebar = ({ recentProjects, user, ...props }: AppSidebarProps) => {
  return (
    <Sidebar
      collapsible="icon"
      className="max-w-[212px] bg-background-90"
      {...props}
    >
      <SidebarHeader className="pt-6 px-2 pb-0">
        <SidebarMenuButton
          size={'lg'}
          className="data-[state-open]:text-sidebar-accent-foreground"
        >
          <div
            className="flex aspect-square size-8 items-center 
            justify-center rounded-lg text-sidebar-primary-foreground"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src="/globe.svg" alt="globe-logo" />
              <AvatarFallback>NX</AvatarFallback>
            </Avatar>
          </div>
          <span className="truncate text-primary text-3xl font-semibold">
            NEXT
          </span>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent className="px-2 mt-10 gap-y-6">
        <NavMain items={data.navMain} />
        <RecentOpened recentProjects={recentProjects} />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter prismaUser={user} />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
