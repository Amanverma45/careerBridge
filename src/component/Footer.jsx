import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="bg-[#0f172a] text-slate-400 border-t border-slate-800/50 mt-auto relative overflow-hidden">
      
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-indigo-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 relative z-10">

        <div className="space-y-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            CareerBridge
          </h2>
          <p className="text-sm leading-relaxed max-w-xs">
            Empowering the next generation of professionals with AI-driven career matching.
          </p>
          
          <div className="flex gap-3 pt-2">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center hover:border-indigo-500 hover:text-white hover:bg-indigo-500/10 transition-all cursor-pointer">
              <span className="text-sm font-bold">in</span>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center hover:border-blue-500 hover:text-white hover:bg-blue-500/10 transition-all cursor-pointer">
              <span className="text-sm font-bold">fb</span>
            </a>

            <a href="https://wa.me/918435856067" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center hover:border-emerald-500 hover:text-white hover:bg-emerald-500/10 transition-all cursor-pointer">
              <span className="text-sm font-bold">wa</span>
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-6 tracking-wider uppercase text-[10px]">Platform</h3>
          <ul className="space-y-4 text-sm">
            <li><Link to="/" className="hover:text-indigo-400 transition-colors">Find Jobs</Link></li>
            <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Browse Companies</Link></li>
            <li><Link to="/signup" className="hover:text-indigo-400 transition-colors">Get Started</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-6 tracking-wider uppercase text-[10px]">Legal</h3>
          <ul className="space-y-4 text-sm">
            <li className="hover:text-indigo-400 transition-colors cursor-pointer">Privacy Policy</li>
            <li className="hover:text-indigo-400 transition-colors cursor-pointer">Terms of Service</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-6 tracking-wider uppercase text-[10px]">Contact Us</h3>
          <div className="space-y-4">
            <a href="tel:+918435856067" className="block group">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Call / WhatsApp</p>
              <p className="text-sm text-slate-300 group-hover:text-indigo-400 transition-colors">+91 84358 56067</p>
            </a>
            <a href="mailto:support@careerbridge.com" className="block group">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Email Support</p>
              <p className="text-sm text-slate-300 group-hover:text-indigo-400 transition-colors">av478136@gmail.com</p>
            </a>
          </div>
        </div>

      </div>

      <div className="border-t border-slate-800/50 py-8 text-center">
        <p className="text-xs text-slate-600 font-medium tracking-wide">
          © {new Date().getFullYear()} CareerBridge. Empowering Your Future.
        </p>
      </div>

    </footer>
  )
}

export default Footer