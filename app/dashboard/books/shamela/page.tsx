"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Search } from "lucide-react"

interface Document {
  fileName: string;
}
export default function ShamelaPage() {
  const [bookNumber, setBookNumber] = useState("")
  const [startPage, setStartPage] = useState("")
  const [endPage, setEndPage] = useState("")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([]);

  const handleScrap = async () => {
    setLoading(true)
    const requestData = {
      baseUrl: "https://shamela.ws/book/{bookNumber}/{pageNumber}#p1",
      bookNumber,
      startPage,
      endPage,
    }

    try {
      const response = await fetch("https://lkp.pathok.com.bd/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      })
      
      if (!response.ok) throw new Error("Failed to scrape")
      const data = await response.json()
    } catch (error) {
      console.error("Error scraping:", error)
    }
    setLoading(false)
  }

  const handleViewDocument = async (fileName: string) => {
    const editorUrl = `https://test.pathok.com.bd/editor?fileName=${encodeURIComponent(fileName)}&mode=edit`;
    window.open(editorUrl, "_blank"); 
  }

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://lkp.pathok.com.bd/api/scraped-documents");
        if (!response.ok) throw new Error("Failed to fetch history");
        const data = await response.json();
        console.log(data)
        setData(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, [])

  return (
    <div className="container mx-auto py-10 grid grid-cols-2 gap-8">
      {/* Scraping Form */}
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Scrap Book from Shamela</CardTitle>
          <CardDescription>Enter book details to start scraping</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
 
          <div>
            <Input
              type="text"
              value="https://shamela.ws/book/{bookNumber}/{pageNumber}#p1" // This is the base URL and it is unchangeable
              disabled // Makes the input field uneditable
              className="w-full"
            />
          </div>

          {/* Other Input Fields */}
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Book Number (19188)"
              value={bookNumber}
              onChange={(e) => setBookNumber(e.target.value)}
              className="w-1/3"
              defaultValue="19188" // Set default book number to 19188
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
          <Button onClick={handleScrap} disabled={loading} className="flex-1">
            {loading ? "Loading..." : <><Search className="w-4 h-4 mr-2" /> Scrap Book</>}
          </Button>
        </CardFooter>
      </Card>

      {/* Document History */}
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Document History</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-gray-500">No documents scraped yet.</p>
          ) : (
            <ul className="space-y-2">
              {data.map((document: Document, index) => (
                <div>
                  <li key={index} className="flex items-center mt-5 space-x-2">{document.fileName}</li>
                  <Button onClick={() => handleViewDocument(document.fileName)}>View Document</Button>
                </div>
                
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
