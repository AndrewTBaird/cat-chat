import { LoginForm } from "@/components/login-form"
import { Card } from "@/components/ui/card"
import React from "react"

const Login = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="min-w-80">
        <LoginForm />
      </div>
    </div>
  )
}

export default Login