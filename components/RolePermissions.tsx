"use client"

import React, { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, ChevronRight, ChevronDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-toastify"

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

const roleMappings: { [key: string]: string } = {
  superAdmin: "Super Admin",
  docOrganizer: "Doc Organizer",
  annotator: "Annotator",
  reviewer: "Reviewer"
}

const roles = Object.values(roleMappings)

const RolePermissions = () => {
  const [permissions, setPermissions] = useState<Category[]>([])
  const [permissionState, setPermissionState] = useState<PermissionState>({})
  const [newPermission, setNewPermission] = useState({ category: "", action: "" })
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [groupName, setGroupName] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const handlePermissionChange = async (actionId: string, roleDisplayName: string) => {
    try {
      const user = sessionStorage.getItem("user")
      const userId = user ? JSON.parse(user).id : null
      const token = user ? JSON.parse(user).token : null
      if (!token) {
        console.error("No token found!")
        return
      }
  
      const isChecked = !permissionState[actionId]?.[roleDisplayName]
  
      setPermissionState(prev => ({
        ...prev,
        [actionId]: {
          ...prev[actionId],
          [roleDisplayName]: isChecked
        }
      }))
  
      const endpoint = isChecked
        ? `https://lkp.pathok.com.bd/api/user/grant-permission/${userId}`
        : `https://lkp.pathok.com.bd/api/user/remove-permission/${userId}`
  
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: roleDisplayName, 
          permissionId: actionId,
        }),
      })
  
      if (!response.ok) throw new Error(`Failed to ${isChecked ? "grant" : "revoke"} permission`)
      
      console.log(`Permission ${isChecked ? "granted" : "revoked"} successfully`)
    } catch (error) {
      setPermissionState(prev => ({
        ...prev,
        [actionId]: {
          ...prev[actionId],
          [roleDisplayName]: !prev[actionId]?.[roleDisplayName]
        }
      }))
      toast.error(`Failed to update permission: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  

  useEffect(() => {
    const fetchPermissions = async () => {
      const user = sessionStorage.getItem("user")
      const token = user ? JSON.parse(user).token : null
      if (!token) {
        console.log("No user token found")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("https://lkp.pathok.com.bd/api/permission", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error("Failed to fetch permissions")

        const data = await response.json()
        const transformedData = data.permissions.map((permission: any) => ({
          name: permission.category,
          actions: permission.action.map((action: any) => ({
            id: action._id,
            name: action.name,
          })),
        }))
        setPermissions(transformedData)
        return transformedData
      } catch (error) {
        console.error("Error fetching permissions:", error)
        toast.error("Failed to load permissions")
        return []
      }
    }

    const fetchUserPermissions = async () => {
      const user = sessionStorage.getItem("user")
      const token = user ? JSON.parse(user).token : null

      if (!token) {
        console.log("No user token found")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`https://lkp.pathok.com.bd/api/permission/get-permissions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error("Failed to fetch user permissions")

        const data = await response.json()
        const newPermissionState: PermissionState = {}

        Object.entries(data.permissions).forEach(([apiRole, permissionIds]) => {
          const displayRole = roleMappings[apiRole]
          if (!displayRole) return

          (permissionIds as string[]).forEach(permissionId => {
            if (!newPermissionState[permissionId]) {
              newPermissionState[permissionId] = {}
            }
            newPermissionState[permissionId][displayRole] = true
          })
        })

        setPermissionState(newPermissionState)
      } catch (error) {
        console.error("Error fetching user permissions:", error)
        toast.error("Failed to load user permissions")
      }
    }

    const fetchData = async () => {
      setIsLoading(true)
      try {
        await fetchPermissions()
        await fetchUserPermissions()
      } catch (error) {
        console.error("Error fetching data:", error)
      }
      setIsLoading(false)
    }

    fetchData()
  }, [])

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName) ? prev.filter(name => name !== categoryName) : [...prev, categoryName]
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
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
            {permissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2 + roles.length} className="text-center py-8">
                  No permissions found. Add a new permission to get started.
                </TableCell>
              </TableRow>
            ) : (
              permissions.map((category) => (
                <React.Fragment key={category.name}>
                  <TableRow
                    className="cursor-pointer hover:bg-gray-500"
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
                              checked={!!permissionState[action.id]?.[role]}
                              onCheckedChange={() => handlePermissionChange(action.id, role)}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default RolePermissions