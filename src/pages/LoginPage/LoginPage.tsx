import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { persistAuthSession } from '@/hooks/adminApi'
import {
  buildLoginPayload,
  useUser,
} from '@/hooks/api/auth/useUser'
import { useAuthStore } from '@/store/authStore'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

function loginErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const msg = err.response?.data as { message?: string } | undefined
    return msg?.message ?? err.message ?? 'Sign in failed'
  }
  if (err instanceof Error) return err.message
  return 'Something went wrong'
}

export function LoginPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const login = useAuthStore((s) => s.login)

  const { mutateAsync, isPending } = useUser()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'admin@example.com', password: 'change-me-in-production' },
  })

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  async function onSubmit(values: LoginFormValues) {
    form.clearErrors('root')
    try {
      const payload = buildLoginPayload(values.email.trim(), values.password)
      const data = await mutateAsync(payload)
      persistAuthSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
        tier: data.tier,
      })
      login()
      navigate('/', { replace: true })
    } catch (err) {
      form.setError('root', { message: loginErrorMessage(err) })
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Enter your email and password to open the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                disabled={isPending}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email')}
              />
              {errors.email ? (
                <p id="email-error" className="text-destructive text-sm">
                  {errors.email.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                disabled={isPending}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
                {...register('password')}
              />
              {errors.password ? (
                <p id="password-error" className="text-destructive text-sm">
                  {errors.password.message}
                </p>
              ) : null}
            </div>
            {errors.root ? (
              <p className="text-destructive text-sm" role="alert">
                {errors.root.message}
              </p>
            ) : null}
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
