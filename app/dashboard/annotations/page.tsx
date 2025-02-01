import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const annotations = [
  {
    id: "1",
    text: "This hadith emphasizes the importance of intention in actions.",
    book: "Sahih Al-Bukhari",
    chapter: "Book of Revelation",
    tags: ["intention", "actions", "deeds"],
    createdBy: "Dr. Ahmad Ali",
    createdAt: "2023-06-15",
  },
  {
    id: "2",
    text: "This verse discusses the concept of justice in Islam.",
    book: "Quran",
    chapter: "Surah An-Nisa",
    tags: ["justice", "equality", "social ethics"],
    createdBy: "Shaikh Muhammad Ibrahim",
    createdAt: "2023-06-10",
  },
  {
    id: "3",
    text: "This passage explains the rulings on fasting during Ramadan.",
    book: "Fiqh of Worship",
    chapter: "Chapter on Fasting",
    tags: ["fasting", "Ramadan", "worship"],
    createdBy: "Dr. Fatima Hassan",
    createdAt: "2023-06-05",
  },
]

export default function AnnotationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Annotations</h1>
        <Button asChild>
          <Link href="/dashboard/annotations/new">Create New Annotation</Link>
        </Button>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <Input id="search" placeholder="Search annotations..." />
        </div>
        <div className="flex-1">
          <Label htmlFor="filter-book" className="sr-only">
            Filter by Book
          </Label>
          <Select>
            <SelectTrigger id="filter-book">
              <SelectValue placeholder="Filter by Book" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Books</SelectItem>
              <SelectItem value="sahih-al-bukhari">Sahih Al-Bukhari</SelectItem>
              <SelectItem value="quran">Quran</SelectItem>
              <SelectItem value="fiqh-of-worship">Fiqh of Worship</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label htmlFor="filter-tag" className="sr-only">
            Filter by Tag
          </Label>
          <Select>
            <SelectTrigger id="filter-tag">
              <SelectValue placeholder="Filter by Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              <SelectItem value="intention">Intention</SelectItem>
              <SelectItem value="justice">Justice</SelectItem>
              <SelectItem value="fasting">Fasting</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Text</TableHead>
              <TableHead>Book</TableHead>
              <TableHead>Chapter</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {annotations.map((annotation) => (
              <TableRow key={annotation.id}>
                <TableCell className="font-medium">{annotation.text}</TableCell>
                <TableCell>{annotation.book}</TableCell>
                <TableCell>{annotation.chapter}</TableCell>
                <TableCell>
                  {annotation.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="mr-1">
                      {tag}
                    </Badge>
                  ))}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${annotation.createdBy}`}
                        alt={annotation.createdBy}
                      />
                      <AvatarFallback>
                        {annotation.createdBy
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{annotation.createdBy}</span>
                  </div>
                </TableCell>
                <TableCell>{annotation.createdAt}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/annotations/${annotation.id}`}>Edit</Link>
                  </Button>
                  <Button variant="ghost" size="sm">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

