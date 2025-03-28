"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, Filter, Search, Plus, BookOpen, Calendar, FileText, ArrowUpDown, ExternalLink } from "lucide-react"
import Link from "next/link"


const statusOptions = ["All Statuses", "In Review", "Published", "Unpublished"]

export default function CreateIssuePage() {
 
  const [dbSearchTerm, setDbSearchTerm] = useState("")
  const [dbSortBy, setDbSortBy] = useState("date")
  const [dbSortOrder, setDbSortOrder] = useState<"asc" | "desc">("desc")
  const [dbFilterStatus, setDbFilterStatus] = useState("All Statuses")

  const [shSearchTerm, setShSearchTerm] = useState("")
  const [shSortBy, setShSortBy] = useState("date")
  const [shSortOrder, setShSortOrder] = useState<"asc" | "desc">("desc")
  const [shFilterStatus, setShFilterStatus] = useState("All Statuses")

  const [uploadedBook, setUploadedBook] = useState<any[]>([])
  const [shamelaDocuments, setShamelaDocuments] = useState<any[]>([])


 useEffect(() => {
   
   const user = sessionStorage.getItem("user")
   const token = user ? JSON.parse(user).token : null
   const fetchUploadedBook = async () => {
    
     try {
       const response = await fetch("https://lkp.pathok.com.bd/api/book",{
         headers: {
           Authorization: `Bearer ${token}`,
         },
       })
       const data = await response.json()
       setUploadedBook(data.books)
       console.log(data.books)
     } catch (error) {
       console.error("Error fetching uploaded book:", error)
     }
   }
   fetchUploadedBook()

   const fetchShamelaDocuments = async () => {
     try {
       const response = await fetch("https://lkp.pathok.com.bd/api/scraped-documents")
       const data = await response.json()
       setShamelaDocuments(data)
       console.log(data)
     } catch (error) {
       console.error("Error fetching Shamela documents:", error)
     }
   }
   fetchShamelaDocuments()
 },[])
  const handleCreateIssue = (document: any) => {
    console.log("Creating issue for document:", document)
    alert(`Creating issue for: ${document.title}`)
  }
  const filteredUploadedBookDocuments = uploadedBook
    .filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(dbSearchTerm.toLowerCase()) ||
        doc.author.toLowerCase().includes(dbSearchTerm.toLowerCase())
      const matchesStatus = dbFilterStatus === "All Statuses" || doc.status === dbFilterStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (dbSortBy === "title") {
        return dbSortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      } else if (dbSortBy === "author") {
        return dbSortOrder === "asc" ? a.author.localeCompare(b.author) : b.author.localeCompare(a.author)
      } else if (dbSortBy === "status") {
        return dbSortOrder === "asc" ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status)
      } else {
        // Default sort by date
        return dbSortOrder === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      }
    })

    const handleViewDocument = async (document: any) => {
    if (document?.bookFile) {
      const editorUrl = `https://test.pathok.com.bd/editor?fileName=${encodeURIComponent(document.bookFile)}&mode=edit`;
      window.open(editorUrl, "_blank"); 
      return;
    }else if(document?.title){
      const editorUrl = `https://test.pathok.com.bd/editor?fileName=${encodeURIComponent(document.title)}&mode=edit`;
      window.open(editorUrl, "_blank"); 
      return;
    }
  }

  // Filter and sort Shamela documents
  const filteredShDocuments = shamelaDocuments
    .filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(shSearchTerm.toLowerCase())
      const matchesStatus = shFilterStatus === "All Statuses" || doc.status === shFilterStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (shSortBy === "title") {
        return shSortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      } else if (shSortBy === "author") {
        return shSortOrder === "asc" ? a.author.localeCompare(b.author) : b.author.localeCompare(a.author)
      } else if (shSortBy === "status") {
        return shSortOrder === "asc" ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status)
      } else {
        return shSortOrder === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      }
    })

  const toggleSortOrder = (section: "db" | "sh") => {
    if (section === "db") {
      setDbSortOrder(dbSortOrder === "asc" ? "desc" : "asc")
    } else {
      setShSortOrder(shSortOrder === "asc" ? "desc" : "asc")
    }
  }
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "In Review":
        return "secondary"
      case "Unpublished":
        return "destructive"
      case "Published":
        return "default" 
      default:
        return "destructive"
    }
  }

  // Render document card
  const renderDocumentCard = (document: any) => (
    console.log("this is document", document),
    <Card key={document.id} className="overflow-hidden transition-all hover:shadow-md">
      <div className="flex p-4">
        <div className="mr-4 flex-shrink-0">
        <img
          src={document.bookCover ? `https://lkp.pathok.com.bd/upload/${document.bookCover}` : "/placeholder.svg"}
          alt={document.title}
          className="h-24 w-16 object-cover rounded-sm"
        />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold line-clamp-2">{document.title}</h3>
          <p className="text-sm text-gray-500">{document.author}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant={getStatusBadgeVariant(document.status)} className="text-xs">
              {document.status}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Calendar className="mr-1 h-3 w-3" />
              {document.createdAt}
            </Badge>
            {document.shamelaId && (
              <Badge variant="outline" className="text-xs">
                ID: {document.shamelaId}
              </Badge>
            )}
          </div>
          <div className="mt-3 flex space-x-2">
            <Button onClick={() => handleViewDocument(document)} variant="outline" size="sm" className="flex-1">
              <Eye className="mr-1 h-3 w-3" />
              View
            </Button>
            <Link href={`/dashboard/fatwas/new/${document._id}`}><Button 
              size="sm" 
              className="flex-1" 
            >
              <Plus className="mr-1 h-3 w-3" />
              Create Issue
            </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create Issue</h1>

      <Tabs defaultValue="database" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="database" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            Uploaded Book
          </TabsTrigger>
          <TabsTrigger value="shamela" className="flex items-center">
            <ExternalLink className="mr-2 h-4 w-4" />
            Shamela Documents
          </TabsTrigger>
        </TabsList>

        {/* Uploaded Book Tab */}
        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Uploaded Book</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search and Filter Controls */}
                <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search documents..."
                      value={dbSearchTerm}
                      onChange={(e) => setDbSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>

                  <div className="flex space-x-2">

                    <Select value={dbFilterStatus} onValueChange={setDbFilterStatus}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={dbSortBy} onValueChange={setDbSortBy}>
                      <SelectTrigger className="w-[150px]">
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="author">Author</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleSortOrder("db")}
                      title={dbSortOrder === "asc" ? "Sort Descending" : "Sort Ascending"}
                    >
                      {dbSortOrder === "asc" ? "↑" : "↓"}
                    </Button>
                  </div>
                </div>

                {/* Document List */}
                <ScrollArea className="h-[500px] rounded-md border p-4">
                  {filteredUploadedBookDocuments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredUploadedBookDocuments.map(renderDocumentCard)}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-center text-gray-500">No documents found matching your criteria.</p>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shamela Documents Tab */}
        <TabsContent value="shamela" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Shamela Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search and Filter Controls */}
                <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search documents..."
                      value={shSearchTerm}
                      onChange={(e) => setShSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>

                  <div className="flex space-x-2">

                    <Select value={shFilterStatus} onValueChange={setShFilterStatus}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={shSortBy} onValueChange={setShSortBy}>
                      <SelectTrigger className="w-[150px]">
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="author">Author</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleSortOrder("sh")}
                      title={shSortOrder === "asc" ? "Sort Descending" : "Sort Ascending"}
                    >
                      {shSortOrder === "asc" ? "↑" : "↓"}
                    </Button>
                  </div>
                </div>

                {/* Document List */}
                <ScrollArea className="h-[500px] rounded-md border p-4">
                  {filteredShDocuments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredShDocuments.map(renderDocumentCard)}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-center text-gray-500">No documents found matching your criteria.</p>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}