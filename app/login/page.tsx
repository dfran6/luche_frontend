import { LoginForm } from '@/components/auth/login-form'

export const metadata = {
  title: 'Admin login | Luché Hair & Beauty Studio',
  description: 'Sign in to manage Luché orders and appointments.',
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary px-4 py-12">
      <LoginForm />
    </main>
  )
}
