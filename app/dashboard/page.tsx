'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FileText, Users, Activity } from "lucide-react"
import { RecentActivities } from "@/components/recent-activities"
import { useDebugValue, useEffect, useState } from "react";
import Link from "next/link";

interface BookCount {
  count: number;
}
export default function DashboardPage() {

  const [countBook, setCountBook] = useState<BookCount>({ count: 0 });

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const token = user.token;
    fetch('https://lkp.pathok.com.bd/api/book/count/count-books', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setCountBook(data);
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching book data:', error);
      });
  },[])
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <Link href="/dashboard/books"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          </Link>
          <CardContent>
            <div className="text-2xl font-bold">{countBook.count}</div>
          </CardContent>
        </Card>
        <Card>
          <Link href="/dashboard/annotations"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Annotations</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          </Link>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
          </CardContent>
        </Card>
        <Card>
         <Link href="/dashboard/fatwas"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fatwas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
          </Link>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
          </CardContent>
        </Card>
        <Card>
          <Link href="/dashboard/roles/users"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviewers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          </Link>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

