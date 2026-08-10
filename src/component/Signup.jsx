import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import toast from 'react-hot-toast';
import { HiX } from 'react-icons/hi';

function Signup({ isModal, onClose }) {
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('')
  const [role, setrole] = useState('')
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleGoogleLogin = async (googleResponse) => {
    if (!role) {
      toast.error("Please select a role first to register with Google");
      return;
    }

    try {
      setLoading(true);
      const googleToken = googleResponse.credential;
      const res = await axios.post("/api/googleLogin", { token: googleToken, role });
      
      const token = res.data.token;
      const user = res.data.user;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("loginTime", Date.now());

        toast.success("Registered and Logged In Successfully via Google");
        
        if (onClose) {
          onClose();
        }

        if (user.role === "admin") {
          navigate("/admindashboard", { replace: true });
        } else if (user.role === "recruiter") {
          navigate("/recruiterdashboard", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Google Authentication Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let script;
    const initGoogleGSI = () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "534125867119-nksq5hsn3bqpqskb3n2b7v7nqd37aor8.apps.googleusercontent.com";
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleLogin,
      });

      const btnContainer = document.getElementById("googleSignUpButton");
      if (btnContainer) {
        window.google?.accounts.id.renderButton(btnContainer, {
          theme: "outline",
          size: "large",
          width: btnContainer.offsetWidth || 350,
          text: "signup_with",
        });
      }
    };

    if (!document.getElementById("google-gsi-client")) {
      script = document.createElement("script");
      script.id = "google-gsi-client";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogleGSI;
      document.body.appendChild(script);
    } else {
      initGoogleGSI();
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!name || !email || !password || !role) {
        toast.error("Please fill all fields")
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (!emailRegex.test(email)) {
        toast.error("Enter valid email address")
        return
      }

      if (password.length < 6) {
        toast.error("Password must be at least 6 characters")
        return
      }

      setLoading(true)

      const response = await axios.post('https://careerbridge-b-1.onrender.com/api/sendOTP', { email })
      console.log("OTP API called")
      
      localStorage.setItem("otpData", JSON.stringify({
        name,
        email,
        password,
        role
      }))
      
      if (response.data?.otp) {
        toast.success(`Development Fallback: OTP is ${response.data.otp}`, { duration: 15000 })
      } else {
        toast.success("OTP sent successfully to your email")
      }
      
      if (onClose) {
        onClose();
      }
      
      navigate("/verify-otp", { state: { email } })

    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false)
    }
  }

  const handleLoginClick = (e) => {
    if (isModal) {
      e.preventDefault();
      window.dispatchEvent(new Event("open-login"));
    }
  }

  const cardContent = (
    <div className={`w-full relative ${isModal ? "" : "max-w-md bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-8 md:p-10 shadow-xl"}`}>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
          Create Account
        </h1>

        <p className="text-slate-500 dark:text-slate-400">
          Already have an account?
          <Link
            to="/login"
            onClick={handleLoginClick}
            className="text-brand-secondary hover:underline ml-1 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-650 dark:text-slate-350 ml-1">
            Name
          </label>
          <input
            onChange={(e) => setname(e.target.value)}
            type="text"
            placeholder="John Doe"
            className="w-full bg-slate-550/5 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-650 dark:text-slate-350 ml-1">
            Email Address
          </label>
          <input
            onChange={(e) => setemail(e.target.value)}
            type="email"
            placeholder="name@gmail.com"
            className="w-full bg-slate-550/5 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-650 dark:text-slate-350 ml-1">
            Password
          </label>
          <input
            onChange={(e) => setpassword(e.target.value)}
            type="password"
            placeholder="••••••••"
            className="w-full bg-slate-550/5 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-650 dark:text-slate-350 ml-1">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setrole(e.target.value)}
            className="w-full bg-slate-550/5 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-slate-700 dark:text-slate-300"
          >
            <option value="">Select Role</option>
            <option value="user">User (Candidate)</option>
            <option value="recruiter">Recruiter (Employer)</option>
          </select>
        </div>

        <Button
          type="submit"
          loading={loading}
          className="bg-brand-primary hover:bg-brand-primary-hover text-white w-full py-3.5"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">Or</span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        <div id="googleSignUpButton" className="w-full flex justify-center mt-1"></div>
      </form>
    </div>
  );

  if (isModal) {
    return cardContent;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-primary/5 dark:bg-brand-primary/3 blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-secondary/5 dark:bg-brand-secondary/3 blur-[120px]" />
      {cardContent}
    </div>
  )
}

export default Signup