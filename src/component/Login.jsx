import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import Button from './Button';
import toast from 'react-hot-toast';
import { HiX } from 'react-icons/hi';

function Login({ isModal, onClose }) {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password Views: "login", "forgot", "reset"
  const [view, setView] = useState("login");
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const navigate = useNavigate()

  const handleGoogleLogin = async (googleResponse) => {
    try {
      setLoading(true);
      const googleToken = googleResponse.credential;
      const res = await axios.post("/api/googleLogin", { token: googleToken });
      
      const token = res.data.token;
      const user = res.data.user;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("loginTime", Date.now());

        toast.success("Login Successful via Google");
        
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
      toast.error(err.response?.data?.message || "Google Login Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view !== "login") return;

    let script;
    const initGoogleGSI = () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleLogin,
      });

      const btnContainer = document.getElementById("googleSignInButton");
      if (btnContainer) {
        window.google?.accounts.id.renderButton(btnContainer, {
          theme: "outline",
          size: "large",
          width: btnContainer.offsetWidth || 350,
          text: "signin_with",
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
  }, [view]);

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Please fill all fields")
      return
    }

    try {
      setLoading(true)

      const response = await axios.post(
        'https://careerbridge-b-1.onrender.com/api/loginUser',
        {
          email: email.toLowerCase(),
          password
        }
      )

      const token = response.data.token
      const user = response.data.user

      if (token) {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem("loginTime", Date.now())

        toast.success('Login Successfully')
        
        if (onClose) {
          onClose();
        }

        if (user.role === "admin") {
          navigate('/admindashboard', { replace: true })
        } else if (user.role === "recruiter") {
          navigate('/recruiterdashboard', { replace: true })
        } else {
          navigate('/dashboard', { replace: true })
        }
      }

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Invalid Email or Password')
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterClick = (e) => {
    if (isModal) {
      e.preventDefault();
      window.dispatchEvent(new Event("open-register"));
    }
  }

  const handleForgotPasswordRequest = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Please enter your email");
      return;
    }
    try {
      setResetLoading(true);
      const response = await axios.post("https://careerbridge-b-1.onrender.com/api/forgotPassword", { email: resetEmail });
      toast.success("Verification reset code sent to your email!");
      
      if (response.data?.otp) {
        toast.success(`Development Fallback: Reset OTP is ${response.data.otp}`, { duration: 15000 });
      }
      setView("reset");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to request password reset");
    } finally {
      setResetLoading(false);
    }
  }

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!resetOtp || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setResetLoading(true);
      await axios.post("https://careerbridge-b-1.onrender.com/api/resetPassword", {
        email: resetEmail,
        otp: resetOtp,
        newPassword
      });
      toast.success("Password reset successfully! Please log in.");
      setView("login");
      setpassword(""); 
      setNewPassword("");
      setConfirmPassword("");
      setResetOtp("");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setResetLoading(false);
    }
  }

  const cardContent = (
    <div className={`w-full relative ${isModal ? "" : "max-w-md bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-8 md:p-10 shadow-xl relative z-10"}`}>

      {view === "login" && (
        <>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-505 dark:text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                onClick={handleRegisterClick}
                className="text-brand-secondary hover:underline transition font-semibold"
              >
                Register
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-650 dark:text-slate-300 ml-1">
                Email Address
              </label>
              <input
                onChange={(e) => setemail(e.target.value)}
                type="email"
                value={email}
                placeholder="you@example.com"
                className="w-full bg-slate-550/5 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-slate-800 dark:text-slate-100"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-655 dark:text-slate-300 ml-1">
                Password
              </label>
              <input
                onChange={(e) => setpassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="••••••••"
                className="w-full bg-slate-550/5 dark:bg-slate-955 border border-slate-250 dark:border-slate-805 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-slate-800 dark:text-slate-100"
                required
              />
              <div className="flex items-center justify-between pt-1 px-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 select-none cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={showPassword} 
                    onChange={(e) => setShowPassword(e.target.checked)} 
                    className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary border-slate-300 dark:border-slate-805 dark:bg-slate-955"
                  />
                  Show Password
                </label>
                <button
                  type="button"
                  onClick={() => setView("forgot")}
                  className="text-xs font-semibold text-brand-primary hover:underline cursor-pointer focus:outline-none border-none bg-transparent"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="bg-brand-primary hover:bg-brand-primary-hover text-white w-full py-3.5"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">Or</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            <div id="googleSignInButton" className="w-full flex justify-center mt-1"></div>
          </form>
        </>
      )}

      {view === "forgot" && (
        <>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
              Forgot Password
            </h1>
            <p className="text-slate-505 dark:text-slate-450 text-xs">
              Enter your registered email below to receive a verification OTP code.
            </p>
          </div>

          <form onSubmit={handleForgotPasswordRequest} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-650 dark:text-slate-300 ml-1">
                Email Address
              </label>
              <input
                onChange={(e) => setResetEmail(e.target.value)}
                type="email"
                value={resetEmail}
                placeholder="you@example.com"
                className="w-full bg-slate-550/5 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-slate-800 dark:text-slate-100"
                required
              />
            </div>

            <Button
              type="submit"
              loading={resetLoading}
              className="bg-brand-primary hover:bg-brand-primary-hover text-white w-full py-3.5"
            >
              Send Reset Code
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-xs font-bold text-slate-505 hover:text-slate-800 dark:hover:text-white transition cursor-pointer bg-transparent border-none focus:outline-none"
              >
                Back to Login
              </button>
            </div>
          </form>
        </>
      )}

      {view === "reset" && (
        <>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
              Reset Password
            </h1>
            <p className="text-slate-505 dark:text-slate-450 text-xs break-all">
              Verification reset code sent to: <span className="font-semibold text-brand-secondary">{resetEmail}</span>
            </p>
          </div>

          <form onSubmit={handleResetPasswordSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-650 dark:text-slate-300 ml-1">
                Reset OTP Code
              </label>
              <input
                onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ""))}
                type="text"
                maxLength="6"
                value={resetOtp}
                placeholder="Enter 6-digit OTP"
                className="w-full text-center text-xl tracking-wider bg-slate-550/5 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-slate-800 dark:text-slate-100 font-bold"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-650 dark:text-slate-300 ml-1">
                New Password
              </label>
              <input
                onChange={(e) => setNewPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                value={newPassword}
                placeholder="Minimum 6 characters"
                className="w-full bg-slate-550/5 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-slate-800 dark:text-slate-100"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-655 dark:text-slate-300 ml-1">
                Confirm Password
              </label>
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                placeholder="••••••••"
                className="w-full bg-slate-550/5 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-slate-800 dark:text-slate-100"
                required
              />
              <div className="flex items-center justify-between pt-1 px-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 select-none cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={showPassword} 
                    onChange={(e) => setShowPassword(e.target.checked)} 
                    className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary border-slate-300 dark:border-slate-805 dark:bg-slate-955"
                  />
                  Show Password
                </label>
              </div>
            </div>

            <Button
              type="submit"
              loading={resetLoading}
              className="bg-brand-primary hover:bg-brand-primary-hover text-white w-full py-3.5"
            >
              Reset Password
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-xs font-bold text-slate-550 hover:text-slate-800 dark:hover:text-white transition cursor-pointer bg-transparent border-none focus:outline-none"
              >
                Cancel and Back
              </button>
            </div>
          </form>
        </>
      )}

      <p className="mt-8 text-center text-xs text-slate-405 dark:text-slate-500">
        By signing in, you agree to our{" "}
        <button 
          onClick={(e) => { e.preventDefault(); if (onClose) onClose(); window.dispatchEvent(new Event("open-terms")); }} 
          className="hover:underline text-slate-500 dark:text-slate-400 font-semibold bg-transparent border-none p-0 cursor-pointer text-xs"
        >
          Terms of Service
        </button>{" "}
        and{" "}
        <button 
          onClick={(e) => { e.preventDefault(); if (onClose) onClose(); window.dispatchEvent(new Event("open-privacy")); }} 
          className="hover:underline text-slate-500 dark:text-slate-400 font-semibold bg-transparent border-none p-0 cursor-pointer text-xs"
        >
          Privacy Policy
        </button>.
      </p>
    </div>
  );

  if (isModal) {
    return cardContent;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary/5 dark:bg-brand-primary/3 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-secondary/5 dark:bg-brand-secondary/3 blur-[120px]" />
      {cardContent}
    </div>
  )
}

export default Login