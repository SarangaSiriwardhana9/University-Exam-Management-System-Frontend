import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Next.js
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            Testing Tailwind CSS v4 with shadcn/ui components
          </p>
          
          {/* Badge Row */}
          <div className="flex justify-center gap-2 mb-8">
            <Badge variant="default">⚡ Fast</Badge>
            <Badge variant="secondary">🎨 Beautiful</Badge>
            <Badge variant="outline">🚀 Modern</Badge>
          </div>
        </div>

        {/* Feature Cards using shadcn Card */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white font-bold text-xl">⚡</span>
              </div>
              <CardTitle>Fast Performance</CardTitle>
              <CardDescription>
                Built with Next.js and optimized for speed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={95} className="mb-2" />
              <p className="text-sm text-muted-foreground">95% Performance Score</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white font-bold text-xl">🎨</span>
              </div>
              <CardTitle>Beautiful Design</CardTitle>
              <CardDescription>
                Powered by Tailwind CSS v4 and shadcn/ui
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch id="dark-mode" />
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white font-bold text-xl">🚀</span>
              </div>
              <CardTitle>Ready to Go</CardTitle>
              <CardDescription>
                No complex configuration needed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <span className="text-sm">Ready for development</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Section with shadcn Components */}
        <Card className="mb-12 max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Test shadcn/ui Components</CardTitle>
            <CardDescription>Try out the interactive elements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Enter your email" type="email" />
            </div>
            
            <div className="flex gap-2">
              <Button className="flex-1">Primary Button</Button>
              <Button variant="outline" className="flex-1">Outline</Button>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" className="w-full">
                  Open Dialog
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>shadcn/ui Dialog</DialogTitle>
                  <DialogDescription>
                    This is a test dialog to verify that shadcn/ui components are working properly.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p>Dialog content goes here. You can add forms, buttons, or any other content.</p>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Button Section with shadcn Buttons */}
        <div className="text-center mb-16">
          <Button size="lg" className="mr-4">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>

        {/* shadcn Components Test Section */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🧪 shadcn/ui Components Test
            </CardTitle>
            <CardDescription>
              Testing various shadcn/ui components to ensure they&#39;re working properly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                <Badge variant="default">Cards ✅</Badge>
                <p className="text-center text-muted-foreground">Card components working</p>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                <Badge variant="secondary">Buttons ✅</Badge>
                <p className="text-center text-muted-foreground">Button variants working</p>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                <Badge variant="outline">Forms ✅</Badge>
                <p className="text-center text-muted-foreground">Input & Label working</p>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                <Badge variant="destructive">Dialog ✅</Badge>
                <p className="text-center text-muted-foreground">Modal components working</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}