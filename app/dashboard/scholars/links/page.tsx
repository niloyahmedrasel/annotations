"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"

interface ScholarLink {
  id: string
  scholarId: string
  scholarName: string
  linkType: "book" | "fatwa"
  itemId: string
  itemTitle: string
}

const initialLinks: ScholarLink[] = [
  {
    id: "1",
    scholarId: "1",
    scholarName: "Dr. Ahmad Ali",
    linkType: "book",
    itemId: "b1",
    itemTitle: "Principles of Islamic Jurisprudence",
  },
  {
    id: "2",
    scholarId: "1",
    scholarName: "Dr. Ahmad Ali",
    linkType: "fatwa",
    itemId: "f1",
    itemTitle: "Ruling on Digital Currencies",
  },
  {
    id: "3",
    scholarId: "2",
    scholarName: "Shaikh Muhammad Ibrahim",
    linkType: "book",
    itemId: "b2",
    itemTitle: "Compilation of Authentic Hadiths",
  },
]

const scholars = [
  { id: "1", name: "Dr. Ahmad Ali" },
  { id: "2", name: "Shaikh Muhammad Ibrahim" },
  { id: "3", name: "Dr. Fatima Hassan" },
]

export default function ScholarLinksPage() {
  const [links, setLinks] = useState<ScholarLink[]>(initialLinks)
  const [filterScholar, setFilterScholar] = useState("")
  const [filterType, setFilterType] = useState<"book" | "fatwa" | "">("")

  const deleteLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id))
  }

  const filteredLinks = links.filter(
    (link) =>
      (filterScholar === "" || link.scholarId === filterScholar) && (filterType === "" || link.linkType === filterType),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Scholar Link Management</h1>
        <Button asChild>
          <Link href="/dashboard/scholars/links/add">Add New Link</Link>
        </Button>
      </div>
      <div className="flex space-x-4">
        <Select value={filterScholar} onValueChange={setFilterScholar}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Scholar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Scholars</SelectItem>
            {scholars.map((scholar) => (
              <SelectItem key={scholar.id} value={scholar.id}>
                {scholar.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={(value) => setFilterType(value as "book" | "fatwa" | "")}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="book">Book</SelectItem>
            <SelectItem value="fatwa">Fatwa</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Scholar</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLinks.map((link) => (
              <TableRow key={link.id}>
                <TableCell>{link.scholarName}</TableCell>
                <TableCell className="capitalize">{link.linkType}</TableCell>
                <TableCell>{link.itemTitle}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => deleteLink(link.id)}>
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

