"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, FolderOpen, File } from "lucide-react"

interface CategoryNode {
  id: string
  name: string
  children?: CategoryNode[]
}

const initialTaxonomy: CategoryNode[] = [
  {
    id: "1",
    name: "Islamic Jurisprudence",
    children: [
      {
        id: "3",
        name: "Fiqh of Worship",
        children: [
          { id: "5", name: "Prayer" },
          { id: "6", name: "Fasting" },
          { id: "7", name: "Zakat" },
        ],
      },
      {
        id: "4",
        name: "Fiqh of Transactions",
        children: [
          { id: "8", name: "Sales" },
          { id: "9", name: "Partnerships" },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Hadith Studies",
    children: [
      { id: "10", name: "Hadith Compilation" },
      { id: "11", name: "Hadith Authentication" },
    ],
  },
]

const CategoryTree: React.FC<{ categories: CategoryNode[]; level?: number }> = ({ categories, level = 0 }) => {
  return (
    <ul className={`pl-${level * 4}`}>
      {categories.map((category) => (
        <li key={category.id} className="py-1">
          <div className="flex items-center">
            {level > 0 && <ChevronRight className="mr-1 h-4 w-4" />}
            {category.children ? (
              <FolderOpen className="mr-2 h-4 w-4 text-yellow-500" />
            ) : (
              <File className="mr-2 h-4 w-4 text-blue-500" />
            )}
            <span>{category.name}</span>
          </div>
          {category.children && <CategoryTree categories={category.children} level={level + 1} />}
        </li>
      ))}
    </ul>
  )
}

export default function TaxonomyPage() {
  const [taxonomy, setTaxonomy] = useState<CategoryNode[]>(initialTaxonomy)
  const [newCategory, setNewCategory] = useState({ name: "", parentId: "" })

  const addCategory = () => {
    if (newCategory.name.trim() !== "") {
      const updatedTaxonomy = [...taxonomy]
      const newNode: CategoryNode = { id: Date.now().toString(), name: newCategory.name }

      if (newCategory.parentId) {
        const addToParent = (categories: CategoryNode[]): boolean => {
          for (const category of categories) {
            if (category.id === newCategory.parentId) {
              category.children = category.children ? [...category.children, newNode] : [newNode]
              return true
            }
            if (category.children && addToParent(category.children)) {
              return true
            }
          }
          return false
        }
        addToParent(updatedTaxonomy)
      } else {
        updatedTaxonomy.push(newNode)
      }

      setTaxonomy(updatedTaxonomy)
      setNewCategory({ name: "", parentId: "" })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Category Taxonomy</h1>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category-name">New Category Name</Label>
            <Input
              id="category-name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              placeholder="Enter new category name"
            />
          </div>
          <div>
            <Label htmlFor="parent-category">Parent Category ID (optional)</Label>
            <Input
              id="parent-category"
              value={newCategory.parentId}
              onChange={(e) => setNewCategory({ ...newCategory, parentId: e.target.value })}
              placeholder="Enter parent category ID"
            />
          </div>
        </div>
        <Button onClick={addCategory}>Add Category</Button>
      </div>
      <Separator />
      <div className="bg-gray-900 p-4 rounded-md">
        <CategoryTree categories={taxonomy} />
      </div>
    </div>
  )
}

