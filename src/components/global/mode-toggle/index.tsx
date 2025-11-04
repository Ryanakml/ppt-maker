'use client'
import { Switch } from '@/components/ui/switch'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }
  return (
    <div>
      <Switch
        checked={resolvedTheme === 'light'}
        onCheckedChange={(checked) => setTheme(checked ? 'light' : 'dark')}
        className="h-10 w-20 pl-1 data-[state=checked]:bg-primary"
        aria-label="Toggle dark mode"
      />
    </div>
  )
}

export default ThemeSwitcher
