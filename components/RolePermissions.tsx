"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Permission {
  id: string
  category: string
  action: string
}

interface PermissionState {
  [key: string]: {
    [key: string]: boolean
  }
}

const initialPermissions: Permission[] = [
  { id: "1", category: "Library management", action: "Upload books" },
  { id: "2", category: "Library management", action: "Edit book metadata" },
  { id: "3", category: "Library management", action: "Make available for annotation" },
  { id: "4", category: "Library management", action: "Remove from annotation" },
  { id: "5", category: "Library management", action: "Apply OCR" },
  { id: "6", category: "Library management", action: "Scrap from Shamela" },
  { id: "7", category: "Library management", action: "Format doc" },


  { id: "8", category: "Doc management", action: "Read only" },
  { id: "9", category: "Doc management", action: "Edit doc" },
  { id: "10", category: "Doc management", action: "Review doc" },

 
  { id: "11", category: "Annotation management", action: "Create issue" },
  { id: "12", category: "Annotation management", action: "Edit his issues" },
  { id: "13", category: "Annotation management", action: "Create annotation" },
  { id: "14", category: "Annotation management", action: "Edit his annotations" },


  { id: "15", category: "User management", action: "Create user" },
  { id: "16", category: "User management", action: "Edit/delete user" },
  { id: "17", category: "User management", action: "Create group" },
  { id: "18", category: "User management", action: "Edit/delete group" },
  { id: "19", category: "User management", action: "Freeze/Unfreeze users" },
  { id: "20", category: "User management", action: "Reset password" },
  { id: "21", category: "User management", action: "Assign role and permission" },

  { id: "22", category: "Scoring management", action: "View user activity summary" },
  { id: "23", category: "Scoring management", action: "Make/modify scoring criteria" },
  { id: "24", category: "Scoring management", action: "Review scoring for users" },
]

const roles = ["Admin", "Doc Organizer", "Annotator", "Reviewer"]
const categories = [
  "Library management",
  "Doc management",
  "Annotation management",
  "User management",
  "Scoring management",
]

const RolePermissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions)
  const [permissionState, setPermissionState] = useState<PermissionState>({})
  const [newPermission, setNewPermission] = useState({ category: "", action: "" })

  const handlePermissionChange = (permissionId: string, role: string) => {
    setPermissionState((prevState) => ({
      ...prevState,
      [permissionId]: {
        ...prevState[permissionId],
        [role]: !prevState[permissionId]?.[role],
      },
    }))
  }

  const addNewPermission = () => {
    if (newPermission.category && newPermission.action) {
      const newId = (permissions.length + 1).toString()
      setPermissions([...permissions, { id: newId, ...newPermission }])
      setNewPermission({ category: "", action: "" })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <Select
          value={newPermission.category}
          onValueChange={(value) => setNewPermission({ ...newPermission, category: value })}
        >
        <SelectTrigger className="w-[200px]">
            {newPermission.category ? (
                <SelectValue>{newPermission.category}</SelectValue>
            ) : (
                <span className="text-gray-400">Select category</span>
            )}
        </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Action"
          value={newPermission.action}
          onChange={(e) => setNewPermission({ ...newPermission, action: e.target.value })}
          className="flex-1"
        />
        <Button onClick={addNewPermission} className="whitespace-nowrap">
          <Plus className="mr-2 h-4 w-4" /> Add New Permission
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Category</TableHead>
              <TableHead className="w-[300px]">Action</TableHead>
              {roles.map((role) => (
                <TableHead key={role}>{role}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell>{permission.category}</TableCell>
                <TableCell>{permission.action}</TableCell>
                {roles.map((role) => (
                  <TableCell key={`${permission.id}-${role}`}>
                    <Checkbox
                      checked={permissionState[permission.id]?.[role] || false}
                      onCheckedChange={() => handlePermissionChange(permission.id, role)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default RolePermissions

