"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Star, ArrowUp, ArrowDown } from "lucide-react"

interface UserScore {
  id: string
  name: string
  score: number
  level: string
  lastActivity: string
}

const initialUserScores: UserScore[] = [
  { id: "1", name: "John Doe", score: 850, level: "Expert", lastActivity: "2023-06-15" },
  { id: "2", name: "Jane Smith", score: 720, level: "Advanced", lastActivity: "2023-06-14" },
  { id: "3", name: "Alice Johnson", score: 550, level: "Intermediate", lastActivity: "2023-06-13" },
  { id: "4", name: "Bob Williams", score: 320, level: "Beginner", lastActivity: "2023-06-12" },
  { id: "5", name: "Charlie Brown", score: 180, level: "Novice", lastActivity: "2023-06-11" },
]

export default function ScoreManagementPage() {
  const [userScores, setUserScores] = useState<UserScore[]>(initialUserScores)
  const [sortConfig, setSortConfig] = useState<{ key: keyof UserScore; direction: "asc" | "desc" } | null>(null)

  const sortedUserScores = [...userScores].sort((a, b) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    if (a[key] < b[key]) return direction === "asc" ? -1 : 1
    if (a[key] > b[key]) return direction === "asc" ? 1 : -1
    return 0
  })

  const handleSort = (key: keyof UserScore) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig?.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }))
  }

  const renderSortIcon = (key: keyof UserScore) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Score Management</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userScores.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(userScores.reduce((sum, user) => sum + user.score, 0) / userScores.length)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.max(...userScores.map((user) => user.score))}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lowest Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.min(...userScores.map((user) => user.score))}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                  Name {renderSortIcon("name")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("score")}>
                  Score {renderSortIcon("score")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("level")}>
                  Level {renderSortIcon("level")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("lastActivity")}>
                  Last Activity {renderSortIcon("lastActivity")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUserScores.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.score}</TableCell>
                  <TableCell>{user.level}</TableCell>
                  <TableCell>{user.lastActivity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

