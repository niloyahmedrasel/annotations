'use client'

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { X, Plus, Trash2 } from "lucide-react"
import { useSearchParams } from "next/navigation"

const categories = ["Category 1", "Category 2", "Category 3"]
const subCategories = ["Sub-Category 1", "Sub-Category 2", "Sub-Category 3"]
const tags = ["Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5"]
const judgments = ["Judgment 1", "Judgment 2", "Judgment 3"]
const scholars = ["Scholar 1", "Scholar 2", "Scholar 3"]

interface Proof {
  description: string
  source: string
}

interface Scholar {
  name: string
  selectedFromDb: string
  proofs: Proof[]
}

const NewAnnotationForm: React.FC = () => {
  const searchParams = useSearchParams()
  const fatwaId = searchParams.get("fatwaId")

  const [title, setTitle] = useState("")
  const [issueDescription, setIssueDescription] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [rulingDescription, setRulingDescription] = useState("")
  const [judgment, setJudgment] = useState("")
  const [scholarList, setScholarList] = useState<Scholar[]>([
    { name: "", selectedFromDb: "", proofs: [{ description: "", source: "" }] },
  ])

  const issueDescriptionRef = useRef<HTMLTextAreaElement>(null)

  const handleIssueDescriptionPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData("text")
    setIssueDescription(pastedText)
  }

  const handleRemoveItem = (item: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => prev.filter((i) => i !== item))
  }

  const handleAddScholar = () => {
    setScholarList([...scholarList, { name: "", selectedFromDb: "", proofs: [{ description: "", source: "" }] }])
  }

  const handleRemoveScholar = (index: number) => {
    setScholarList(scholarList.filter((_, i) => i !== index))
  }

  const handleScholarChange = (index: number, field: keyof Scholar, value: string) => {
    const updatedScholars = [...scholarList]
    updatedScholars[index] = { ...updatedScholars[index], [field]: value }
    setScholarList(updatedScholars)
  }

  const handleAddProof = (scholarIndex: number) => {
    const updatedScholars = [...scholarList]
    updatedScholars[scholarIndex].proofs.push({ description: "", source: "" })
    setScholarList(updatedScholars)
  }

  const handleRemoveProof = (scholarIndex: number, proofIndex: number) => {
    const updatedScholars = [...scholarList]
    updatedScholars[scholarIndex].proofs = updatedScholars[scholarIndex].proofs.filter((_, i) => i !== proofIndex)
    setScholarList(updatedScholars)
  }

  const handleProofChange = (scholarIndex: number, proofIndex: number, field: keyof Proof, value: string) => {
    const updatedScholars = [...scholarList]
    updatedScholars[scholarIndex].proofs[proofIndex][field] = value
    setScholarList(updatedScholars)
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Left side: PDF Viewer */}
      <div className="w-1/2 sticky top-0 h-screen overflow-y-auto p-4">
        <Card className="h-full bg-gray-800 border-gray-700">
          <CardContent className="flex items-center justify-center h-full">
            <p className="text-gray-400">PDF Viewer Placeholder</p>
          </CardContent>
        </Card>
      </div>

      {/* Right side: Annotation Form */}
      <div className="w-1/2 p-6 overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6">
          {fatwaId ? `Create New Annotation for Fatwa #${fatwaId}` : "Create New Annotation"}
        </h2>

        <div className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 bg-gray-700 border-gray-600"
              />
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <Label htmlFor="issueDescription">Issue Description (Paste Only)</Label>
              <Textarea
                id="issueDescription"
                ref={issueDescriptionRef}
                value={issueDescription}
                onPaste={handleIssueDescriptionPaste}
                readOnly
                className="mt-1 bg-gray-700 border-gray-600"
              />
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <Label htmlFor="categories">Categories</Label>
              <MultiSelect
                options={categories}
                selected={selectedCategories}
                onChange={setSelectedCategories}
                placeholder="Select categories"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedCategories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0"
                      onClick={() => handleRemoveItem(category, setSelectedCategories)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <Label htmlFor="subCategories">Sub-Categories</Label>
              <MultiSelect
                options={subCategories}
                selected={selectedSubCategories}
                onChange={setSelectedSubCategories}
                placeholder="Select sub-categories"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedSubCategories.map((subCategory) => (
                  <Badge key={subCategory} variant="secondary">
                    {subCategory}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0"
                      onClick={() => handleRemoveItem(subCategory, setSelectedSubCategories)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <Label htmlFor="tags">Tags</Label>
              <MultiSelect
                options={tags}
                selected={selectedTags}
                onChange={setSelectedTags}
                placeholder="Select tags"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0"
                      onClick={() => handleRemoveItem(tag, setSelectedTags)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <Label htmlFor="rulingDescription">Ruling Description</Label>
              <Textarea
                id="rulingDescription"
                value={rulingDescription}
                onChange={(e) => setRulingDescription(e.target.value)}
                className="mt-1 bg-gray-700 border-gray-600"
              />
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <Label htmlFor="judgment">Judgment</Label>
              <Select value={judgment} onValueChange={setJudgment}>
                <SelectTrigger className="mt-1 bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select judgment" />
                </SelectTrigger>
                <SelectContent>
                  {judgments.map((j) => (
                    <SelectItem key={j} value={j}>
                      {j}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <Label>Scholars and Proofs</Label>
                <Button onClick={handleAddScholar} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" /> Add Scholar
                </Button>
              </div>
              {scholarList.map((scholar, scholarIndex) => (
                <div key={scholarIndex} className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Input
                      placeholder="Scholar Name"
                      value={scholar.name}
                      onChange={(e) => handleScholarChange(scholarIndex, "name", e.target.value)}
                      className="bg-gray-700 border-gray-600"
                    />
                    {scholarIndex > 0 && (
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveScholar(scholarIndex)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Select
                    value={scholar.selectedFromDb}
                    onValueChange={(value) => handleScholarChange(scholarIndex, "selectedFromDb", value)}
                  >
                    <SelectTrigger className="mb-2 bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Select scholar from database" />
                    </SelectTrigger>
                    <SelectContent>
                      {scholars.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="ml-4 mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <Label>Proofs</Label>
                      <Button onClick={() => handleAddProof(scholarIndex)} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1" /> Add Proof
                      </Button>
                    </div>
                    {scholar.proofs.map((proof, proofIndex) => (
                      <div key={proofIndex} className="mb-4">
                        <Textarea
                          placeholder="Proof Description"
                          value={proof.description}
                          onChange={(e) => handleProofChange(scholarIndex, proofIndex, "description", e.target.value)}
                          className="mb-2 bg-gray-700 border-gray-600"
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Source of Proof"
                            value={proof.source}
                            onChange={(e) => handleProofChange(scholarIndex, proofIndex, "source", e.target.value)}
                            className="bg-gray-700 border-gray-600"
                          />
                          {proofIndex > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveProof(scholarIndex, proofIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        {proofIndex < scholar.proofs.length - 1 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                  {scholarIndex < scholarList.length - 1 && <Separator className="my-6" />}
                </div>
              ))}
            </CardContent>
          </Card>

          <Button type="submit" className="w-full">
            Submit Annotation
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NewAnnotationForm

