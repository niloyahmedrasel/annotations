"use client"
import RolePermissions from "@/components/RolePermissions"
import { useTranslation } from "react-i18next"

export default function PermissionsPage() {
  const { t, i18n } = useTranslation()
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("Role Permissions")}</h1>
      <RolePermissions />
    </div>
  )
}

