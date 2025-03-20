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

const roles = ["Super Admin", "Doc Organizer", "Annotator", "Reviewer"]

const RolePermissions = () => {
  const [permissions, setPermissions] = useState<Category[]>([])
  const [permissionState, setPermissionState] = useState<PermissionState>({})
  const [newPermission, setNewPermission] = useState({ category: "", action: "" })
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [groupName, setGroupName] = useState("")

  const handlePermissionChange = async (actionId: string, role: string) => {
    try {
      const user = sessionStorage.getItem("user"); 
      const userId = user ? JSON.parse(user).id : null;
      const token = user ? JSON.parse(user).token : null;
      if (!token) {
        console.error("No token found!");
        return;
      }
  
      const isChecked = !permissionState[actionId]?.[role];
  
      setPermissionState((prevState) => ({
        ...prevState,
        [actionId]: {
          ...prevState[actionId],
          [role]: isChecked,
        },
      }));
  
      const endpoint = isChecked
        ? `https://lkp.pathok.com.bd/api/user/grant-permission/${userId}` 
        : `https://lkp.pathok.com.bd/api/user/remove-permission/${userId}`; 
  
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: role,
          permissionId: actionId,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to ${isChecked ? "grant" : "revoke"} permission`);
      }
  
      console.log(`Permission ${isChecked ? "granted" : "revoked"} successfully`);
    } catch (error) {
      setPermissionState((prevState) => ({
        ...prevState,
        [actionId]: {
          ...prevState[actionId],
          [role]: !prevState[actionId]?.[role],
        },
      }));
    }
  };

  const addNewGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Group name cannot be empty!")
      return
    }

    try {
      const user = JSON.parse(sessionStorage.getItem("user") || "{}")
      const token = user.token

      const response = await fetch("https://lkp.pathok.com.bd/api/permission/create-permission-group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category: groupName }),
      })

      if (!response.ok) {
        throw new Error("Failed to create group")
      }

      toast.success("Group created successfully!")
      setGroupName("") 
    } catch (error:any) {
      toast.error(error.message || "Something went wrong")
    }
  }


  useEffect(() => {
    const fetchPermissions = async () => {
      const user = sessionStorage.getItem("user") 
      const token = user ? JSON.parse(user).token : null
      if (!token) {
        console.error("No token found!")
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

        if (!response.ok) {
          throw new Error("Failed to fetch permissions")
        }

        const data = await response.json()
        const transformedData = data.permissions.map((permission: any) => ({
          name: permission.category,
          actions: permission.action.map((action: any) => ({
            id: action._id,
            name: action.name,
          })),
        }))
        setPermissions(transformedData)
      } catch (error) {
        console.error("Error fetching permissions:", error)
      }
    }

    fetchPermissions()
  }, [])

  const addNewPermission = async () => {
    if (!newPermission.category || !newPermission.action) {
      console.error("Category and action are required");
      return;
    }
    
    const user = sessionStorage.getItem("user");
    const token = user ? JSON.parse(user).token : null;
    
    if (!token) {
      console.error("No token found!");
      return;
    }
  
    const requestData = {
      categoryName: newPermission.category,
      action: [{ name: newPermission.action }],
    };
  
    try {
      const response = await fetch("https://lkp.pathok.com.bd/api/permission/add-action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add permission");
      }
  
      const data = await response.json();
      console.log("Permission added:", data);
  
      setPermissions((prevPermissions) => {
        const categoryIndex = prevPermissions.findIndex((cat) => cat.name === data.categoryName);
        if (categoryIndex !== -1) {
          const updatedPermissions = [...prevPermissions];
          updatedPermissions[categoryIndex].actions.push(...(data.action ?? []));
          return updatedPermissions;
        }
        return [...prevPermissions, { name: data.categoryName, actions: data.action ?? [] }];
      });      
  
      setNewPermission({ category: "", action: "" });
    } catch (error) {
      console.error("Error adding permission:", error);
    }
  };
  
  

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName) ? prev.filter((name) => name !== categoryName) : [...prev, categoryName],
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex">
      <Input
        placeholder="Create New Group"
        className="w-1/3 mb-5 mr-2"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <Button onClick={addNewGroup} className="whitespace-nowrap">
        <Plus className="mr-2" /> Add New Group
      </Button>
    </div>
      
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <Select
          value={newPermission.category}
          onValueChange={(value) => setNewPermission({ ...newPermission, category: value })}
        >
          <SelectTrigger className="w-[200px]">
            {newPermission.category ? (
              <SelectValue>{newPermission.category}</SelectValue>
            ) : (
              <span className="text-gray-400">Select Group</span>
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
                    (category.actions ?? []).map((action) => (
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