'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Users, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react";
import { count } from "console"

interface UserCount {
  users: number;
}
interface PermissionsCount {
  count: number;
}

export default function RolesPage() {
  const [countUser, setCountUser] = useState<UserCount>({ users: 0 });
  const [countPermissions, setCountPermissions] = useState<PermissionsCount>({ count: 0 });
  useEffect(() => {
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      const token = user.token;
      fetch('https://lkp.pathok.com.bd/api/user/count/count-users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          setCountUser(data);
          console.log(data);
        })
        .catch(error => {
          console.error('Error fetching book data:', error);
        });
    },[])


  useEffect(() => {
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      const token = user.token;
      fetch('https://lkp.pathok.com.bd/api/permission/count/count-permissions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          setCountPermissions(data);
          console.log(data);
        })
        .catch(error => {
          console.error('Error fetching book data:', error);
        });
    },[])
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Uses & Groups</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countUser.users}</div>
            <p className="text-xs text-muted-foreground">Total registered users</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/roles/users">Manage Users</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permissions</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countPermissions.count}</div>
            <p className="text-xs text-muted-foreground">Available role types</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/roles/permissions">Manage Permissions</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

