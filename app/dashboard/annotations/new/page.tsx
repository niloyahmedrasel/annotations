"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const annotationFormSchema = z.object({
  text: z.string().min(10, {
    message: "Annotation text must be at least 10 characters.",
  }),
  book: z.string().min(2, {
    message: "Book title must be at least 2 characters.",
  }),
  chapter: z.string().min(2, {
    message: "Chapter must be at least 2 characters.",
  }),
  tags: z.string().min(2, {
    message: "Please provide at least one tag.",
  }),
  reference: z.string().optional(),
})

export default function NewAnnotationPage() {
  const form = useForm<z.infer<typeof annotationFormSchema>>({
    resolver: zodResolver(annotationFormSchema),
    defaultValues: {
      text: "",
      book: "",
      chapter: "",
      tags: "",
      reference: "",
    },
  })

  function onSubmit(values: z.infer<typeof annotationFormSchema>) {
    console.log(values)
    // Here you would typically send this data to your backend
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Annotation</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annotation Text</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter the annotation text" className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="book"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Book</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a book" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sahih-al-bukhari">Sahih Al-Bukhari</SelectItem>
                    <SelectItem value="quran">Quran</SelectItem>
                    <SelectItem value="fiqh-of-worship">Fiqh of Worship</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="chapter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chapter</FormLabel>
                <FormControl>
                  <Input placeholder="Enter chapter or section" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input placeholder="Enter tags (comma-separated)" {...field} />
                </FormControl>
                <FormDescription>Add relevant tags to help with categorization and search.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference</FormLabel>
                <FormControl>
                  <Input placeholder="Enter reference (optional)" {...field} />
                </FormControl>
                <FormDescription>Add any additional reference information if applicable.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit Annotation</Button>
        </form>
      </Form>
    </div>
  )
}

