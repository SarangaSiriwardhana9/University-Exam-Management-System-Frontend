'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet'
import {
  GraduationCapIcon,
  LogOutIcon,
  UserIcon,
  SettingsIcon,
  BellIcon,
  MenuIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-provider'
import { useLogout } from '@/features/auth/hooks/use-auth-mutations'
import { NAVIGATION_ITEMS, type NavItem } from '@/constants/navigation'
import type { UserRole } from '@/constants/roles'
import { cn } from '@/lib/utils'

const getRoleStyle = (role: UserRole) => {
  const roleStyles = {
    admin: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    faculty: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    student: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    exam_coordinator: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    invigilator: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
  } as const

  return roleStyles[role] || 'bg-muted text-muted-foreground'
}

type SidebarContentProps = {
  isCollapsed?: boolean
  onNavigate?: () => void
}

const SidebarContent = ({ isCollapsed = false, onNavigate }: SidebarContentProps) => {
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 flex-shrink-0">
            <GraduationCapIcon className="w-6 h-6 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent truncate">
                University
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Management System</p>
            </div>
          )}
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start p-3 h-auto hover:bg-muted/50 transition-colors",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={user.profileImage} alt={user.fullName} />
                <AvatarFallback className="gradient-primary text-primary-foreground font-semibold text-sm">
                  {getUserInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="ml-3 flex-1 text-left min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {user.fullName}
                  </p>
                  <Badge
                    variant="outline"
                    className={cn("text-xs mt-1", getRoleStyle(user.role))}
                  >
                    {formatRole(user.role)}
                  </Badge>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="start" forceMount>
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
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigationItems.map((item: NavItem) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  {isActive && <div className="w-2 h-2 bg-current rounded-full" />}
                  {!isActive && <div className="w-1.5 h-1.5 bg-current/40 rounded-full" />}
                </div>
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-4 border-t space-y-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start relative",
            isCollapsed && "justify-center px-2"
          )}
        >
          <BellIcon className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Notifications</span>}
          <Badge className="absolute top-1 right-1 w-5 h-5 text-xs bg-destructive hover:bg-destructive p-0 flex items-center justify-center">
            3
          </Badge>
        </Button>

        <Button
          variant="ghost"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className={cn(
            "w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10",
            isCollapsed && "justify-center px-2"
          )}
        >
          <LogOutIcon className="h-5 w-5" />
          {!isCollapsed && (
            <span className="ml-3">
              {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r bg-card transition-all duration-300 relative",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        <SidebarContent isCollapsed={isCollapsed} />

        {/* Collapse Toggle */}
        <Button
          variant="outline"
          size="icon"
          className="absolute -right-3 top-6 h-6 w-6 rounded-full border shadow-sm z-10"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4" />
          )}
        </Button>
      </aside>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shadow-lg">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}