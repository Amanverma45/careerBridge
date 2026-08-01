import { Link } from "react-router-dom"

function Footer() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-t border-slate-250/70 dark:border-slate-800/80 mt-auto relative overflow-hidden transition-colors duration-300">

      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-brand-primary/5 dark:bg-brand-primary/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 relative z-10">

        <div className="space-y-4">
          <Link to="/" className="inline-block">
            <h2 className="text-2xl font-black tracking-tight text-brand-primary">
              Career<span className="text-brand-secondary">Bridge</span>
            </h2>
          </Link>

          <p className="text-sm leading-relaxed max-w-xs text-slate-500 dark:text-slate-400">
            Connecting talented professionals with the right career opportunities and helping companies discover exceptional talent.
          </p>

          {/* Social Icons */}
          <div className="flex gap-3 pt-2">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-lg bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:border-brand-primary hover:text-brand-primary transition-all duration-200"
              aria-label="LinkedIn"
            >
              <span className="text-sm font-bold">in</span>
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-lg bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:border-brand-primary hover:text-brand-primary transition-all duration-200"
              aria-label="Facebook"
            >
              <span className="text-sm font-bold">fb</span>
            </a>

            <a
              href="https://wa.me/918435856067"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-lg bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:border-brand-secondary hover:text-brand-secondary transition-all duration-200"
              aria-label="WhatsApp"
            >
              <span className="text-sm font-bold">wa</span>
            </a>
          </div>
        </div>

        {/* Platform Links */}
        <div>
          <h3 className="text-slate-900 dark:text-white font-bold mb-6 tracking-wider uppercase text-[10px]">
            Platform
          </h3>

          <ul className="space-y-4 text-sm font-medium">
            {token ? (
              user?.role === "recruiter" ? (
                <>
                  <li>
                    <Link to="/recruiterdashboard" className="text-slate-550 dark:text-slate-400 hover:text-brand-secondary transition-colors duration-200">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/addJobs" className="text-slate-550 dark:text-slate-400 hover:text-brand-secondary transition-colors duration-200">
                      Post a Job
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event("open-profile")); }}
                      className="text-slate-550 dark:text-slate-400 hover:text-brand-secondary transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 text-left font-medium"
                    >
                      My Profile
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/jobs" className="text-slate-550 dark:text-slate-400 hover:text-brand-secondary transition-colors duration-200">
                      Find Jobs
                    </Link>
                  </li>
                  <li>
                    <Link to="/appliedJobs" className="text-slate-550 dark:text-slate-400 hover:text-brand-secondary transition-colors duration-200">
                      Applied Jobs
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event("open-profile")); }}
                      className="text-slate-550 dark:text-slate-400 hover:text-brand-secondary transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 text-left font-medium"
                    >
                      My Profile
                    </button>
                  </li>
                </>
              )
            ) : (
              <>
                <li>
                  <Link to="/jobs" className="text-slate-550 dark:text-slate-400 hover:text-brand-secondary transition-colors duration-200">
                    Find Jobs
                  </Link>
                </li>
                <li>
                  <Link to="/jobs" className="text-slate-550 dark:text-slate-400 hover:text-brand-secondary transition-colors duration-200">
                    Browse Companies
                  </Link>
                </li>
                <li>
                  <button
                    onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event("open-register")); }}
                    className="text-slate-550 dark:text-slate-400 hover:text-brand-secondary transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 text-left font-medium"
                  >
                    Register
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h3 className="text-slate-900 dark:text-white font-bold mb-6 tracking-wider uppercase text-[10px]">
            Legal
          </h3>

          <ul className="space-y-4 text-sm font-medium">
            <li>
              <button 
                onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event("open-privacy")); }} 
                className="text-slate-550 dark:text-slate-400 hover:text-brand-secondary transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 font-medium text-sm text-left"
              >
                Privacy Policy
              </button>
            </li>
            <li>
              <button 
                onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event("open-terms")); }} 
                className="text-slate-550 dark:text-slate-400 hover:text-brand-secondary transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 font-medium text-sm text-left"
              >
                Terms of Service
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-slate-900 dark:text-white font-bold mb-6 tracking-wider uppercase text-[10px]">
            Contact Us
          </h3>

          <div className="space-y-4">
            <a href="tel:+918435856067" className="block group">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold mb-1">
                Call / WhatsApp
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-brand-secondary transition-colors duration-200">
                +91 84358 56067
              </p>
            </a>

            <a href="mailto:yourcareerbridge.app@gmail.com" className="block group">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold mb-1">
                Email Support
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-brand-secondary transition-colors duration-200">
                yourcareerbridge.app@gmail.com
              </p>
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Footer Credits */}
      <div className="border-t border-slate-200/60 dark:border-slate-800/50 py-8 text-center">
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium tracking-wide">
          © {new Date().getFullYear()} CareerBridge. Empowering Your Future.
        </p>
      </div>

    </footer>
  )
}

export default Footer
