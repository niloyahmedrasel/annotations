"use client"

import React, { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, ChevronRight, ChevronDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Action {
  id: string
  name: string
}

interface Category {
  name: string
  actions: Action[]
}

interface PermissionState {
  [key: string]: {
    [key: string]: boolean
  }
}

const initialPermissions: Category[] = [
  {
    name: "Library management",
    actions: [
      { id: "1", name: "Upload books" },
      { id: "2", name: "Edit book metadata" },
      { id: "3", name: "Make available for annotation" },
      { id: "4", name: "Remove from annotation" },
      { id: "5", name: "Apply OCR" },
      { id: "6", name: "Scrap from Shamela" },
      { id: "7", name: "Format doc" },
    ],
  },
  {
    name: "Doc management",
    actions: [
      { id: "8", name: "Read only" },
      { id: "9", name: "Edit doc" },
      { id: "10", name: "Review doc" },
    ],
  },
  {
    name: "Annotation management",
    actions: [
      { id: "11", name: "Create issue" },
      { id: "12", name: "Edit his issues" },
      { id: "13", name: "Create annotation" },
      { id: "14", name: "Edit his annotations" },
    ],
  },
  {
    name: "User management",
    actions: [
      { id: "15", name: "Create user" },
      { id: "16", name: "Edit/delete user" },
      { id: "17", name: "Create group" },
      { id: "18", name: "Edit/delete group" },
      { id: "19", name: "Freeze/Unfreeze users" },
      { id: "20", name: "Reset password" },
      { id: "21", name: "Assign role and permission" },
    ],
  },
  {
    name: "Scoring management",
    actions: [
      { id: "22", name: "View user activity summary" },
      { id: "23", name: "Make/modify scoring criteria" },
      { id: "24", name: "Review scoring for users" },
    ],
  },
]

const roles = ["Admin", "Doc Organizer", "Annotator", "Reviewer"]

const RolePermissions = () => {
  const [permissions, setPermissions] = useState<Category[]>(initialPermissions)
  const [permissionState, setPermissionState] = useState<PermissionState>({})
  const [newPermission, setNewPermission] = useState({ category: "", action: "" })
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const handlePermissionChange = (actionId: string, role: string) => {
    setPermissionState((prevState) => ({
      ...prevState,
      [actionId]: {
        ...prevState[actionId],
        [role]: !prevState[actionId]?.[role],
      },
    }))
  }

  const addNewPermission = () => {
    if (newPermission.category && newPermission.action) {
      setPermissions((prevPermissions) => {
        const categoryIndex = prevPermissions.findIndex((cat) => cat.name === newPermission.category)
        if (categoryIndex !== -1) {
          const updatedCategory = {
            ...prevPermissions[categoryIndex],
            actions: [
              ...prevPermissions[categoryIndex].actions,
              { id: Date.now().toString(), name: newPermission.action },
            ],
          }
          return [
            ...prevPermissions.slice(0, categoryIndex),
            updatedCategory,
            ...prevPermissions.slice(categoryIndex + 1),
          ]
        } else {
          return [
            ...prevPermissions,
            {
              name: newPermission.category,
              actions: [{ id: Date.now().toString(), name: newPermission.action }],
            },
          ]
        }
      })
      setNewPermission({ category: "", action: "" })
    }
  }

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName) ? prev.filter((name) => name !== categoryName) : [...prev, categoryName],
    )
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
            {permissions.map((category) => (
              <SelectItem key={category.name} value={category.name}>
                {category.name}
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
            {permissions.map((category) => (
              <React.Fragment key={category.name}>
                <TableRow
                  className="cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => toggleCategory(category.name)}
                >
                  <TableCell colSpan={2 + roles.length} className="font-bold">
                    {expandedCategories.includes(category.name) ? (
                      <ChevronDown className="inline mr-2" />
                    ) : (
                      <ChevronRight className="inline mr-2" />
                    )}
                    {category.name}
                  </TableCell>
                </TableRow>
                {expandedCategories.includes(category.name) &&
                  category.actions.map((action) => (
                    <TableRow key={action.id}>
                      <TableCell></TableCell>
                      <TableCell>{action.name}</TableCell>
                      {roles.map((role) => (
                        <TableCell key={`${action.id}-${role}`}>
                          <Checkbox
                            checked={permissionState[action.id]?.[role] || false}
                            onCheckedChange={() => handlePermissionChange(action.id, role)}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default RolePermissions

