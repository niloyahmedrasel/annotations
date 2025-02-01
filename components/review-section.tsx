import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export function ReviewSection({ onBack, bookId }: { onBack: () => void; bookId: string }) {
  const [content, setContent] = useState("")

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-800 p-4 flex items-center">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Processing Steps
        </Button>
        <h2 className="text-xl font-bold">Review & Complete: Book {bookId}</h2>
      </div>
      <div className="flex-1 flex overflow-hidden">
        {/* PDF Viewer Placeholder */}
        <div className="w-1/2 p-4 overflow-auto">
          <div className="bg-gray-700 h-full rounded-lg flex items-center justify-center">
            <p>PDF Viewer Placeholder</p>
          </div>
        </div>

        {/* Rich Text Editor Placeholder */}
        <div className="w-1/2 p-4 flex flex-col">
          <textarea
            className="flex-1 p-2 bg-gray-700 text-white rounded-lg resize-none"
            value={content}
            onChange={handleContentChange}
            placeholder="Edit the book content here..."
          />
        </div>
      </div>
    </div>
  )
}