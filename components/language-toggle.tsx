"use client"

import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { isRTL } from "../app/lib/i18n"
import { useEffect } from "react"

export function LanguageToggle() {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en"
    i18n.changeLanguage(newLang)
    localStorage.setItem("language", newLang)

    // Update document direction for RTL support
    document.documentElement.dir = isRTL(newLang) ? "rtl" : "ltr"
  }

  // Set initial direction on mount
  useEffect(() => {
    document.documentElement.dir = isRTL(i18n.language) ? "rtl" : "ltr"
  }, [i18n.language])

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-gray-400 hover:text-white"
    >
      <Globe className="h-4 w-4" />
      <span>{i18n.language === "en" ? "العربية" : "English"}</span>
    </Button>
  )
}
