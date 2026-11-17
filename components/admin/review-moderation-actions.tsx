'use client'

import { useState, useTransition } from 'react'
import { approveProductReview, deleteProductReview } from '@/app/admin/record-actions'
import { Button } from '@/components/ui/button'

export function ReviewModerationActions({ id, approved = false }: { id: string; approved?: boolean }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function run(action: typeof approveProductReview | typeof deleteProductReview) {
    setError(null)
    startTransition(async () => {
      const result = await action(id)
      if (!result.ok) setError(result.error)
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!approved && <Button type="button" size="sm" disabled={isPending} onClick={() => run(approveProductReview)}>Approve</Button>}
      <Button type="button" size="sm" variant="outline" disabled={isPending} onClick={() => run(deleteProductReview)}>
        {approved ? 'Delete review' : 'Reject'}
      </Button>
      {error ? <p role="alert" className="w-full text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
