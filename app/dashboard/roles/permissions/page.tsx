"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Permission {
  id: string
  name: string
}

interface Role {
  id: string
  name: string
  permissions: string[]
}

const permissions: Permission[] = [
  { id: "manage_books", name: "Manage Books" },
  { id: "manage_annotations", name: "Manage Annotations" },
  { id: "manage_fatwas", name: "Manage Fatwas" },
  { id: "manage_users", name: "Manage Users" },
]

const initialRoles: Role[] = [
  { id: "book_organizer", name: "Book Organizer", permissions: ["manage_books"] },
  { id: "annotator", name: "Annotator", permissions: ["manage_annotations"] },
  { id: "reviewer", name: "Reviewer", permissions: ["manage_books", "manage_annotations", "manage_fatwas"] },
]

export default function PermissionsPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles)

  const togglePermission = (roleId: string, permissionId: string) => {
    setRoles(
      roles.map((role) => {
        if (role.id === roleId) {
          const updatedPermissions = role.permissions.includes(permissionId)
            ? role.permissions.filter((p) => p !== permissionId)
            : [...role.permissions, permissionId]
          return { ...role, permissions: updatedPermissions }
        }
        return role
      }),
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Permissions Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role / Permission</TableHead>
            {permissions.map((permission) => (
              <TableHead key={permission.id}>{permission.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="font-medium">{role.name}</TableCell>
              {permissions.map((permission) => (
                <TableCell key={permission.id}>
                  <Checkbox
                    checked={role.permissions.includes(permission.id)}
                    onCheckedChange={() => togglePermission(role.id, permission.id)}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button>Save Changes</Button>
    </div>
  )
}

