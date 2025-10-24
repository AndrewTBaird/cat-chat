import './App.css'
import { Outlet } from 'react-router-dom'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { UserProvider } from '@/contexts/UserContext'

function App() {
  return (
    <UserProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main className="flex flex-1 flex-col">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </UserProvider>
  )
}

export default App
