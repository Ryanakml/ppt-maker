'use client'

import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      // Base layout
      'peer relative inline-flex h-[24px] w-[46px] shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-all',
      // Colors
      'bg-input data-[state=checked]:bg-primary/90',
      // Focus ring
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      // Disabled
      'disabled:cursor-not-allowed disabled:opacity-50',
      // Hover / active effects
      'hover:data-[state=unchecked]:bg-muted/70 hover:data-[state=checked]:bg-primary',
      'active:scale-[0.98]',
      className
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-[18px] w-[18px] rounded-full bg-background shadow-md transition-all duration-200',
        'data-[state=unchecked]:translate-x-[3px] data-[state=checked]:translate-x-[25px]',
        // Glow effect when active
        'data-[state=checked]:shadow-[0_0_8px_2px_var(--tw-ring-color)] data-[state=checked]:ring-1 data-[state=checked]:ring-primary/50'
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
