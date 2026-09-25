import { cn } from '@/utilities/ui'
import React from 'react'

// "H2TCOBRA" styled like the logo: blue "H2T" with a small "2", orange "COBRA", light metallic edge
export const Wordmark: React.FC<{ className?: string }> = ({ className }) => (
  <span
    className={cn(
      'inline-flex items-baseline gap-[0.2em] font-wordmark font-extrabold uppercase leading-none tracking-tight [filter:drop-shadow(0_0_1px_rgb(255_255_255/0.9))_drop-shadow(0_2px_2px_rgb(0_0_0/0.35))]',
      className,
    )}
  >
    <span className="bg-gradient-to-b from-[#7fd6ff] via-[#2b8fff] to-[#0a57c9] bg-clip-text text-transparent">
      H<span className="text-[0.62em]">2</span>T
    </span>
    <span className="bg-gradient-to-b from-[#ffcf73] via-[#ff8a1f] to-[#e25400] bg-clip-text text-transparent">
      COBRA
    </span>
  </span>
)
