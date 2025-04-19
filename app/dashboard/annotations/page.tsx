"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Project {
  id: number;
  title: string;
  description: string;
  task_number: number;
  created_by: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  created_at: string;
  is_published: boolean;
  queue_total: number;
  queue_done: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("https://studio.pathok.com.bd/api/projects", {
          headers: {
            Authorization: "Token 685298f62992e1d89d8283b273247c6f9d7e7a0a"
          }
        })
        const data = await res.json()
        console.log("Projects data:", data)
        setProjects(Array.isArray(data) ? data : data.results || [])
      } catch (error) {
        console.error("Error fetching projects:", error)
      }
    }
    fetchProjects()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Label Studio Projects</h1>
      <p className="text-muted-foreground">
        Showing {projects.length} projects
      </p>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Tasks</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-mono text-sm">#{project.id}</TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{project.title}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {project.description}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{project.task_number || 0}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: project.queue_total > 0 
                            ? `${(project.queue_done / project.queue_total) * 100}%` 
                            : '0%' 
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
                      {project.created_by.first_name || project.created_by.email.split('@')[0]}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(project.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell>
                  <Badge variant={project.is_published ? "default" : "secondary"}>
                    {project.is_published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => window.open(`https://studio.pathok.com.bd/projects/${project.id}/data`, '_blank')}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}