"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const scholars = [
  { id: "1", name: "Dr. Ahmad Ali" },
  { id: "2", name: "Shaikh Muhammad Ibrahim" },
  { id: "3", name: "Dr. Fatima Hassan" },
]

const books = [
  { id: "b1", title: "Principles of Islamic Jurisprudence" },
  { id: "b2", title: "Compilation of Authentic Hadiths" },
  { id: "b3", title: "Quranic Exegesis: A Modern Approach" },
]

const fatwas = [
  { id: "f1", title: "Ruling on Digital Currencies" },
  { id: "f2", title: "Fasting During Long Summer Days" },
  { id: "f3", title: "Islamic Perspective on Organ Donation" },
]

const linkFormSchema = z.object({
  scholarId: z.string({
    required_error: "Please select a scholar.",
  }),
  linkType: z.enum(["book", "fatwa"], {
    required_error: "Please select a link type.",
  }),
  itemId: z.string({
    required_error: "Please select an item to link.",
  }),
})

export default function AddLinkPage() {
  const router = useRouter()
  const [linkType, setLinkType] = useState<"book" | "fatwa">("book")

  const form = useForm<z.infer<typeof linkFormSchema>>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: {
      scholarId: "",
      linkType: "book",
      itemId: "",
    },
  })

  function onSubmit(values: z.infer<typeof linkFormSchema>) {
    console.log(values)
    router.push("/dashboard/scholars/links")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add New Scholar Link</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="scholarId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scholar</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a scholar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {scholars.map((scholar) => (
                      <SelectItem key={scholar.id} value={scholar.id}>
                        {scholar.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="linkType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link Type</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    setLinkType(value as "book" | "fatwa")
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select link type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="book">Book</SelectItem>
                    <SelectItem value="fatwa">Fatwa</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="itemId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{linkType === "book" ? "Book" : "Fatwa"}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select a ${linkType}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(linkType === "book" ? books : fatwas).map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Add Link</Button>
        </form>
      </Form>
    </div>
  )
}

