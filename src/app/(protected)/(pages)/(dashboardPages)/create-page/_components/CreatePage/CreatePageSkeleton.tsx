import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const CreatePageSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-8">
      <section className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 max-w-sm" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Skeleton className="h-10 w-full flex-1" />
            <Skeleton className="h-10 w-32" />
          </div>

          <Skeleton className="h-64 w-full rounded-xl" />

          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="space-y-3 rounded-xl border p-4">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-xl border p-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default CreatePageSkeleton
