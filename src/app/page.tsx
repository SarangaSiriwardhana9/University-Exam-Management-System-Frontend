 
import { Badge } from "@/components/ui/badge"
 

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
   
          
          {/* Badge Row */}
          <div className="flex justify-center gap-2 mb-8">
            <Badge variant="default">⚡ Fast</Badge>
            <Badge variant="secondary">🎨 Beautiful</Badge>
            <Badge variant="outline">🚀 Modern</Badge>
          </div>
        </div>

        {/* Feature Cards using shadcn Card */}
 

  
      </div>

  );
}