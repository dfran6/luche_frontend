import { Star } from 'lucide-react'
import { ReviewModerationActions } from '@/components/admin/review-moderation-actions'
import { getAdminProductReviews } from '@/lib/data/reviews'
import { getAdminProducts } from '@/lib/data/products'

export default async function ProductReviewsAdminPage() {
  const [reviews, products] = await Promise.all([getAdminProductReviews(), getAdminProducts()])
  const productNames = new Map(products.map((product) => [product.id, product.name]))

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-foreground">Product reviews</h1>
        <p className="mt-1 text-sm text-muted-foreground">Approve new reviews and remove approved reviews when needed.</p>
      </header>

      {reviews.length ? (
        <ul className="space-y-3">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{productNames.get(review.product_id) || 'Product'}</p>
                  <div className="mt-2 flex items-center gap-1 text-gold" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, index) => <Star key={index} className={`size-4 ${index < review.rating ? 'fill-current' : ''}`} />)}
                  </div>
                  <p className="mt-2 text-sm font-medium">{review.customer_name}</p>
                  <p className="text-xs text-muted-foreground">{review.email} · {new Date(review.created_at).toLocaleDateString()} · {review.is_approved ? 'Approved' : 'Awaiting approval'}</p>
                  {review.comment ? <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{review.comment}</p> : <p className="mt-3 text-sm italic text-muted-foreground">No written comment.</p>}
                </div>
                <ReviewModerationActions id={review.id} approved={review.is_approved} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
          No customer reviews have been submitted yet.
        </div>
      )}
    </div>
  )
}
