'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RocketIcon, ArrowLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ComingSoonProps {
  title?: string
  description?: string
  showBackButton?: boolean
}

export function ComingSoon({ 
  title = "Coming Soon", 
  description = "This feature is currently under development and will be available soon.",
  showBackButton = true 
}: ComingSoonProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <RocketIcon className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-muted-foreground mb-6">{description}</p>
          {showBackButton && (
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
