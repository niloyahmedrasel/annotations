"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Search } from "lucide-react"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"

interface Document {
  title: string;
}
export default function ShamelaPage() {
  const [bookNumber, setBookNumber] = useState("")
  const [startPage, setStartPage] = useState("")
  const [endPage, setEndPage] = useState("")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([]);

  const {t, i18n} = useTranslation()
  const handleScrap = async () => {
    setLoading(true)
    const requestData = {
      baseUrl: "https://shamela.ws/book/{bookNumber}/{pageNumber}#p1",
      bookNumber,
      startPage,
      endPage,
    }

    try {
      const user = sessionStorage.getItem("user")
      const token = user ? JSON.parse(user).token : null
      const response = await fetch("https://lkp.pathok.com.bd/api/scrape", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      
    } catch (error:any) {
      console.error("Error scraping:", error)
      toast.error(error.message)
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
        const user = sessionStorage.getItem("user")
        const token = user ? JSON.parse(user).token : null
        const response = await fetch("https://lkp.pathok.com.bd/api/scraped-documents",{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
       
        console.log(data)
        setData(data);
      } catch (error:any) {
        console.error("Error fetching history:", error);
        toast.error(error.message);
      }
    };

    fetchHistory();
  }, [])

  return (
    <div className="container mx-auto py-10 grid grid-cols-2 gap-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">{t("Scrap Book from Shamela")}</CardTitle>
          <CardDescription>{t("Enter book details to start scraping")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
 
          <div>
            <Input
              type="text"
              value="https://shamela.ws/book/{bookNumber}/{pageNumber}#p1" 
              disabled 
              className="w-full"
            />
          </div>

          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder={t("Book Number (19188)")}
              value={bookNumber}
              onChange={(e) => setBookNumber(e.target.value)}
              className="w-1/3"
              defaultValue="19188" 
            />
            <Input
              type="number"
              placeholder={t("Start Page")}
              value={startPage}
              onChange={(e) => setStartPage(e.target.value)}
              className="w-1/3"
            />
            <Input
              type="number"
              placeholder={t("End Page")}
              value={endPage}
              onChange={(e) => setEndPage(e.target.value)}
              className="w-1/3"
            />
          </div>
        </CardContent>


        <CardFooter className="flex justify-between">
          <Button onClick={handleScrap} disabled={loading} className="flex-1">
            {loading ? t("Loading...") : <><Search className="w-4 h-4 mr-2" /> {t("Scrap Book")}</>}
          </Button>
        </CardFooter>
      </Card>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">{t("Document History")}</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-gray-500">{t("No documents scraped yet.")}</p>
          ) : (
            <ul className="space-y-2">
              {data.map((document: Document, index) => (
                <div>
                  <li key={index} className="flex items-center mt-5 space-x-2">{document.title}</li>
                  <Button onClick={() => handleViewDocument(document.title)}>{t("View Document")}</Button>
                </div>
                
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
