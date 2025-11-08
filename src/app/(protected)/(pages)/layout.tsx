import { onAuthenticateUser } from '@/actions/user'
import {
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar'
import AppSidebar from '@/components/global/app-sidebar/index'
import { redirect } from 'next/navigation'
import React from 'react'
import { getRecentProjects } from '@/actions/project'
import UpperInfoBar from '@/components/global/upper-info-bar'

type Props = {
  children: React.ReactNode
}

const Layout = async ({ children }: Props) => {
  const checkUser = await onAuthenticateUser()
  const recentProjects = await getRecentProjects()

  if (!checkUser.user) {
    redirect('/sign-in')
  }

  return (
    <SidebarProvider>
      <AppSidebar
        user={checkUser.user}
        recentProjects={recentProjects.data || []}
      />
      <SidebarInset>
        <UpperInfoBar user={checkUser.user} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Layout
