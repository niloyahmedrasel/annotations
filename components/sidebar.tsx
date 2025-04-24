"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ChevronDown,
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Tag,
  User,
  FolderTree,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  submenu?: {
    title: string
    href: string
    roles?: string[]
    submenu?: {
      title: string
      href: string
      roles?: string[]
    }[]
  }[]
  roles: string[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["Super Admin", "Doc Organizer", "Annotator", "Reviewer"],
  },
  {
    title: "Uses & Groups",
    href: "/dashboard/roles",
    icon: Users,
    roles: ["Super Admin"],
    submenu: [
      { title: "Users", href: "/dashboard/roles/users" },
      { title: "Permissions", href: "/dashboard/roles/permissions" },
    ],
  },
  {
    title: "Library Management",
    href: "/dashboard/books",
    icon: BookOpen,
    roles: ["Super Admin", "Doc Organizer", "Annotator", "Reviewer"],
    submenu: [
      { title: "All Books", href: "/dashboard/books" },
      {
        title: "Create Book",
        href: "#",
        roles: ["Super Admin","Annotator"],
        submenu: [
          { title: "Upload Doc", href: "/dashboard/books/new", roles: ["Super Admin"] },
          { title: "Shamela Scraper", href: "/dashboard/books/shamela", roles: ["Super Admin","Annotator"] },
          { title: "Upload PDF", href: "/", roles: ["Super Admin"] },
        ],
      },
    ],
  },
  {
    title: "Issue Management",
    href: "/dashboard/fatwas",
    icon: FileText,
    roles: ["Super Admin", "Doc Organizer","Reviewer"],
    submenu: [
      { title: "Issue Viewer", href: "/dashboard/fatwas", roles:["Reviewer"]  },
      { title: "Create Issue", href: "/dashboard/fatwas/new", roles: ["Super Admin"]},
    ],
  },
  {
    title: "Annotations",
    href: "/dashboard/annotations",
    icon: Tag,
    roles: ["Super Admin", "Annotator"],
    submenu: [{ title: "All Annotations", href: "/dashboard/annotations" }],
  },
  {
    title: "Categories",
    href: "/dashboard/categories",
    icon: FolderTree,
    roles: ["Super Admin"],
    submenu: [
      { title: "All Categories", href: "/dashboard/categories" },
      { title: "Book Categories", href: "/dashboard/categories/books" },
      { title: "Book Type", href: "/dashboard/categories/book-type" },
      { title: "Tags", href: "/dashboard/categories/tags" },
      { title: "Editors", href: "/dashboard/categories/editors" },
      { title: "Publishers", href: "/dashboard/categories/publishers" },
      { title: "Authors", href: "/dashboard/categories/authors" },
    ],
  },
  {
    title: "Scholars",
    href: "/dashboard/scholars",
    icon: User,
    roles: ["Super Admin"],
  },
  {
    title: "Score Management",
    href: "/dashboard/score-management",
    icon: Star,
    roles: ["Super Admin"],
  },
]

interface SidebarProps {
  onCollapse: (collapsed: boolean) => void
}

