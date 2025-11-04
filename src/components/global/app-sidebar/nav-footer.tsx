'use client'

import { User } from '@prisma/client'
import { UserButton, useUser } from '@clerk/nextjs'
import { SignedIn } from '@clerk/nextjs'
import { useState } from 'react'
import React from 'react'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'

const NavFooter = ({ prismaUser }: { prismaUser: User }) => {
  const { isLoaded, isSignedIn, user } = useUser()
  const [loading, isLoading] = useState(false)

  if (!isLoaded || !isSignedIn || !user) return null
  console.log('prismaUser:', prismaUser)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div
          className="flex flex-col gap-y-6 items-start 
        group-data-[collapsible=icon]:hidden"
        >
          {!prismaUser.subscription && (
            <div className="flex flex-col items-start p-2 pb-3 gap-4 bg-background-80">
              <div className="flex flex-col items-start gap-1">
                <p className="text-base font-bold">
                  Get <span className="text-vivid">Creative AI</span>
                </p>
                <span className="text-sm dark:text-primary">Unlock Now!.</span>
              </div>
              <div className="w-full bg-vivid-gradient p-[1px] rounded-full">
                <Button
                  className="w-full border-vivid bg-background-80 
                  rounded-full text-primary font-bold"
                  variant={'default'}
                  size={'lg'}
                  //   onClick={handleUpgrading}
                >
                  {loading ? 'Processing...' : 'Upgrade Now'}
                </Button>
              </div>
            </div>
          )}

          <SignedIn>
            <SidebarMenuButton
              size={'lg'}
              className="data-[state-open]:bg-sidebar-accent
              data-[state-open]:text-sidebar-accent-foreground"
            >
              <UserButton />
            </SidebarMenuButton>
          </SignedIn>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default NavFooter
