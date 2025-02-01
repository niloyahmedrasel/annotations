"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const fatwaFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  scholar: z.string().min(2, {
    message: "Scholar name must be at least 2 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  question: z.string().min(10, {
    message: "Question must be at least 10 characters.",
  }),
  answer: z.string().min(20, {
    message: "Answer must be at least 20 characters.",
  }),
  references: z.string().optional(),
  tags: z.string().optional(),
})

export default function NewFatwaPage() {
  const form = useForm<z.infer<typeof fatwaFormSchema>>({
    resolver: zodResolver(fatwaFormSchema),
    defaultValues: {
      title: "",
      scholar: "",
      category: "",
      question: "",
      answer: "",
      references: "",
      tags: "",
    },
  })

  function onSubmit(values: z.infer<typeof fatwaFormSchema>) {
    console.log(values)
    // Here you would typically send this data to your backend
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Fatwa</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter fatwa title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="scholar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scholar</FormLabel>
                <FormControl>
                  <Input placeholder="Enter scholar name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="worship">Worship</SelectItem>
                    <SelectItem value="financial-transactions">Financial Transactions</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="medical-ethics">Medical Ethics</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter the question" className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Answer</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter the fatwa answer" className="min-h-[200px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="references"
            render={({ field }) => (
              <FormItem>
                <FormLabel>References</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter any references" className="min-h-[100px]" {...field} />
                </FormControl>
                <FormDescription>Include any Quranic verses, Hadiths, or scholarly works referenced.</FormDescription>
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
          <Button type="submit">Submit Fatwa</Button>
        </form>
      </Form>
    </div>
  )
}

