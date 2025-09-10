import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { BookType, Calendar, ChartNoAxesColumn, GalleryThumbnails, Gauge, Home, ImageIcon, Inbox, Lightbulb, Search, Settings, User2 } from "lucide-react"
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const items = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Thumbnail Generator",
        url: "/ai-thumbnail-generator",
        icon: ImageIcon,
    },
    {
        title: "Thumbnail Search",
        url: "/thumbnail-search",
        icon: GalleryThumbnails,
    },
    {
        title: "Keywords",
        url: "/trending-keywords",
        icon: BookType,
    },
    {
        title: "Outlier",
        url: "/outlier",
        icon: Gauge,
    },
    {
        title: "AI Content Generator",
        url: "/ai-content-generator",
        icon: Lightbulb,
    },
    {
        title: "Billing",
        url: "/billing",
        icon: Settings,
    },
    {
        title: "Profile",
        url: "/profile",
        icon: User2,
    },
]

export function AppSidebar() {
    const path = usePathname();
    return (
        <Sidebar>
            <SidebarHeader className="p-0 m-0">
                <div className="w-full">
                    <Image
                        src="/f2.png"
                        alt="logo"
                        width={192}
                        height={192}
                        className="w-full h-auto object-contain block dark:hidden"
                    />

                    <Image
                        src="/darkmodelogo.png"
                        alt="logo"
                        width={192}
                        height={192}
                        className="w-full h-auto object-contain hidden dark:block"
                    />
                    <h2 className="text-sm text-gray-400 text-center mt-1">Build Awesome</h2>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>

                    <SidebarGroupContent>
                        <SidebarMenu className='mt-1'>
                            {items.map((item, index) => (
                                // <SidebarMenuItem key={item.title} className='p-2'>
                                //     <SidebarMenuButton asChild className=''>
                                <a href={item.url} key={index} className={`p-2 text-lg flex gap-2 items-center rounded-lg transition-colors
    hover:bg-gray-100 dark:hover:bg-gray-700
    ${path.includes(item.url) ? "bg-gray-200 dark:bg-gray-800" : ""}
  `}>
                                    <item.icon className='h-5 w-5' />
                                    <span>{item.title}</span>
                                </a>
                                //     </SidebarMenuButton>
                                // </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <h2 className='p-2 text-gray-400 text-sm'>Copyright @Tubeguruji</h2>
            </SidebarFooter>
        </Sidebar>
    )
}