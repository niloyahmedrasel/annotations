"use client"

import { useEffect, useState, useTransition } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronUp,
  ChevronDown,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { useTranslation } from "react-i18next"

interface Project {
  id: number
  title: string
  description: string
  task_number: number
  created_by: {
    id: number
    first_name: string
    last_name: string
    email: string
  }
  created_at: string
  is_published: boolean
  queue_total: number
  queue_done: number
}

type SortField = "id" | "title" | "task_number" | "progress" | "created_by" | "created_at"
type SortDirection = "asc" | "desc"

export default function ProjectsPage() {
  
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [projectsPerPage] = useState(10)

  const {t, i18n} = useTranslation()
  const isRTL = i18n.language === "ar"

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true)
        setError(null)

   
        const res = await fetch("https://studio.pathok.com.bd/api/projects", {
          headers: {
            Authorization: "Token 685298f62992e1d89d8283b273247c6f9d7e7a0a",
          },
     
          cache: "no-cache",
        })

        if (!res.ok) {
          throw new Error(`Server responded with status: ${res.status} ${res.statusText}`)
        }

        const data = await res.json()

        const projectsData = Array.isArray(data) ? data : data.results || []
        console.log(`Fetched ${projectsData.length} projects`)

        setProjects(projectsData)
        setFilteredProjects(projectsData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching projects:", error)

        let errorMessage = "Failed to load projects"
        if (error instanceof Error) {
          errorMessage = `${errorMessage}: ${error.message}`
        }

        if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
          errorMessage =
            "Network error: Unable to connect to the server. Please check your internet connection and try again."
        }

        setError(errorMessage)
        setLoading(false)

        setProjects([])
        setFilteredProjects([])
      }
    }

    fetchProjects()
  }, [])

  useEffect(() => {
    let result = [...projects]

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          project.id.toString().includes(searchLower),
      )
    }

    if (statusFilter) {
      result = result.filter((project) => (statusFilter === "Published" ? project.is_published : !project.is_published))
    }

    if (sortField) {
      result.sort((a, b) => {
        let comparison = 0

        switch (sortField) {
          case "id":
            comparison = a.id - b.id
            break
          case "title":
            comparison = a.title.localeCompare(b.title)
            break
          case "task_number":
            comparison = (a.task_number || 0) - (b.task_number || 0)
            break
          case "progress":
            const progressA = a.queue_total > 0 ? a.queue_done / a.queue_total : 0
            const progressB = b.queue_total > 0 ? b.queue_done / b.queue_total : 0
            comparison = progressA - progressB
            break
          case "created_by":
            const nameA = `${a.created_by.first_name || ""} ${a.created_by.last_name || ""}`.trim()
            const nameB = `${b.created_by.first_name || ""} ${b.created_by.last_name || ""}`.trim()
            comparison = nameA.localeCompare(nameB)
            break
          case "created_at":
            comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            break
        }

        return sortDirection === "asc" ? comparison : -comparison
      })
    }

    setFilteredProjects(result)
    setCurrentPage(1) 
  }, [projects, searchTerm, statusFilter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    )
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter(null)
    setSortField(null)
  }

  const retryFetch = () => {
    setLoading(true)
    setError(null)

    setProjects([])
  }

  const indexOfLastProject = currentPage * projectsPerPage
  const indexOfFirstProject = indexOfLastProject - projectsPerPage
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject)
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t("Label Studio Projects")}</h1>
        <div className="flex items-center justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-2">{t("Loading projects...")}</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t("Label Studio Projects")}</h1>
        <Card className="border-red-200">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center text-red-600">
              <AlertCircle className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-bold">{t("Error Loading Projects")}</h2>
            </div>
            <p className="text-gray-700">{error}</p>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{t("Possible solutions:")}</p>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                <li>{t("Check your internet connection")}</li>
                <li>{t("Verify that the API endpoint is correct")}</li>
                <li>{t("Ensure your authentication token is valid")}</li>
                <li>{t("Try refreshing the page")}</li>
              </ul>
            </div>
            <Button onClick={retryFetch} className="mt-4 flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("Try Again")}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("Label Studio Projects")}</h1>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder={t("Search projects by title, description, or ID...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <Tabs defaultValue="all" onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="all" className="flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {t("All")}
              </TabsTrigger>
              <TabsTrigger value="Published" className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                {t("Published")}
              </TabsTrigger>
              <TabsTrigger value="Draft" className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-amber-500" />
                {t("Draft")}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {(searchTerm || statusFilter) && (
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={clearFilters} className="flex items-center">
                <X className="h-4 w-4 mr-1" />
                {t("Clear Filters")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {t("Showing")} {currentProjects.length} {t("of")} {filteredProjects.length} {t("projects")}
          {filteredProjects.length !== projects.length && <span> (filtered from {projects.length} total)</span>}
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={isRTL?"cursor-pointer text-right":"cursor-pointer"} onClick={() => handleSort("id")}>
                {t("ID")} {getSortIcon("id")}
              </TableHead>
              <TableHead className={isRTL?"cursor-pointer text-right":"cursor-pointer"} onClick={() => handleSort("title")}>
                {t("Title")} {getSortIcon("title")}
              </TableHead>
              <TableHead className={isRTL?"cursor-pointer text-right":"cursor-pointer"} onClick={() => handleSort("task_number")}>
                {t("Tasks")} {getSortIcon("task_number")}
              </TableHead>
              <TableHead className={isRTL?"cursor-pointer text-right":"cursor-pointer"} onClick={() => handleSort("progress")}>
                {t("Progress")} {getSortIcon("progress")}
              </TableHead>
              <TableHead className={isRTL?"cursor-pointer text-right":"cursor-pointer"} onClick={() => handleSort("created_by")}>
                {t("Created By")} {getSortIcon("created_by")}
              </TableHead>
              <TableHead className={isRTL?"cursor-pointer text-right":"cursor-pointer"} onClick={() => handleSort("created_at")}>
                {t("Created At")} {getSortIcon("created_at")}
              </TableHead>
              <TableHead className={isRTL?"cursor-pointer text-right":"cursor-pointer"}>{t("Status")}</TableHead>
              <TableHead className={isRTL?"cursor-pointer text-right":"cursor-pointer"}>{t("Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProjects.length > 0 ? (
              currentProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-mono text-sm">#{project.id}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{project.title}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1">{project.description}</span>
                    </div>
                  </TableCell>
                  <TableCell>{project.task_number || 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width:
                              project.queue_total > 0 ? `${(project.queue_done / project.queue_total) * 100}%` : "0%",
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {project.queue_done}/{project.queue_total}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage
                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${project.created_by.first_name}+${project.created_by.last_name}`}
                          alt={project.created_by.first_name}
                        />
                        <AvatarFallback>
                          {project.created_by.first_name?.[0]}
                          {project.created_by.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        {project.created_by.first_name || project.created_by.email.split("@")[0]}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(project.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={project.is_published ? "default" : "secondary"}
                      className={`flex items-center gap-1 ${project.is_published ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-amber-100 text-amber-800 hover:bg-amber-200"}`}
                    >
                      {project.is_published ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          {t("Published")}
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3" />
                          {t("Draft")}
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(`https://studio.pathok.com.bd/projects/${project.id}/data`, "_blank")}
                    >
                      {t("View")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Search className="h-12 w-12 mb-2 opacity-20" />
                    <h3 className="text-lg font-medium">No projects found</h3>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                    <Button variant="outline" className="mt-4" onClick={clearFilters}>
                      Clear all filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredProjects.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {t("Showing")} {indexOfFirstProject + 1} {t("to")} {Math.min(indexOfLastProject, filteredProjects.length)} {t("of")}{" "}
            {filteredProjects.length} {t("projects")}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum: number

                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <Button
                    key={i}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-9"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
