'use client';

import { AppSidebar } from "@/components/app-sidebar";
import { ChatInput } from "@/components/chat-input";

import { SidebarProvider } from "@/components/ui/sidebar";


const Page = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <ChatInput />
    </SidebarProvider>
    

  )
}

export default Page;