'use client'

import { useEffect, useRef, useState } from 'react'
import { Sparkle } from '@/components/brand/sparkle'
import { cn } from '@/lib/utils'

const PHOTO_SRC = '/editorial/hero-matched.png'

/**
 * The hero's centrepiece: the LUCHÉ ring, drawn once on load, with the logo's
 * four-point star resting on it. Inside the ring sits the editorial photo when
 * it is available; otherwise the studio lockup (monogram, wordmark, rule,
 * tagline) is set in type so the hero never shows a broken or empty frame.
 */
export function HeroMedallion({ className }: { className?: string }) {
  const [photo, setPhoto] = useState<'loading' | 'ready' | 'missing'>('loading')
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = imgRef.current
    if (img?.complete) setPhoto(img.naturalWidth > 0 ? 'ready' : 'missing')
  }, [])

  return (
    <div className={cn('relative mx-auto aspect-square w-full max-w-[17rem] sm:max-w-[23rem] lg:max-w-[33rem]', className)}>
      <svg viewBox="0 0 520 520" aria-hidden="true" className="absolute inset-0 size-full overflow-visible text-accent">
        <g transform="rotate(-90 260 260)" fill="none" stroke="currentColor">
          <circle className="hero-ring" cx="260" cy="260" r="253" pathLength="1" strokeWidth="2.6" />
          <circle className="hero-ring hero-ring-inner" cx="260" cy="260" r="240" pathLength="1" strokeWidth="0.9" />
        </g>
        <g transform="translate(453 98)">
          <circle r="31" className="fill-secondary" />
          <g className="hero-spark">
            <path
              transform="scale(25)"
              fill="currentColor"
              d="M0 -1C0.09 -0.3 0.3 -0.09 1 0C0.3 0.09 0.09 0.3 0 1C-0.09 0.3 -0.3 0.09 -1 0C-0.3 -0.09 -0.09 -0.3 0 -1Z"
            />
          </g>
        </g>
      </svg>

      <div className="@container absolute inset-[7.5%] overflow-hidden rounded-full bg-background">
        <div className="flex size-full flex-col items-center justify-center text-center">
          <span className="font-display text-[44cqw] leading-[0.8] text-accent">L</span>
          <span className="mt-[3cqw] font-display text-[13cqw] leading-none tracking-[0.05em] text-primary">LUCHÉ</span>
          <span className="mt-[4cqw] flex w-[58cqw] items-center gap-[2cqw] text-accent">
            <span className="h-px flex-1 bg-current opacity-60" />
            <Sparkle className="size-[4cqw]" />
            <span className="h-px flex-1 bg-current opacity-60" />
          </span>
          <span className="mt-[3.5cqw] text-[max(0.625rem,3.3cqw)] font-light uppercase tracking-[0.3em] text-primary/80">
            Hair &amp; Beauty Studio
          </span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={PHOTO_SRC}
          alt=""
          onLoad={() => setPhoto('ready')}
          onError={() => setPhoto('missing')}
          className={cn(
            'absolute inset-0 size-full object-cover transition-opacity duration-700',
            photo === 'ready' ? 'opacity-100' : 'opacity-0',
          )}
        />
      </div>
    </div>
  )
}
