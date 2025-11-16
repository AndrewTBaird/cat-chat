import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import App from './App.tsx'
import DashboardPage from './app/dashboard/page.tsx'
import DashboardLayout from './app/dashboard/layout.tsx'
import ProfilePage from './app/dashboard/profile/page.tsx'
import './index.css'
import Login from './app/authenticate/login/page.tsx'
import Authenticate from './app/authenticate/page.tsx'
import Register from './app/authenticate/register/page.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/channel/1" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: 'channel/:channelId',
            element: <DashboardPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
        ],
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
    <RouterProvider router={router} />
  </React.StrictMode>,
)
