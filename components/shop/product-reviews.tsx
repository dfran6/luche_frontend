'use client'

import { useState, useTransition } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { submitProductReview } from '@/lib/store/actions'
import type { ProductReview } from '@/lib/data/products'
import { cn } from '@/lib/utils'

export function ProductReviews({ productId, reviews }: { productId: string; reviews: ProductReview[] }) {
  const [rating, setRating] = useState(5)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const form = event.currentTarget
    const values = new FormData(form)
    startTransition(async () => {
      const result = await submitProductReview(productId, {
        name: String(values.get('name') ?? ''),
        email: String(values.get('email') ?? ''),
        rating,
        comment: String(values.get('comment') ?? ''),
      })
      if (result.ok) {
        form.reset()
        setRating(5)
        setSubmitted(true)
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <section id="reviews" className="grid gap-10 border-t border-border pt-10 lg:grid-cols-[1fr_360px]">
      <div>
        <h2 className="font-display text-2xl text-foreground">Customer reviews</h2>
        {reviews.length ? (
          <ul className="mt-6 divide-y divide-border">
            {reviews.map((review) => (
              <li key={review.id} className="py-5 first:pt-0">
                <div className="flex items-center gap-1 text-gold" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} className={cn('size-4', index < review.rating && 'fill-current')} />
                  ))}
                </div>
                <p className="mt-2 text-sm font-medium text-foreground">{review.customer_name}</p>
                {review.comment ? <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{review.comment}</p> : null}
                <time className="mt-2 block text-xs text-muted-foreground" dateTime={review.created_at}>
                  {new Date(review.created_at).toLocaleDateString()}
                </time>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No approved reviews yet. Be the first to share your experience.</p>
        )}
      </div>

      <form onSubmit={onSubmit} className="h-fit space-y-4 rounded-xl border border-border bg-card p-5">
        <div>
          <h3 className="font-medium text-foreground">Write a review</h3>
          <p className="mt-1 text-sm text-muted-foreground">Your rating and comments will be visible after review by our team.</p>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-foreground">Your rating</legend>
          <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Choose a rating">
            {Array.from({ length: 5 }, (_, index) => {
              const value = index + 1
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={rating === value}
                  aria-label={`${value} star${value === 1 ? '' : 's'}`}
                  onClick={() => setRating(value)}
                  className="rounded p-1 text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <Star className={cn('size-6', value <= rating && 'fill-current')} />
                </button>
              )
            })}
          </div>
        </fieldset>

        <div>
          <Label htmlFor="review-name">Name</Label>
          <Input id="review-name" name="name" required maxLength={120} autoComplete="name" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="review-email">Email</Label>
          <Input id="review-email" name="email" type="email" required maxLength={254} autoComplete="email" className="mt-1.5" />
          <p className="mt-1 text-xs text-muted-foreground">Your email won&apos;t be shown with the review.</p>
        </div>
        <div>
          <Label htmlFor="review-comment">Comment (optional)</Label>
          <Textarea id="review-comment" name="comment" maxLength={2000} rows={4} className="mt-1.5" />
        </div>

        {error ? <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p> : null}
        {submitted ? <p role="status" className="rounded-md bg-secondary px-3 py-2 text-sm text-foreground">Thanks! Your review was submitted and will appear after approval.</p> : null}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Submitting…' : 'Submit review'}
        </Button>
      </form>
    </section>
  )
}
