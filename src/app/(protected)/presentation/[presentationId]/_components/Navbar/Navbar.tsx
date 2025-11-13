import React from 'react'
import { useSlideStore } from '@/store/useSlideStore'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import { toast } from 'sonner'
import { Share } from 'lucide-react'
import { Play } from 'lucide-react'

type Props = {
  presentationId?: string
}

const Navbar = ({ presentationId }: Props) => {
  const { currentTheme } = useSlideStore()
  const [isPresentationMode, setIsPresentationMode] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/presentation/${presentationId}`
    )

    toast.success('Link copied to clipboard!')
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-20 w-full flex items-center justify-between px-7 py-4 border-b"
      style={{
        backgroundColor: currentTheme?.navColor,
        color: currentTheme?.accentColor,
      }}
    >
      <div className="flex items-center">
        <Link href="/dashboard" passHref>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            style={{
              backgroundColor:
                currentTheme?.backgroundColor || currentTheme?.navColor,
            }}
          >
            <Home className="text-cyan-600 w-4 h-4" />
            <span className="text-gray-500 hidden sm:inline">
              Back to Dashboard
            </span>
          </Button>
        </Link>
      </div>
      <Link
        href={`/presentation/template-marketing`}
        className="text-lg font-semibold text-center text-cyan-600"
      >
        Presentation Editor
      </Link>

      <div>
        <Button
          className="flex items-center gap-4"
          style={{
            backgroundColor:
              currentTheme?.backgroundColor || currentTheme?.navColor,
          }}
          variant="outline"
          onClick={handleCopy}
        >
          <Share className="w-4 h-4 text-cyan-600" />
        </Button>
      </div>

      <div>
        <Button
          variant={'default'}
          className="flex items-center gap-2"
          onClick={() => setIsPresentationMode(true)}
        >
          <Play className="w-4 h-4 text-cyan-600" />
          <span className="hidden sm:inline">Present</span>
        </Button>
      </div>
    </nav>
  )
}

export default Navbar
