"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-toastify"

const userFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Confirm Password must be at least 6 characters." }),
  role: z.string({ required_error: "Please select a role." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
})

export default function UserForm({ params }: { params: { id: string } }) {
  const isNewUser = params.id === "new"
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
  })

  useEffect(() => {
    if (isNewUser) {
      // Reset form with empty values when creating a new user
      form.reset({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      })
    } else {
      // Fetch user data when editing
      setLoading(true)
      fetch(`https://lkp.pathok.com.bd/api/user/${params.id}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("user") || "{}").token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(" data of the user", data)
          form.reset({
            name: data.user.name || "",
            email: data.user.email || "",
            password: "",
            confirmPassword: "",
            role: data.user.role || "",
          })
        })
        .catch(() => toast.error("Failed to load user data"))
        .finally(() => setLoading(false))
    }
  }, [isNewUser, params.id, form])

  async function onSubmit(values: z.infer<typeof userFormSchema>) {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}")
    const token = user.token

    const url = isNewUser
      ? "https://lkp.pathok.com.bd/api/user"
      : `https://lkp.pathok.com.bd/api/user/${params.id}`

    const method = isNewUser ? "POST" : "PUT"

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    })

    if (response.ok) {
      toast.success(isNewUser ? "User created successfully!" : "User updated successfully!")
    } else {
      toast.error("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{isNewUser ? "Add New User" : "Edit User"}</h1>
      {loading ? <p>Loading user data...</p> : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter user's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter user's email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Super Admin">Super Admin</SelectItem>
                      <SelectItem value="Doc Organizer">Doc Organizer</SelectItem>
                      <SelectItem value="Annotator">Annotator</SelectItem>
                      <SelectItem value="Reviewer">Reviewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{isNewUser ? "Create User" : "Update User"}</Button>
          </form>
        </Form>
      )}
    </div>
  )
}
