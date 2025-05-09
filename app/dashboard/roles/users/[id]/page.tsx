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
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"


const userFormSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string().min(6, { message: "Confirm Password must be at least 6 characters." }),
    role: z.string({ required_error: "Please select a role." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  })

export default function UserForm({ params }: { params: { id: string } }) {
  const router = useRouter()
  const isNewUser = params.id === "new"
  const [loading, setLoading] = useState(false)
  const [formKey, setFormKey] = useState(Date.now()) 

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

  const {t, i18n} = useTranslation()
  const isRTL = i18n.language === "ar"

  
  useEffect(() => {
    setFormKey(Date.now())

    if (isNewUser) {
      form.reset({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      })
    } else {
      setLoading(true)
      fetch(`https://lkp.pathok.com.bd/api/user/${params.id}`, {
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

    const url = isNewUser ? "https://lkp.pathok.com.bd/api/user" : `https://lkp.pathok.com.bd/api/user/${params.id}`

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
      toast.success(isNewUser ? t("User added successfully!"): t("User updated successfully!"))
      router.push("/dashboard/roles/users")
    } else {
      toast.error(t("Something went wrong. Please try again."))
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{isNewUser ? t("Add New User") : t("Edit User")}</h1>
      {loading ? (
        <p>{t("Loading user data...")}</p>
      ) : (
        <Form {...form} key={formKey}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" autoComplete="off">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("Enter user's name")} {...field} autoComplete="off" />
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
                  <FormLabel>{t("Email")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("Enter user's email")} {...field} autoComplete="off" />
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
                  <FormLabel>{t("Password")}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={t("Enter password")} {...field} autoComplete="new-password" />
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
                  <FormLabel>{t("Confirm Password")}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={t("Confirm password")} {...field} autoComplete="new-password" />
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
                  <FormLabel>{t("Role")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select a role")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Super Admin">{t("Super Admin")}</SelectItem>
                      <SelectItem value="Doc Organizer">{t("Doc Organizer")}</SelectItem>
                      <SelectItem value="Annotator">{t("Annotator")}</SelectItem>
                      <SelectItem value="Reviewer">{t("Reviewer")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{isNewUser ? t("Create User") : t("Update User")}</Button>
          </form>
        </Form>
      )}
    </div>
  )
}
