import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import HomePage from './app/page.tsx'
import DashboardPage from './app/dashboard/page.tsx'
import './index.css'
import Login from './app/authenticate/login/page.tsx'
import Authenticate from './app/authenticate/page.tsx'
import Register from './app/authenticate/register/page.tsx'
import { SocketProvider } from './contexts/SocketContext'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: '/authenticate',
    element: <Authenticate />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      }
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  </React.StrictMode>,
)
