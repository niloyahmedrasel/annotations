"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CreateIssueDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: any
}

export function CreateIssueDialog({ open, onOpenChange, document }: CreateIssueDialogProps) {
  if (!document) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Issue</DialogTitle>
          <DialogDescription>Create a new issue for "{document.title}"</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={document.thumbnail || "/placeholder.svg"}
              alt={document.title}
              className="h-24 w-16 object-cover rounded-sm"
            />
            <div>
              <h3 className="font-semibold">{document.title}</h3>
              <p className="text-sm text-gray-500">{document.author}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="issue-title" className="block text-sm font-medium mb-1">
                Issue Title
              </label>
              <Input id="issue-title" placeholder="Enter issue title" />
            </div>

            <div>
              <label htmlFor="issue-description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="issue-description"
                className="w-full min-h-[100px] rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm"
                placeholder="Describe the issue or annotation needed"
              />
            </div>

            <div>
              <label htmlFor="issue-priority" className="block text-sm font-medium mb-1">
                Priority
              </label>
              <Select defaultValue="medium">
                <SelectTrigger id="issue-priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="issue-assignee" className="block text-sm font-medium mb-1">
                Assign To
              </label>
              <Select>
                <SelectTrigger id="issue-assignee">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">Dr. Ahmad Ali</SelectItem>
                  <SelectItem value="user2">Shaikh Muhammad Ibrahim</SelectItem>
                  <SelectItem value="user3">Dr. Fatima Hassan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Create Issue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

