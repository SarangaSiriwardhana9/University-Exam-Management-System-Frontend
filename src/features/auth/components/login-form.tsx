 'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { EyeIcon, EyeOffIcon, GraduationCapIcon, AlertCircleIcon, ShieldCheckIcon, BookOpenIcon } from 'lucide-react'
import { useLogin } from '../hooks/use-auth-mutations'
import { loginSchema, type LoginFormData } from '../validations/auth-schemas'

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const loginMutation = useLogin()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: ''
    }
  })

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding & Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <Image
          src="/uni.jpeg"
          alt="University Campus"
          fill
          className="object-cover mix-blend-overlay opacity-60"
          priority
        />
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="University Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">University Portal</h1>
              <p className="text-sm text-white/80">Exam Management System</p>
            </div>
          </div>

          {/* Center Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                Welcome to Your<br />Academic Journey
              </h2>
              <p className="text-lg text-white/90 max-w-md">
                Access your exams, results, and academic records all in one secure platform.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <ShieldCheckIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Secure Access</p>
                  <p className="text-sm text-white/80">Your data is protected with enterprise-grade security</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <BookOpenIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Easy Management</p>
                  <p className="text-sm text-white/80">Manage exams and view results effortlessly</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <GraduationCapIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Academic Excellence</p>
                  <p className="text-sm text-white/80">Track your progress and achieve your goals</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-white/70">
            2024 University Exam Management System. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="University Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">University Portal</h1>
              <p className="text-sm text-muted-foreground">Exam Management System</p>
            </div>
          </div>

          {/* Form Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Sign In
            </h2>
            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Error Alert */}
          {loginMutation.isError && (
            <Alert className="border-destructive/50 bg-destructive/10">
              <AlertCircleIcon className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive">
                {loginMutation.error?.message || 'Login failed. Please check your credentials and try again.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="usernameOrEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      Username or Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username or email"
                        className="h-12 border-border focus:border-primary focus:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          className="h-12 pr-12 border-border focus:border-primary focus:ring-primary/20"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOffIcon className="w-5 h-5" />
                          ) : (
                            <EyeIcon className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 gradient-primary text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </Form>

          {/* Sign Up Link */}
          <div className="text-center pt-4">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link 
                href="/register" 
                className="text-primary hover:text-primary/80 font-semibold hover:underline transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}