"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Search, Eye } from "lucide-react"

export default function ShamelaPage() {
  const [bookNumber, setBookNumber] = useState("")
  const [startPage, setStartPage] = useState("")
  const [endPage, setEndPage] = useState("")

  const baseUrl = "https://shamela.ws/book/{bookNumber}/{pageNumber}#p1";  // Fixed base URL

  const handleScrap = async () => {
    const requestBody = {
      baseUrl: baseUrl,
      bookNumber: bookNumber,
      startPage: startPage,
      endPage: endPage
    }

    try {
      // Make a POST request to the backend
      const response = await fetch("http://localhost:5000/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

      if (response.ok) {
        console.log("Scraping result:", data)
        // Handle the successful response here, e.g., show a success message
      } else {
        console.error("Error scraping book:", data)
        // Handle the error case here, e.g., show an error message
      }
    } catch (error) {
      console.error("Error during API request:", error)
      // Handle the network error here
    }
  }

  const handleViewDoc = () => {
    console.log("Viewing document")
    // This could open a new tab or modal with the document preview
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Shamela Book Scraper</h1>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Scrap Book from Shamela</CardTitle>
          <CardDescription>Enter the book number and the start/end page for scraping</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Fixed base URL input */}
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-gray-400" />
            <Input
              type="text"
              value={baseUrl}
              readOnly
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
          <Button onClick={handleScrap} disabled={!bookNumber || !startPage || !endPage} className="flex-1 mr-2">
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
