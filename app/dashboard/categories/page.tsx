import Link from "next/link"
import { Button } from "@/components/ui/button"

const categories = [
  { title: "Book Categories", href: "/dashboard/categories/books" },
  { title: "Book Types", href: "/dashboard/categories/book-type" },
  { title: "Editors", href: "/dashboard/categories/editors" },
  { title: "Publishers", href: "/dashboard/categories/publishers" },
  { title: "Authors", href: "/dashboard/categories/authors" },
  { title: "Tags", href: "/dashboard/categories/tags" },
]

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Categories Management</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Button key={category.href} asChild variant="outline" className="h-32 text-lg">
            <Link href={category.href}>{category.title}</Link>
          </Button>
        ))}
      </div>
    </div>
  )
}

