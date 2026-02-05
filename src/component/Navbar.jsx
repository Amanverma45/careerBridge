import { Link } from "react-router-dom"
import logo from "./Images/logo.png"

function Navbar() {
  return (
    <nav className="w-full bg-slate-800 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3">
      
      <div className="flex items-center gap-2">
        <img
          src={logo}
          alt="CareerBridge Logo"
          className="h-14 w-auto"
        />
        <span className="text-lg font-semibold whitespace-nowrap">
          CareerBridge
        </span>
      </div>

      {/* Links */}
      <div className="flex gap-4 text-sm">
        <Link to="/" className="hover:text-slate-300 transition">
          Home
        </Link>
        <Link to="/signup" className="hover:text-slate-300 transition">
          Signup
        </Link>
        <Link to="/login" className="hover:text-slate-300 transition">
          Login
        </Link>
      </div>

    </nav>
  )
}

export default Navbar
