import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const fatwas = [
  {
    id: "1",
    title: "Ruling on Digital Currencies",
    scholar: "Dr. Ahmad Ali",
    category: "Financial Transactions",
    status: "Published",
    date: "2023-05-15",
  },
  {
    id: "2",
    title: "Fasting During Long Summer Days",
    scholar: "Shaikh Muhammad Ibrahim",
    category: "Worship",
    status: "Under Review",
    date: "2023-06-01",
  },
  {
    id: "3",
    title: "Islamic Perspective on Organ Donation",
    scholar: "Dr. Fatima Hassan",
    category: "Medical Ethics",
    status: "Published",
    date: "2023-04-22",
  },
]

export default function FatwasPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Fatwas</h1>
        <Button asChild>
          <Link href="/dashboard/fatwas/new">Create New Fatwa</Link>
        </Button>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <Input id="search" placeholder="Search fatwas..." />
        </div>
        <div className="flex-1">
          <Label htmlFor="filter-category" className="sr-only">
            Filter by Category
          </Label>
          <Select>
            <SelectTrigger id="filter-category">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="financial-transactions">Financial Transactions</SelectItem>
              <SelectItem value="worship">Worship</SelectItem>
              <SelectItem value="medical-ethics">Medical Ethics</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label htmlFor="filter-status" className="sr-only">
            Filter by Status
          </Label>
          <Select>
            <SelectTrigger id="filter-status">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="under-review">Under Review</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Scholar</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fatwas.map((fatwa) => (
              <TableRow key={fatwa.id}>
                <TableCell className="font-medium">{fatwa.title}</TableCell>
                <TableCell>{fatwa.scholar}</TableCell>
                <TableCell>{fatwa.category}</TableCell>
                <TableCell>
                  <Badge variant={fatwa.status === "Published" ? "default" : "secondary"}>{fatwa.status}</Badge>
                </TableCell>
                <TableCell>{fatwa.date}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/fatwas/${fatwa.id}`}>Edit</Link>
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

