/** Optional marketing consent, shared by checkout and booking. */
export function MarketingConsent() {
  return (
    <div className="rounded-lg border border-border p-4">
      <label htmlFor="marketing_consent" className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
        <input
          id="marketing_consent"
          name="marketing_consent"
          type="checkbox"
          className="mt-1 size-4 shrink-0 accent-primary"
        />
        <span>
          Send me occasional emails from LUCHE about products, services and offers. This is optional, and I can
          withdraw my consent at any time by contacting LUCHE.
        </span>
      </label>
    </div>
  )
}
