'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { ArrowRight, LockKeyhole } from 'lucide-react'
import { loginAdmin } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/logo'

const initialState: { error: string } = { error: '' }
export function LoginForm() {
  const [state, action, pending] = useActionState(async (_state: typeof initialState, formData: FormData) => loginAdmin(formData), initialState)
  return <div className="w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-xl shadow-primary/10 sm:p-10">
    <Logo />
    <div className="mt-10"><h1 className="mt-5 font-display text-3xl text-foreground">Welcome back</h1><p className="mt-2 text-sm text-muted-foreground">Sign in to manage the studio.</p></div>
    <form action={action} className="mt-8 space-y-5"><div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required className="mt-1.5" /></div><div><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" required className="mt-1.5" /></div>{state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}<Button type="submit" size="lg" disabled={pending} className="w-full">{pending ? 'Signing in…' : 'Sign in'} <ArrowRight className="size-4" /></Button></form>
    <Link href="/" className="mt-6 block text-center text-sm text-muted-foreground hover:text-accent">Back to store</Link>
  </div>
}
