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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, Calendar, MapPin, Shield, Clock, AlertCircle } from "lucide-react"

interface UserType {
  _id: string
  name: string
  email: string
  role: string
  isfreeze?: boolean
  phone?: string
  joinedDate?: string
  location?: string
  lastActive?: string
  profilePicture?: string
}

type SortKey = "name" | "email" | "role"

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [frozenUsers, setFrozenUsers] = useState<string[]>([])
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)

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
        const enhancedUsers = data.users.map((user: UserType) => ({
          ...user,
          phone: user.phone || "+1 (555) 123-4567",
          joinedDate: user.joinedDate || "2023-01-15",
          location: user.location || "New York, USA",
          lastActive: user.lastActive || "2 hours ago",
          profilePicture: user.profilePicture || `/placeholder.svg?height=200&width=200`,
        }))

        setUsers(enhancedUsers)

        const initialFrozenUsers = data.users
          .filter((user: UserType) => user.isfreeze === true)
          .map((user: UserType) => user._id)
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

      const data = await response.json()

      if (!response.ok) throw new Error(isFrozen ? data.message : data.message)

      setFrozenUsers((prev) => {
        return isFrozen ? prev.filter((id) => id !== userId) : [...prev, userId]
      })

      setUsers((prevUsers) => prevUsers.map((user) => (user._id === userId ? { ...user, freeze: !isFrozen } : user)))

      toast.success(isFrozen ? "User unfrozen successfully" : "User frozen successfully")
    } catch (err) {
      setError((err as any).message)
      toast.error((err as any).message)
    }
  }

  const handleUserClick = (user: UserType) => {
    setSelectedUser(user)
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
            <TableRow
              key={user._id}
              className={`${user.isfreeze ? "opacity-50" : ""} cursor-pointer hover:bg-muted/50`}
              onClick={() => handleUserClick(user)}
            >
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="default">{user.role}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                  <Link href={`/dashboard/roles/users/${user._id}`}>Edit</Link>
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteClick(user._id)
                  }}
                  variant="ghost"
                  size="sm"
                >
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFreeze(user._id)
                  }}
                >
                  {user.isfreeze ? "Unfreeze" : "Freeze"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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

      <Dialog open={selectedUser !== null} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          {selectedUser && (
            <div className="flex flex-col">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 border-4 border-white">
                    <AvatarImage src={selectedUser.profilePicture || "/placeholder.svg"} alt={selectedUser.name} />
                    <AvatarFallback className="text-2xl">{selectedUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                    <p className="text-purple-100">{selectedUser.role}</p>
                    <Badge variant="secondary" className="mt-2 bg-white/20 hover:bg-white/30">
                      {selectedUser.isfreeze ? "Account Frozen" : "Active Account"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-6 grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedUser.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedUser.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedUser.location}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Account Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span>Role: {selectedUser.role}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Joined: {selectedUser.joinedDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Last active: {selectedUser.lastActive}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {selectedUser.isfreeze && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <p className="text-amber-700 text-sm">This account is currently frozen and has limited access.</p>
                  </div>
                )}
              </div>

              {/* Footer with actions */}
              <div className="border-t p-4 flex justify-end gap-2 bg-muted/20">
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                  Close
                </Button>
                <Button asChild>
                  <Link href={`/dashboard/roles/users/${selectedUser._id}`}>Edit User</Link>
                </Button>
                {selectedUser.isfreeze ? (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      toggleFreeze(selectedUser._id)
                      setSelectedUser(null)
                    }}
                  >
                    Unfreeze Account
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      toggleFreeze(selectedUser._id)
                      setSelectedUser(null)
                    }}
                  >
                    Freeze Account
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
