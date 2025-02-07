"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const scholarFormSchema = z.object({
  name: z.string().min(2, {
    message: "Scholar name must be at least 2 characters.",
  }),
  specialization: z.string().min(2, {
    message: "Specialization must be at least 2 characters.",
  }),
  biography: z.string().min(50, {
    message: "Biography must be at least 50 characters.",
  }),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
})

export default function AddScholarPage() {
  const form = useForm<z.infer<typeof scholarFormSchema>>({
    resolver: zodResolver(scholarFormSchema),
    defaultValues: {
      name: "",
      specialization: "",
      biography: "",
      website: "",
    },
  })

  function onSubmit(values: z.infer<typeof scholarFormSchema>) {
    console.log(values)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add New Scholar</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scholar Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter scholar's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialization</FormLabel>
                <FormControl>
                  <Input placeholder="Enter scholar's specialization" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="biography"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biography</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter scholar's biography" className="min-h-[150px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="Enter scholar's website (optional)" {...field} />
                </FormControl>
                <FormDescription>If the scholar has a personal website, enter the URL here.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Add Scholar</Button>
        </form>
      </Form>
    </div>
  )
}

