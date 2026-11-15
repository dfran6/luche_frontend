# LUCHE Storefront

LUCHE is a hair and beauty storefront with a salon services booking experience. Customers can browse products and services, add products to a cart, submit an order or appointment request, and continue coordinating with the business through WhatsApp. The site also includes an administration area for managing the catalog, inventory, orders, and appointments.

This frontend is built with Next.js App Router, React, and TypeScript. It uses the LUCHE FastAPI backend for catalog, account, order, and appointment data; see the [backend README](../backend/README.md) and the root [API endpoint guide](../API_ENDPOINTS.md).

## Run locally

Install dependencies with pnpm, then start the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Configure the frontend environment variables in `.env.local` for the backend API URL and any other environment-specific settings. Do not commit secrets.

Useful commands:

```bash
pnpm build
pnpm start
```

## Main areas

- Storefront pages for featured products, the product catalog, product details, and business information.
- Service discovery and appointment requests.
- Cart and order submission, followed by WhatsApp coordination; the active checkout flow does not use Stripe.
- Admin pages for products and stock, services, orders, and appointments.

The Next.js application lives in `app/`, reusable UI in `components/`, and shared frontend data and API helpers in `lib/`.