export function Sidebar({ onCollapse }: SidebarProps) {
  const pathname = usePathname()
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({})
  const [openNestedSubmenus, setOpenNestedSubmenus] = useState<Record<string, boolean>>({})
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const isActive = (item: NavItem) => {
    if (item.href === "/dashboard") {
      return pathname === "/dashboard"
    }
    if (item.submenu) {
      return item.submenu.some((subitem) => {
        if (subitem.submenu) {
          return subitem.submenu.some((nestedItem) => pathname === nestedItem.href)
        }
        return pathname === subitem.href
      })
    }
    return pathname === item.href
  }

  const isSubitemActive = (href: string) => {
    return pathname === href
  }

  useEffect(() => {
    const currentOpenSubmenus: Record<string, boolean> = {}
    const currentOpenNestedSubmenus: Record<string, boolean> = {}

    navItems.forEach((item) => {
      if (item.submenu) {
        const hasActiveSubmenu = item.submenu.some((subitem) => {
          if (subitem.submenu) {
            const hasActiveNestedItem = subitem.submenu.some((nestedItem) => pathname.startsWith(nestedItem.href))
            if (hasActiveNestedItem) {
              currentOpenNestedSubmenus[subitem.title] = true
              return true
            }
          }
          return pathname.startsWith(subitem.href)
        })

        if (hasActiveSubmenu) {
          currentOpenSubmenus[item.title] = true
        }
      }
    })

    setOpenSubmenus(currentOpenSubmenus)
    setOpenNestedSubmenus(currentOpenNestedSubmenus)
  }, [pathname])

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const toggleNestedSubmenu = (e: React.MouseEvent, title: string) => {
    e.preventDefault()
    e.stopPropagation()
    setOpenNestedSubmenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const userHasAccess = (roles?: string[]) => {
    if (!roles || roles.length === 0) return true
    return roles.includes(user?.role || "")
  }

  const filteredNavItems = navItems.filter((item) => {
    if (userHasAccess(item.roles)) {
      if (item.submenu) {
        const filteredSubmenu = item.submenu
          .filter((subitem) => userHasAccess(subitem.roles))
          .map((subitem) => {
            if (subitem.submenu) {
              return {
                ...subitem,
                submenu: subitem.submenu.filter((nestedItem) => userHasAccess(nestedItem.roles)),
              }
            }
            return subitem
          })
          .filter(
            (subitem) =>
              !subitem.submenu || subitem.submenu.length > 0,
          )
        return filteredSubmenu.length > 0
      }
      return true
    }
    return false
  })

  useEffect(() => {
    onCollapse(isCollapsed)
  }, [isCollapsed, onCollapse])

  const handleNestedItemClick = (e: React.MouseEvent, href: string) => {
    router.push(href)
  }

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-gray-950 border-r border-gray-800 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-14 items-center border-b border-gray-800 px-4">
        {isCollapsed ? (
          <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(false)} className="ml-auto">
            <ChevronRight className="h-6 w-6 text-primary" />
          </Button>
        ) : (
          <>
            <Link href="/dashboard" className="flex items-center space-x-2">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg text-white">Annotation</span>
            </Link>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsCollapsed(true)}>
              <ChevronLeft className="h-6 w-6 text-primary" />
            </Button>
          </>
        )}
      </div>
      <ScrollArea className="flex-1">
        <nav className="space-y-1 px-1 py-2">
          {filteredNavItems.map((item) => (
            <div key={item.title}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white",
                  isActive(item) && "bg-gray-800 text-white",
                )}
                onClick={() => (item.submenu ? toggleSubmenu(item.title) : null)}
                asChild={!item.submenu}
              >
                {item.submenu ? (
                  <div className="flex w-full items-center py-2">
                    <item.icon className="mr-2 h-4 w-4" />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        <ChevronDown
                          className={cn("h-4 w-4 transition-transform", openSubmenus[item.title] && "rotate-180")}
                        />
                      </>
                    )}
                  </div>
                ) : (
                  <Link href={item.href} className="flex w-full items-center py-2">
                    <item.icon className="mr-2 h-4 w-4" />
                    {!isCollapsed && <span className="flex-1 text-left">{item.title}</span>}
                  </Link>
                )}
              </Button>

              {!isCollapsed && item.submenu && openSubmenus[item.title] && (
                <div className="mt-1 space-y-1 px-4">
                  {item.submenu
                    .filter((subitem) => userHasAccess(subitem.roles))
                    .map((subitem) => (
                      <div key={subitem.title}>
                        {subitem.submenu ? (
                          <div>
                            <div
                              className={cn(
                                "flex items-center justify-between rounded-md py-2 pl-4 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white cursor-pointer",
                                subitem.submenu.some((nestedItem) => pathname === nestedItem.href) &&
                                  "bg-gray-800 text-white",
                              )}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                toggleNestedSubmenu(e, subitem.title)
                              }}
                            >
                              <span>{subitem.title}</span>
                              <ChevronDown
                                className={cn(
                                  "h-4 w-4 transition-transform",
                                  openNestedSubmenus[subitem.title] && "rotate-180",
                                )}
                              />
                            </div>
                            {openNestedSubmenus[subitem.title] && (
                              <div className="ml-4 mt-1 space-y-1">
                                {subitem.submenu
                                  .filter((nestedItem) => userHasAccess(nestedItem.roles))
                                  .map((nestedItem) => (
                                    <Link
                                      key={nestedItem.href}
                                      href={nestedItem.href}
                                      className={cn(
                                        "block rounded-md py-2 pl-4 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white",
                                        pathname === nestedItem.href && "bg-gray-800 text-white",
                                      )}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {nestedItem.title}
                                    </Link>
                                  ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Link
                            href={subitem.href}
                            className={cn(
                              "block rounded-md py-2 pl-4 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white",
                              pathname === subitem.href && "bg-gray-800 text-white",
                            )}
                          >
                            {subitem.title}
                          </Link>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <User className="h-6 w-6 text-gray-400" />
          {!isCollapsed && <span className="text-sm font-medium text-gray-300">{user?.name}</span>}
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
          <LogOut className="h-4 w-4 text-gray-400" />
        </Button>
      </div>
    </div>
  )
}
