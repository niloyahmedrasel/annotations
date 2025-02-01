"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Trash2 } from "lucide-react"

interface Rule {
  id: string
  title: string
  description: string
}

const initialRules: Rule[] = [
  {
    id: "1",
    title: "Cite Sources",
    description:
      "Always provide references for annotations, including book name, chapter, and verse/hadith number if applicable.",
  },
  {
    id: "2",
    title: "Use Formal Language",
    description:
      "Annotations should be written in formal, academic language. Avoid colloquialisms and informal expressions.",
  },
  {
    id: "3",
    title: "Be Concise",
    description: "Keep annotations brief and to the point. Aim for clarity and conciseness in explanations.",
  },
]

export default function AnnotationRulesPage() {
  const [rules, setRules] = useState<Rule[]>(initialRules)
  const [newRule, setNewRule] = useState({ title: "", description: "" })

  const addRule = () => {
    if (newRule.title.trim() !== "" && newRule.description.trim() !== "") {
      setRules([
        ...rules,
        {
          id: Date.now().toString(),
          title: newRule.title,
          description: newRule.description,
        },
      ])
      setNewRule({ title: "", description: "" })
    }
  }

  const deleteRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Annotation Rules</h1>
      <div className="space-y-4">
        <Input
          placeholder="Rule title"
          value={newRule.title}
          onChange={(e) => setNewRule({ ...newRule, title: e.target.value })}
        />
        <Textarea
          placeholder="Rule description"
          value={newRule.description}
          onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
        />
        <Button onClick={addRule}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Rule
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell className="font-medium">{rule.title}</TableCell>
              <TableCell>{rule.description}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => deleteRule(rule.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

