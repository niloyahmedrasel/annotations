import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const users = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Book Organizer" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Annotator" },
  { id: 3, name: "Ahmed Ali", email: "ahmed@example.com", role: "Reviewer" },
]

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button asChild>
          <Link href="/dashboard/roles/users/new">Add New User</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="secondary">{user.role}</Badge>
              </TableCell>
              <TableCell className="text-right">
              <Button variant="ghost" size="sm" asChild>
              <span>Freeze</span>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/roles/users/${user.id}`}>Edit</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

