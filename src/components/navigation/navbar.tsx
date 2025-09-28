 
'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { 
  MenuIcon, 
  LogOutIcon, 
  UserIcon, 
  SettingsIcon, 
  BellIcon,
  GraduationCapIcon
} from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-provider'
import { useLogout } from '@/features/auth/hooks/use-auth-mutations'
import { NAVIGATION_ITEMS, type NavItem } from '@/constants/navigation'
import type { UserRole } from '@/constants/roles'
import { cn } from '@/lib/utils'

// Role-specific styling helper
const getRoleStyle = (role: UserRole) => {
  const roleStyles = {
    admin: 'role-admin',
    faculty: 'role-faculty', 
    student: 'role-student',
    exam_coordinator: 'role-exam-coordinator',
    invigilator: 'role-invigilator'
  } as const
  
  return roleStyles[role] || 'bg-muted text-muted-foreground'
}

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuth()
  const logoutMutation = useLogout()
  const pathname = usePathname()

  const navigationItems: NavItem[] = useMemo(() => {
    const userRole = user?.role as UserRole
    return userRole ? NAVIGATION_ITEMS[userRole] || [] : []
  }, [user?.role])

  const handleLogout = useCallback(() => {
    logoutMutation.mutate()
  }, [logoutMutation])

  const getUserInitials = useCallback((name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }, [])

  const formatRole = useCallback((role: string) => {
    return role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }, [])

  if (!user) return null

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
              <GraduationCapIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                University
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">Management System</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item: NavItem) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {item.title}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <BellIcon className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-destructive hover:bg-destructive">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.profileImage} alt={user.fullName} />
                    <AvatarFallback className="gradient-primary text-primary-foreground font-semibold">
                      {getUserInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72" align="end" forceMount>
                <DropdownMenuLabel className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.profileImage} alt={user.fullName} />
                      <AvatarFallback className="gradient-primary text-primary-foreground font-semibold">
                        {getUserInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{user.fullName}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      <Badge 
                        variant="outline" 
                        className={cn("mt-1 text-xs", getRoleStyle(user.role))}
                      >
                        {formatRole(user.role)}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center cursor-pointer">
                    <UserIcon className="mr-3 h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center cursor-pointer">
                    <SettingsIcon className="mr-3 h-4 w-4" />
                    Preferences
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                  disabled={logoutMutation.isPending}
                >
                  <LogOutIcon className="mr-3 h-4 w-4" />
                  {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-6 mt-6">
                  <div className="flex items-center space-x-3 pb-4 border-b">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.profileImage} alt={user.fullName} />
                      <AvatarFallback className="gradient-primary text-primary-foreground font-semibold">
                        {getUserInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user.fullName}</p>
                      <Badge className={cn("text-xs", getRoleStyle(user.role))}>
                        {formatRole(user.role)}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {navigationItems.map((item: NavItem) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "block px-4 py-3 rounded-lg text-base font-medium transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          )}
                        >
                          {item.title}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}