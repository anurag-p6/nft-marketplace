'use client'
import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

interface HoverSidebarProps {
  title?: string
  children: React.ReactNode
}

export default function HoverSidebar({ title, children }: HoverSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full">
      {/* Header with Arrow */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-md transition-all"
      >
        <span>{title || 'More'}</span>
        <ChevronRight
          size={18}
          className={`transform transition-transform duration-300 ${
            isOpen ? 'rotate-90 text-purple-600' : 'text-gray-500'
          }`}
        />
      </button>

      {/* Collapsible Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mt-2">{children}</div>
      </div>
    </div>
  )
}