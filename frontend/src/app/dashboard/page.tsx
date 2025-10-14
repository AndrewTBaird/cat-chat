'use client';

import { AppSidebar } from "@/components/app-sidebar";

import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { Link } from "react-router-dom"

const Page = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>
    
    // <div className="flex min-h-svh flex-col items-center justify-center gap-4">
    //   <h1 className="text-3xl font-bold">Dashboard</h1>
    //   <p className="text-muted-foreground">Welcome to your dashboard!</p>
    //   <Link to="/">
    //     <Button variant="outline">Back to Home</Button>
    //   </Link>
    // </div>
  )
}

export default Page;