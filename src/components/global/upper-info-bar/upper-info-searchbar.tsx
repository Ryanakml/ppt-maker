'use client'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React, { useState } from 'react'

type Props = {}

const SearchBar = (props: Props) => {
  const [value, setValue] = useState('')

  return (
    <div className="relative flex items-center h-10 w-full max-w-md">
      <Search
        className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none"
        aria-hidden
      />
      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by title"
        className="pl-9 pr-3 bg-secondary border border-border rounded-full"
        aria-label="Search"
      />
    </div>
  )
}

export default SearchBar
