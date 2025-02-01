import { Activity } from "lucide-react"

const activities = [
  { id: 1, type: "upload", user: "John Doe", item: "Islamic Jurisprudence", time: "2 hours ago" },
  { id: 2, type: "annotation", user: "Jane Smith", item: "Sahih Al-Bukhari", time: "3 hours ago" },
  { id: 3, type: "review", user: "Ahmed Ali", item: "Fiqh of Worship", time: "5 hours ago" },
  { id: 4, type: "upload", user: "Maria Garcia", item: "Principles of Islamic Law", time: "1 day ago" },
]

export function RecentActivities() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center space-x-4">
          <Activity className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.user}{" "}
              {activity.type === "upload" ? "uploaded" : activity.type === "annotation" ? "annotated" : "reviewed"}{" "}
              {activity.item}
            </p>
            <p className="text-sm text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

