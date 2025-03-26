"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ViewDocumentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: any
  onCreateIssue: () => void
}

export function ViewDocumentDialog({ open, onOpenChange, document, onCreateIssue }: ViewDocumentDialogProps) {
  if (!document) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Document Preview</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex justify-center">
            <img
              src={document.thumbnail || "/placeholder.svg"}
              alt={document.title}
              className="h-48 w-32 object-cover rounded-md"
            />
          </div>
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-bold">{document.title}</h2>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-500">Author</p>
                <p>{document.author}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p>{document.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p>{document.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pages</p>
                <p>{document.pages}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Language</p>
                <p>{document.language}</p>
              </div>
              {document.shamelaId && (
                <div>
                  <p className="text-sm text-gray-500">Shamela ID</p>
                  <p>{document.shamelaId}</p>
                </div>
              )}
            </div>
            <div className="pt-4">
              <p className="text-sm text-gray-500">Document Preview</p>
              <div className="mt-2 h-48 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Document preview would appear here</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={onCreateIssue}>Create Issue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

