import './App.css'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-svh">
      <Outlet />
    </div>
  )
}

export default App
