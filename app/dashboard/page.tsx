"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FileText, Users } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

interface BookCount {
  count: number
}

export default function DashboardPage() {
  const { t, i18n } = useTranslation()
  const [countBook, setCountBook] = useState<BookCount>({ count: 0 })
  const [countIssue, setCountIssue] = useState<BookCount>({ count: 0 })
  const isRTL = i18n.language === "ar"

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}")
    const token = user.token

    fetch("https://lkp.pathok.com.bd/api/book/count/count-books", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCountBook(data)
        console.log(data)
      })
      .catch((error) => {
        console.error("Error fetching book data:", error)
      })

    fetch("https://lkp.pathok.com.bd/api/issue/count/count-issues", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCountIssue(data)
        console.log(data)
      })
      .catch((error) => {
        console.error("Error fetching issue data:", error)
      })
  }, [])

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      <h1 className={cn("text-3xl font-bold", isRTL && "text-right")}>{t("Dashboard Overview")}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <Link href="/dashboard/books">
            <CardHeader
              className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}
            >
              <CardTitle className="text-sm font-medium">{t("Total Books")}</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
          </Link>
          <CardContent className={isRTL ? "text-right" : "text-left"}>
            <div className="text-2xl font-bold">{countBook.count}</div>
          </CardContent>
        </Card>

        <Card>
          <Link href="/dashboard/annotations">
            <CardHeader
              className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}
            >
              <CardTitle className="text-sm font-medium">{t("Total Annotations")}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
          </Link>
          <CardContent className={isRTL ? "text-right" : "text-left"}>
            <div className="text-2xl font-bold">-</div>
          </CardContent>
        </Card>

        <Card>
          <Link href="/dashboard/fatwas">
            <CardHeader
              className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}
            >
              <CardTitle className="text-sm font-medium">{t("Total Fatwas")}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
          </Link>
          <CardContent className={isRTL ? "text-right" : "text-left"}>
            <div className="text-2xl font-bold">{countIssue.count}</div>
          </CardContent>
        </Card>

        <Card>
          <Link href="/dashboard/roles/users">
            <CardHeader
              className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}
            >
              <CardTitle className="text-sm font-medium">{t("Total Reviewers")}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
          </Link>
          <CardContent className={isRTL ? "text-right" : "text-left"}>
            <div className="text-2xl font-bold">-</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
