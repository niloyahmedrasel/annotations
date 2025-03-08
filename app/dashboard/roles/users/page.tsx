"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronUp, ChevronDown } from "lucide-react"

interface User {
  _id: string
  name: string
  email: string
  role: string
}

type SortKey = "name" | "email" | "role"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [frozenUsers, setFrozenUsers] = useState<string[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      const user = sessionStorage.getItem("user")
      const token = user ? JSON.parse(user).token : null
      console.log(user)
      if (!token) {
        setError("No authentication token found.")
        setLoading(false)
        return
      }

      try {
        const response = await fetch("https://lkp.pathok.com.bd/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) throw new Error("Failed to fetch users")
        const data = await response.json()
        console.log("this is user",data)
        setUsers(data.users)
      } catch (err) {
        setError((err as any).message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

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
  }, [users, searchTerm, roleFilter, sortKey, sortOrder, frozenUsers])

  console.log(filteredAndSortedUsers)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }


  const toggleFreeze = (userId: string) => {
  setFrozenUsers((prev) => {
    const newFrozenUsers = prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId];
    console.log("Frozen Users List:", newFrozenUsers);
    return newFrozenUsers;
  });
};


  if (loading) return <p>Loading users...</p>
  if (error) return <p className="text-red-500">Error: {error}</p>

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
            <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>Name</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("email")}>Email</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("role")}>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedUsers.map((user) => (
            <TableRow key={user._id} className={frozenUsers.includes(user._id) ? "opacity-50" : ""}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell><Badge variant="secondary">{user.role}</Badge></TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/roles/users/${user._id}`}>Edit</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toggleFreeze(user._id)}>
                  {frozenUsers.includes(user._id) ? "Unfreeze" : "Freeze"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
