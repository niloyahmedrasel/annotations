"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Search, Eye } from "lucide-react"

export default function ShamelaPage() {
  const [url, setUrl] = useState("")
  const [bookNumber, setBookNumber] = useState("")
  const [startPage, setStartPage] = useState("")
  const [endPage, setEndPage] = useState("")

  const handleScrap = () => {
    // Implement scraping logic here
    console.log("Scraping URL:", url)
    console.log("Book Number:", bookNumber)
    console.log("Start Page:", startPage)
    console.log("End Page:", endPage)
    // You would typically send this to your backend for processing
  }

  const handleViewDoc = () => {
    // Implement view document logic here
    console.log("Viewing document")
    // This could open a new tab or modal with the document preview
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Shamela Book Scraper</h1>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Scrap Book from Shamela</CardTitle>
          <CardDescription>Enter the Shamela URL and additional details of the book you want to scrap</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-gray-400" />
            <Input
              type="url"
              placeholder="https://shamela.ws/book/XXX"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Book Number"
              value={bookNumber}
              onChange={(e) => setBookNumber(e.target.value)}
              className="w-1/3"
            />
            <Input
              type="number"
              placeholder="Start Page"
              value={startPage}
              onChange={(e) => setStartPage(e.target.value)}
              className="w-1/3"
            />
            <Input
              type="number"
              placeholder="End Page"
              value={endPage}
              onChange={(e) => setEndPage(e.target.value)}
              className="w-1/3"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleScrap} disabled={!url} className="flex-1 mr-2">
            <Search className="w-4 h-4 mr-2" />
            Scrap Book
          </Button>
          <Button onClick={handleViewDoc} variant="outline" className="flex-1 ml-2">
            <Eye className="w-4 h-4 mr-2" />
            View Document
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

