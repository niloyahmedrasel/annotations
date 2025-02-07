"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronUp, ChevronDown } from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  role: string
}

const users: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Book Organizer" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Annotator" },
  { id: 3, name: "Ahmed Ali", email: "ahmed@example.com", role: "Reviewer" },
  { id: 4, name: "Maria Garcia", email: "maria@example.com", role: "Book Organizer" },
  { id: 5, name: "David Chen", email: "david@example.com", role: "Annotator" },
  { id: 6, name: "Sarah Johnson", email: "sarah@example.com", role: "Reviewer" },
  { id: 7, name: "Mohammed Al-Fayed", email: "mohammed@example.com", role: "Book Organizer" },
  { id: 8, name: "Emily Brown", email: "emily@example.com", role: "Annotator" },
]

type SortKey = "name" | "email" | "role"

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [frozenUsers, setFrozenUsers] = useState<number[]>([])

  const filteredAndSortedUsers = useMemo(() => {
    return users
      .filter(
        (user) =>
          (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (roleFilter === "All" || user.role === roleFilter),
      )
      .sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1
        if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1
        return 0
      })
  }, [searchTerm, roleFilter, sortKey, sortOrder])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }

  const toggleFreeze = (userId: number) => {
    setFrozenUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button asChild>
          <Link href="/dashboard/roles/users/new">Add New User</Link>
        </Button>
      </div>
      <div className="flex space-x-4">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Roles</SelectItem>
            <SelectItem value="Book Organizer">Book Organizer</SelectItem>
            <SelectItem value="Annotator">Annotator</SelectItem>
            <SelectItem value="Reviewer">Reviewer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
              Name
              {sortKey === "name" &&
                (sortOrder === "asc" ? <ChevronUp className="inline ml-2" /> : <ChevronDown className="inline ml-2" />)}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("email")}>
              Email
              {sortKey === "email" &&
                (sortOrder === "asc" ? <ChevronUp className="inline ml-2" /> : <ChevronDown className="inline ml-2" />)}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("role")}>
              Role
              {sortKey === "role" &&
                (sortOrder === "asc" ? <ChevronUp className="inline ml-2" /> : <ChevronDown className="inline ml-2" />)}
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedUsers.map((user) => (
            <TableRow key={user.id} className={frozenUsers.includes(user.id) ? "opacity-50" : ""}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="secondary">{user.role}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/roles/users/${user.id}`}>Edit</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toggleFreeze(user.id)}>
                  {frozenUsers.includes(user.id) ? "Unfreeze" : "Freeze"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

