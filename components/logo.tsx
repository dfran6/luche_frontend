import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export function Logo({
  className,
  showWordmark = true,
  size = 40,
}: {
  className?: string
  showWordmark?: boolean
  size?: number
}) {
  return (
    <Link href="/" className={cn('flex items-center gap-3 text-primary', className)} aria-label="LUCHÉ — home">
      <Image
        src="/luche-logo.jpg"
        alt="LUCHÉ Hair & Beauty Studio"
        width={size}
        height={size}
        className="rounded-full"
        priority
      />
      {showWordmark && (
        <span className="font-display text-2xl leading-none text-current">LUCHÉ</span>
      )}
    </Link>
  )
}
