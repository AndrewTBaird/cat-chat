'use client';

import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const HomePage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Welcome to Cat Chat</h1>
      <p className="text-muted-foreground">Your favorite place to chat with cats!</p>
      <div className="flex gap-4">
        <Link to="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}

export default HomePage;
