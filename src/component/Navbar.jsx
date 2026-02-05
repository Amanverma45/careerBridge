import { Link } from "react-router-dom"
import logo from "./Images/logo.png"

function Navbar() {
    return (
        <nav className="h-20 w-full bg-slate-800 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <img
                    src={logo}
                    alt="CareerBridge Logo"
                    className="h-20 w-auto"
                />
                <span className="text-lg font-semibold">
                    CareerBridge
                </span>
            </div>
            <div className="flex gap-6 text-sm">
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
