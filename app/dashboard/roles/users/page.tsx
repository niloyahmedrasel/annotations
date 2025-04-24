"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-toastify"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface User {
  _id: string
  name: string
  email: string
  role: string
  isfreeze?: boolean
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
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

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
        console.log("this is user", data)
        setUsers(data.users)

        // Initialize frozenUsers based on user data
        const initialFrozenUsers = data.users.filter((user:User) => user.isfreeze === true).map((user:User) => user._id)
        setFrozenUsers(initialFrozenUsers)
      } catch (err) {
        setError((err as any).message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const deleteUser = async (userId: string) => {
    const user = sessionStorage.getItem("user")
    const token = user ? JSON.parse(user).token : null
    if (!token) {
      setError("No authentication token found.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`https://lkp.pathok.com.bd/api/user/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("User not deleted")
      toast.success("User Deleted Successfully")
      setUsers(users.filter((user) => user._id !== userId))
    } catch (err) {
      setError((err as any).message)
      toast.error("Failed to delete user")
    }
  }

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId)
  }

  const confirmDelete = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete)
      setUserToDelete(null)
    }
  }

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

  const toggleFreeze = async (userId: string) => {
    const user = sessionStorage.getItem("user")
    const token = user ? JSON.parse(user).token : null

    if (!token) {
      setError("No authentication token found.")
      return
    }

    try {
      const isFrozen = frozenUsers.includes(userId)
      const endpoint = isFrozen
        ? `https://lkp.pathok.com.bd/api/user/unfreeze-user/${userId}`
        : `https://lkp.pathok.com.bd/api/user/freeze-user/${userId}`

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error(isFrozen ? "Failed to unfreeze user" : "Failed to freeze user")

      // Update frozenUsers state
      setFrozenUsers((prev) => {
        return isFrozen ? prev.filter((id) => id !== userId) : [...prev, userId]
      })

      // Update the freeze property in the users state
      setUsers((prevUsers) => prevUsers.map((user) => (user._id === userId ? { ...user, freeze: !isFrozen } : user)))

      toast.success(isFrozen ? "User unfrozen successfully" : "User frozen successfully")
    } catch (err) {
      setError((err as any).message)
      toast.error((err as any).message)
    }
  }

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
            <SelectItem value="Doc Organizer">Doc Organizer</SelectItem>
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
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("email")}>
              Email
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("role")}>
              Role
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedUsers.map((user) => (
            <TableRow key={user._id} className={user.isfreeze ? "opacity-50" : ""}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="default">{user.role}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/roles/users/${user._id}`}>Edit</Link>
                </Button>
                <Button onClick={() => handleDeleteClick(user._id)} variant="ghost" size="sm">
                  Delete
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toggleFreeze(user._id)}>
                  {user.isfreeze ? "Unfreeze" : "Freeze"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <Dialog open={userToDelete !== null} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
