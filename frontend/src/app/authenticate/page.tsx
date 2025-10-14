import { Outlet } from "react-router-dom";

const Authenticate = () => {
  return (
    <div className="flex min-h-screen p-8 items-center justify-center bg-muted">
      <Outlet />
    </div>
  )
}

export default Authenticate;