'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
 
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
  ChevronRightIcon,
  LayoutDashboardIcon,
  UsersIcon,
  BuildingIcon,
  BookOpenIcon,
  MapPinIcon,
  BarChartIcon,
  CalendarIcon,
  UserPlusIcon,
  HelpCircleIcon,
  FileTextIcon,
  ClipboardCheckIcon,
  AwardIcon,
  ClipboardIcon,
  ClockIcon,
  UserCheckIcon,
  LucideIcon
} from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-provider'
import { useLogout } from '@/features/auth/hooks/use-auth-mutations'
import { NAVIGATION_ITEMS, type NavItem } from '@/constants/navigation'
import type { UserRole } from '@/constants/roles'
import { cn } from '@/lib/utils'

const getIconComponent = (iconName?: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    'dashboard': LayoutDashboardIcon,
    'users': UsersIcon,
    'building': BuildingIcon,
    'book': BookOpenIcon,
    'map': MapPinIcon,
    'chart': BarChartIcon,
    'calendar': CalendarIcon,
    'user-plus': UserPlusIcon,
    'help-circle': HelpCircleIcon,
    'file-text': FileTextIcon,
    'clipboard-check': ClipboardCheckIcon,
    'award': AwardIcon,
    'clipboard': ClipboardIcon,
    'clock': ClockIcon,
    'user-check': UserCheckIcon,
    'bell': BellIcon
  }
  
  return iconMap[iconName || ''] || LayoutDashboardIcon
}

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
      <div className="p-6 border-b bg-gradient-to-br from-primary/5 to-secondary/5">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-12 h-12 bg-gradient-to-br from-primary via-primary/90 to-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="University Logo"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent truncate">
                University Portal
              </h1>
              <p className="text-xs text-muted-foreground font-medium">Exam Management</p>
            </div>
          )}
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b bg-gradient-to-br from-background to-muted/20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start p-3 h-auto hover:bg-primary/5 hover:shadow-md transition-all duration-200 rounded-xl",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Avatar className="h-11 w-11 flex-shrink-0 ring-2 ring-primary/20 shadow-md">
                <AvatarImage src={user.profileImage || "/user.png"} alt={user.fullName} />
                <AvatarFallback className="bg-gradient-to-br from-primary via-primary/90 to-secondary text-white font-semibold text-sm">
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
                    className={cn("text-xs mt-1 font-medium", getRoleStyle(user.role))}
                  >
                    {formatRole(user.role)}
                  </Badge>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72 shadow-xl" align="start" forceMount>
            <DropdownMenuLabel className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="flex items-center space-x-3">
                <Avatar className="h-14 w-14 ring-2 ring-primary/30 shadow-lg">
                  <AvatarImage src={user.profileImage || "/user.png"} alt={user.fullName} />
                  <AvatarFallback className="bg-gradient-to-br from-primary via-primary/90 to-secondary text-white font-semibold text-base">
                    {getUserInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground truncate">{user.fullName}</p>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">{user.email}</p>
                  <Badge
                    variant="outline"
                    className={cn("mt-2 text-xs font-medium", getRoleStyle(user.role))}
                  >
                    {formatRole(user.role)}
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center cursor-pointer py-2.5 hover:bg-primary/5 transition-colors">
                <UserIcon className="mr-3 h-4 w-4 text-primary" />
                <span className="font-medium">Profile Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center cursor-pointer py-2.5 hover:bg-primary/5 transition-colors">
                <SettingsIcon className="mr-3 h-4 w-4 text-primary" />
                <span className="font-medium">Preferences</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer py-2.5 font-medium"
              disabled={logoutMutation.isPending}
            >
              <LogOutIcon className="mr-3 h-4 w-4" />
              <span>{logoutMutation.isPending ? 'Signing out...' : 'Sign out'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1.5">
          {navigationItems.map((item: NavItem) => {
            const isActive = pathname === item.href
            const IconComponent = getIconComponent(item.icon)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 group relative overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-primary to-primary/90 text-white"
                    : "text-muted-foreground hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 hover:text-foreground",
                  isCollapsed && "justify-center px-2"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50" />
                )}
                <IconComponent className="flex-shrink-0 w-5 h-5 relative z-10" />
                {!isCollapsed && <span className="relative z-10">{item.title}</span>}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-4 border-t bg-gradient-to-br from-muted/20 to-background space-y-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start relative rounded-xl hover:bg-primary/5 hover:shadow-md transition-all duration-200",
            isCollapsed && "justify-center px-2"
          )}
        >
          <BellIcon className="h-5 w-5 text-primary" />
          {!isCollapsed && <span className="ml-3 font-medium">Notifications</span>}
          <Badge className="absolute top-1.5 right-1.5 w-5 h-5 text-xs bg-gradient-to-br from-destructive to-destructive/80 hover:from-destructive hover:to-destructive/90 p-0 flex items-center justify-center shadow-lg animate-pulse">
            3
          </Badge>
        </Button>

        <Button
          variant="ghost"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className={cn(
            "w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl hover:shadow-md transition-all duration-200 font-medium",
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
          "hidden lg:flex flex-col border-r bg-gradient-to-b from-card via-card to-muted/10 shadow-xl transition-all duration-300 relative",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        <SidebarContent isCollapsed={isCollapsed} />

        {/* Collapse Toggle */}
        <Button
          variant="outline"
          size="icon"
          className="absolute -right-3 top-6 h-7 w-7 rounded-full border-2 border-primary/20 bg-background shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 z-10"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4 text-primary" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4 text-primary" />
          )}
        </Button>
      </aside>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shadow-xl bg-gradient-to-br from-primary to-primary/90 text-white border-0 hover:shadow-2xl hover:scale-105 transition-all duration-200">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-gradient-to-b from-card via-card to-muted/10">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}