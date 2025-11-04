'use client'

import React from 'react'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Share, Trash2, Settings } from 'lucide-react'

const icons = { home: Home, share: Share, trash2: Trash2, settings: Settings }

type NavItem = {
  title: string
  url: string
  icon: keyof typeof icons
  isActive?: boolean
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <SidebarGroup className="p-0">
      <SidebarMenu>
        {items.map((item) => {
          const Icon = icons[item.icon]
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={
                  pathname.includes(item.url) ? 'bg-background-80' : ''
                }
              >
                <Link
                  href={item.url}
                  className={`flex items-center text-lg ${
                    pathname.includes(item.url) ? 'font-semibold' : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="ml-2">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
