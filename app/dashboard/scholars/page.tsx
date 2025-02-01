"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, ExternalLink } from "lucide-react"

interface Scholar {
  id: string
  name: string
  specialization: string
  booksCount: number
  fatwasCount: number
  website: string | null
}

const initialScholars: Scholar[] = [
  {
    id: "1",
    name: "Dr. Ahmad Ali",
    specialization: "Islamic Jurisprudence",
    booksCount: 15,
    fatwasCount: 150,
    website: "https://www.drahmedali.com",
  },
  {
    id: "2",
    name: "Shaikh Muhammad Ibrahim",
    specialization: "Hadith Studies",
    booksCount: 8,
    fatwasCount: 120,
    website: null,
  },
  {
    id: "3",
    name: "Dr. Fatima Hassan",
    specialization: "Quranic Exegesis",
    booksCount: 12,
    fatwasCount: 80,
    website: "https://www.drfatimahassan.org",
  },
]

export default function ScholarsDirectoryPage() {
  const [scholars, setScholars] = useState<Scholar[]>(initialScholars)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredScholars = scholars.filter(
    (scholar) =>
      scholar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholar.specialization.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const deleteScholar = (id: string) => {
    setScholars(scholars.filter((scholar) => scholar.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Scholars Directory</h1>
        <Button asChild>
          <Link href="/dashboard/scholars/new">Add New Scholar</Link>
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search scholars..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Books</TableHead>
              <TableHead>Fatwas</TableHead>
              <TableHead>Website</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredScholars.map((scholar) => (
              <TableRow key={scholar.id}>
                <TableCell className="font-medium">{scholar.name}</TableCell>
                <TableCell>{scholar.specialization}</TableCell>
                <TableCell>{scholar.booksCount}</TableCell>
                <TableCell>{scholar.fatwasCount}</TableCell>
                <TableCell>
                  {scholar.website ? (
                    <a
                      href={scholar.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-500 hover:underline"
                    >
                      Visit <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  ) : (
                    <Badge variant="secondary">Not Available</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/scholars/${scholar.id}`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteScholar(scholar.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
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

