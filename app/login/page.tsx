import { LoginForm } from '@/components/auth/login-form'

export const metadata = {
  title: 'Admin Login',
  description: 'Sign in to manage Luché orders and appointments.',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary px-4 py-12">
      <LoginForm />
    </main>
  )
}
