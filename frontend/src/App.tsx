import './App.css'
import { Outlet } from 'react-router-dom'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { UserProvider } from '@/contexts/UserContext'
import { SocketProvider } from '@/contexts/SocketContext'

function App() {
  return (
    <UserProvider>
      <SocketProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <main className="flex flex-1 flex-col">
              <Outlet />
            </main>
          </SidebarInset>
        </SidebarProvider>
      </SocketProvider>
    </UserProvider>
  )
}

export default App
