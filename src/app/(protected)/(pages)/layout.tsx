import { onAuthenticateUser } from '@/actions/user'
import {
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar'
import AppSidebar from '@/components/global/app-sidebar/index'
import UpperInfoBar from '@/components/global/upper-info-bar'
import { redirect } from 'next/navigation'
import React from 'react'
import { getRecentProjects } from '@/actions/project'

type Props = {
  children: React.ReactNode
}

const Layout = async ({ children }: Props) => {
  const checkUser = await onAuthenticateUser()
  if (!checkUser.user) {
    redirect('/sign-in')
  }

  const recentProjectsResponse = await getRecentProjects(checkUser.user.id)
  const recentProjects =
    recentProjectsResponse.status === 200 &&
    'data' in recentProjectsResponse &&
    recentProjectsResponse.data
      ? recentProjectsResponse.data
      : []

  return (
    <SidebarProvider>
      <AppSidebar recentProjects={recentProjects} user={checkUser.user} />
      <SidebarRail />
      <SidebarInset className="flex-1 flex flex-col">
        <UpperInfoBar user={checkUser.user} />
        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Layout
