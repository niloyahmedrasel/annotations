import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Users, ShieldCheck } from "lucide-react"

export default function RolesPage() {
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
            <div className="text-2xl font-bold">24</div>
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
            <div className="text-2xl font-bold">3</div>
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

