"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter, Search, Plus } from "lucide-react"

interface Fatwa {
  id: string
  title: string
  scholar: string
  category: string
  status: string
  date: string
}


const initialFatwas: Fatwa[] = [
  {
    id: "1",
    title: "Ruling on Digital Currencies",
    scholar: "Dr. Ahmad Ali",
    category: "Financial Transactions",
    status: "Approved",
    date: "2023-05-15",
  },
  {
    id: "2",
    title: "Fasting During Long Summer Days",
    scholar: "Shaikh Muhammad Ibrahim",
    category: "Worship",
    status: "In Review",
    date: "2023-06-01",
  },
  {
    id: "3",
    title: "Islamic Perspective on Organ Donation",
    scholar: "Dr. Fatima Hassan",
    category: "Medical Ethics",
    status: "Approved",
    date: "2023-04-22",
  },
  {
    id: "4",
    title: "Inheritance Rules for Digital Assets",
    scholar: "Dr. Ahmad Ali",
    category: "Financial Transactions",
    status: "Not Annotated",
    date: "2023-07-10",
  },
  {
    id: "5",
    title: "Prayer Times in Polar Regions",
    scholar: "Shaikh Muhammad Ibrahim",
    category: "Worship",
    status: "Rejected",
    date: "2023-06-15",
  },
  {
    id: "6",
    title: "Ethical Considerations in AI Development",
    scholar: "Dr. Fatima Hassan",
    category: "Technology",
    status: "Need Modification",
    date: "2023-07-05",
  },
  {
    id: "7",
    title: "Halal Food Certification Standards",
    scholar: "Dr. Ahmad Ali",
    category: "Food and Nutrition",
    status: "Approved",
    date: "2023-05-28",
  },
]

const categories = [
  "All Categories",
  "Financial Transactions",
  "Worship",
  "Medical Ethics",
  "Technology",
  "Food and Nutrition",
]

const statuses = ["All Statuses", "Not Annotated", "In Review", "Approved", "Rejected", "Need Modification"]

export default function FatwasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")
  const [fatwas] = useState<Fatwa[]>(initialFatwas)
  const [showFilters, setShowFilters] = useState(false)

  const filteredFatwas = fatwas.filter((fatwa) => {
    const matchesSearch =
      fatwa.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fatwa.scholar.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "All Categories" || fatwa.category === selectedCategory

    const matchesStatus = selectedStatus === "All Statuses" || fatwa.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-500 hover:bg-green-600"
      case "In Review":
        return "bg-blue-500 hover:bg-blue-600"
      case "Not Annotated":
        return "bg-gray-500 hover:bg-gray-600"
      case "Rejected":
        return "bg-red-500 hover:bg-red-600"
      case "Need Modification":
        return "bg-amber-500 hover:bg-amber-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Issue Viewer</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button asChild>
            <Link href="/dashboard/fatwas/new" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Create New Issue
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            id="search"
            placeholder="Search issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle>Filter Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="filter-category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger id="filter-category">
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="filter-status">Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger id="filter-status">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status filter buttons */}
      <div className="flex flex-wrap gap-2">
        {statuses.map(
          (status) =>
            status !== "All Statuses" && (
              <Button
                key={status}
                variant="outline"
                size="sm"
                className={`${selectedStatus === status ? getStatusColor(status) + " text-white" : ""}`}
                onClick={() => setSelectedStatus(status === selectedStatus ? "All Statuses" : status)}
              >
                {status}
              </Button>
            ),
        )}
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
            {filteredFatwas.length > 0 ? (
              filteredFatwas.map((fatwa) => (
                <TableRow key={fatwa.id}>
                  <TableCell className="font-medium">{fatwa.title}</TableCell>
                  <TableCell>{fatwa.scholar}</TableCell>
                  <TableCell>{fatwa.category}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(fatwa.status) + " text-white"}>{fatwa.status}</Badge>
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No issues found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

