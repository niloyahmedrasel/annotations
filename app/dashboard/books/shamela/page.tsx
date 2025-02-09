"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Search } from "lucide-react"

export default function ShamelaPage() {
  const [url, setUrl] = useState("")

  const handleScrap = () => {
    // Implement scraping logic here
    console.log("Scraping URL:", url)
    // You would typically send this to your backend for processing
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Shamela Book Scraper</h1>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Scrap Book from Shamela</CardTitle>
          <CardDescription>Enter the Shamela URL of the book you want to scrap</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
        <CardFooter>
          <Button onClick={handleScrap} className="w-full" disabled={!url}>
            <Search className="w-4 h-4 mr-2" />
            Scrap Book
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

