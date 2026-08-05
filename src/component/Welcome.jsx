import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FaUserCircle, 
  FaBookmark,
  FaBriefcase, 
  FaFileAlt, 
  FaChartLine, 
  FaArrowRight, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaTimesCircle,
  FaSpinner,
  FaHourglassHalf,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaCrown,
  FaGraduationCap,
  FaComments,
  FaClipboardList,
  FaBookOpen,
  FaClock,
  FaLightbulb,
  FaCheck,
  FaCreditCard,
  FaRegPaperPlane,
  FaRocket,
  FaUserTie
} from 'react-icons/fa'
import axios from 'axios'
import toast from 'react-hot-toast'
import Button from './Button'
import { HiX } from 'react-icons/hi'

function Welcome() {
  const navigate = useNavigate()
  
  // Safe Parse localStorage user object
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user")
      return stored ? JSON.parse(stored) : null
    } catch (e) {
      console.error("Localstorage user parse error:", e)
      return null
    }
  })

  // Core States
  const [applications, setApplications] = useState([])
  const [allJobs, setAllJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [jobsLoading, setJobsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeDashboardTab, setActiveDashboardTab] = useState("overview")
  const [isPremiumUser, setIsPremiumUser] = useState(user?.isPremium || false)
  const [applyLoadingId, setApplyLoadingId] = useState(null)
  const [appliedIds, setAppliedIds] = useState([])
  const [savedCount, setSavedCount] = useState(0)

  // Modal & Support states
  const [isSupportOpen, setIsSupportOpen] = useState(false)
  const [isHubOpen, setIsHubOpen] = useState(false)
  const [supportForm, setSupportForm] = useState({ subject: "", message: "" })
  const [submitLoading, setSubmitLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("resume")

  // Premium Billing simulation states
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradingSpinner, setUpgradingSpinner] = useState(false)
  const [billingForm, setBillingForm] = useState({ cardNumber: "", cardName: "", cardExpiry: "", cardCvc: "" })

  // Skill Gap Simulation states
  const [learnedSkills, setLearnedSkills] = useState([])

  // Interview Prep mock simulator states
  const [selectedPrepRole, setSelectedPrepRole] = useState("frontend")
  const [revealedAnswers, setRevealedAnswers] = useState({})
  const [masteredQuestions, setMasteredQuestions] = useState({})
  const [prepTimerActive, setPrepTimerActive] = useState(false)
  const [prepTimerSeconds, setPrepTimerSeconds] = useState(120)

  // Career Coach simulated chatbot states
  const [coachInput, setCoachInput] = useState("")
  const [isCoachTyping, setIsCoachTyping] = useState(false)
  const [coachMessages, setCoachMessages] = useState([
    {
      sender: "coach",
      text: `Hello ${user?.name || "there"}! I am Coach Bridgey, your AI Career Coach. 🚀\n\nAsk me anything about resume writing, salary negotiation strategies, skill development roadmaps, or mock interview answers! Click one of the quick pills below or type your career query directly.`,
      timestamp: new Date()
    }
  ])

  // Interview Prep Questions Database
  const prepQuestions = {
    frontend: [
      {
        q: "Explain the differences between client-side rendering (CSR) and server-side rendering (SSR) in React.",
        a: "CSR loads a minimal HTML shell and downloads JavaScript files to generate HTML dynamically in the client browser (ideal for web apps, slower initial load). SSR renders full HTML on the server per request and sends it to the browser (ideal for SEO, faster initial paint, higher server load)."
      },
      {
        q: "What is the Virtual DOM and how does reconciliation work in React?",
        a: "The Virtual DOM is an in-memory lightweight representation of the real DOM. When state changes, React builds a new virtual DOM tree, compares it with the old tree (Diffing Algorithm), and batches only the necessary changes to patch the real DOM (Reconciliation)."
      },
      {
        q: "How does the Event Loop work in JavaScript?",
        a: "JavaScript is single-threaded. Synchronous code executes first on the Call Stack. Asynchronous tasks (like fetch, timers) go to Web APIs, and then queue in the Callback Queue (Macros) or Microtask Queue (Promises). The Event Loop pushes queued callbacks to the Call Stack only when the stack is empty."
      },
      {
        q: "What is the difference between state management in Redux vs Context API?",
        a: "Context API is built into React and is ideal for low-frequency updates (e.g. themes, localization) because it triggers a re-render on all consumer child nodes. Redux is a third-party library for high-frequency, complex state management, featuring action history, middleware, and optimized re-renders."
      }
    ],
    backend: [
      {
        q: "How do SQL databases differ from NoSQL databases, and when would you use MongoDB over PostgreSQL?",
        a: "SQL (PostgreSQL) is relational, uses schema validation, joins, and excels in structured transaction-heavy architectures (ACID). NoSQL (MongoDB) is non-relational, document-oriented, horizontally scalable, and excels with unstructured, nested data requiring high read/write throughput."
      },
      {
        q: "Describe RESTful API principles and how they compare with GraphQL.",
        a: "REST relies on standard HTTP methods (GET, POST, PUT, DELETE) and endpoints returning fixed JSON structures. GraphQL exposes a single endpoint and allows clients to query specifically what fields they want, avoiding over-fetching or under-fetching."
      },
      {
        q: "What is middleware in Express.js and how does error-handling middleware differ?",
        a: "Middleware functions have access to the Request, Response, and the `next` function in the application's request-response cycle. Regular middleware processes inputs/logs. Error-handling middleware has four arguments: `(err, req, res, next)` and is declared last to catch errors."
      },
      {
        q: "How do database indexes improve query speed, and what are their trade-offs?",
        a: "Indexes create a fast-lookup data structure (like B-Trees) for columns, reducing full-table scans. The trade-off is that they consume extra storage disk space and slow down writes (INSERT, UPDATE, DELETE) since the index must be updated."
      }
    ],
    fullstack: [
      {
        q: "Outline the complete security flow for JWT-based user authentication.",
        a: "1. Client submits credentials over HTTPS.\n2. Server verifies credentials, signs a JWT token with a server secret, and returns it.\n3. Client stores JWT (preferably in a secure HttpOnly cookie or secure storage).\n4. Client attaches JWT in the Authorization Header (Bearer token) for subsequent calls.\n5. Middleware verifies the token validity before executing backend logic."
      },
      {
        q: "What is CORS (Cross-Origin Resource Sharing) and how do you resolve it?",
        a: "CORS is a browser security mechanism that restricts resources requested from a different domain/port. To resolve it in Express/React, you configure the `cors` middleware in Express to explicitly permit requests from the React client domain (`http://localhost:5173`)."
      },
      {
        q: "How do WebSockets differ from standard HTTP long polling?",
        a: "HTTP polling repeatedly queries the server at interval times (inefficient, high latency). WebSockets establish a single persistent, bidirectional TCP connection enabling real-time events to be pushed by either client or server immediately."
      }
    ],
    behavioral: [
      {
        q: "Describe a conflict you had with a team member and how you resolved it.",
        a: "Use the **STAR** method:\n**Situation**: Disagreement on project architecture (SQL vs NoSQL).\n**Task**: Ensure we met the deadline without compromising scalability.\n**Action**: Scheduled a constructive 1-on-1, analyzed features of both relative to requirements, and proposed a hybrid compromise.\n**Result**: Kept the project on track, built mutual respect, and finished on time."
      },
      {
        q: "What do you do when a project deadline is fast approaching and you are behind?",
        a: "Assess current tasks, communicate blockers transparently to the manager, prioritize high-value core MVP features, align on postponing nice-to-have features, and coordinate with peer developers to co-author critical tasks."
      }
    ]
  }

  // Pre-configured Chatbot prompts
  const coachTemplates = {
    salary: "💰 Tell me how to negotiate a software engineer salary",
    resume: "📝 Show me a checklist for a professional resume review",
    roadmap: "🚀 Give me a 3-month roadmap to learn Cloud Development (AWS)",
    intern: "💡 How do I transition from Intern to Full-time?"
  }

  // Fetch Dashboard & Jobs
  useEffect(() => {
    if (!user?._id) {
      setLoading(false)
      setJobsLoading(false)
      return
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `https://careerbridge-b-1.onrender.com/application/appliedJobs/${user._id}`
        )
        if (response.data && Array.isArray(response.data)) {
          setApplications(response.data)
          const ids = response.data.map(app => app.jobId?._id || app.jobId).filter(Boolean)
          setAppliedIds(ids)
        } else {
          setApplications([])
        }

        const savedRes = await axios.get(
          `/api/savedJobs/${user._id}`
        )
        if (savedRes.data && Array.isArray(savedRes.data)) {
          setSavedCount(savedRes.data.length)
        }
      } catch (err) {
        console.error("Fetch dashboard data error:", err)
        setError("Unable to retrieve job applications. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    const fetchAllJobs = async () => {
      try {
        setJobsLoading(true)
        const response = await axios.get(
          "https://careerbridge-b-1.onrender.com/job/getJob"
        )
        if (response.data && response.data.jobs) {
          setAllJobs(response.data.jobs)
        }
      } catch (err) {
        console.error("Fetch jobs error:", err)
      } finally {
        setJobsLoading(false)
      }
    }

    fetchDashboardData()
    fetchAllJobs()
  }, [user?._id, learnedSkills])

  // Interview Prep Timer Countdown Effect
  useEffect(() => {
    let timer = null
    if (prepTimerActive && prepTimerSeconds > 0) {
      timer = setInterval(() => {
        setPrepTimerSeconds(prev => prev - 1)
      }, 1000)
    } else if (prepTimerSeconds === 0) {
      setPrepTimerActive(false)
      toast.error("Time is up! Try to summarize your mock answer now.")
    }
    return () => clearInterval(timer)
  }, [prepTimerActive, prepTimerSeconds])

  // Calculate profile strength (each worth 25%)
  let strength = 0
  const checklist = [
    { key: "name", label: "Full Name", value: user?.name, desc: "Add your name in profile setup" },
    { key: "skills", label: "Skills Added", value: user?.skills, desc: "List your top professional skills" },
    { key: "experience", label: "Experience Details", value: user?.experience, desc: "Add your work or project history" },
    { key: "bio", label: "Professional Bio", value: user?.bio, desc: "Write a short summary about yourself" }
  ]
  
  checklist.forEach(item => {
    if (item.value) {
      if (typeof item.value === 'string') {
        if (item.value.trim() !== "") strength += 25
      } else {
        strength += 25
      }
    }
  })

  // Safe checks for applications array
  const appsArray = Array.isArray(applications) ? applications : []
  const pendingCount = appsArray.filter(app => (app?.status || '').toLowerCase() === 'pending').length
  const shortlistedCount = appsArray.filter(app => 
    (app?.status || '').toLowerCase() === 'shortlisted' || (app?.status || '').toLowerCase() === 'accepted'
  ).length

  const stats = [
    { label: "Profile Strength", value: `${strength}%`, icon: <FaChartLine />, color: "text-brand-primary bg-brand-primary/10", borderClass: "border-t-brand-primary" },
    { label: "Applied Jobs", value: appsArray.length, icon: <FaBriefcase />, color: "text-violet-500 bg-violet-500/10", borderClass: "border-t-violet-500" },
    { label: "Saved Jobs", value: savedCount, icon: <FaBookmark />, color: "text-brand-primary bg-brand-primary/10", borderClass: "border-t-brand-primary", onClick: () => navigate('/savedJobs') },
    { label: "Shortlisted", value: shortlistedCount, icon: <FaCheckCircle />, color: "text-emerald-500 bg-emerald-500/10", borderClass: "border-t-emerald-500" },
    { label: "Pending Reviews", value: pendingCount, icon: <FaHourglassHalf />, color: "text-amber-500 bg-amber-500/10", borderClass: "border-t-amber-500" }
  ]

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A"
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getStatusBadge = (status) => {
    const s = (status || 'pending').toLowerCase()
    if (s === 'shortlisted' || s === 'accepted') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-250 dark:border-emerald-900/30 rounded-full text-xs font-bold capitalize select-none shrink-0">
          <FaCheckCircle className="text-[10px]" /> {s}
        </span>
      )
    }
    if (s === 'rejected') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 dark:bg-rose-955/20 dark:text-rose-400 border border-rose-250 dark:border-rose-900/30 rounded-full text-xs font-bold capitalize select-none shrink-0">
          <FaTimesCircle className="text-[10px]" /> {s}
        </span>
      )
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 dark:bg-amber-955/20 dark:text-amber-400 border border-amber-250 dark:border-amber-900/30 rounded-full text-xs font-bold capitalize select-none shrink-0">
        <FaHourglassHalf className="text-[10px]" /> {s}
      </span>
    )
  }

  const handleResourceHubClick = () => {
    setIsHubOpen(true)
  }

  const handleReachSupportClick = () => {
    setIsSupportOpen(true)
  }

  const handleSupportSubmit = async (e) => {
    e.preventDefault()
    if (!supportForm.subject.trim() || !supportForm.message.trim()) {
      toast.error("Please fill in all fields.")
      return
    }
    
    setSubmitLoading(true)
    setTimeout(() => {
      setSubmitLoading(false)
      const ticketId = Math.floor(100000 + Math.random() * 900000)
      toast.success(`Support ticket #${ticketId} created! We will email you at ${user?.email}`)
      setSupportForm({ subject: "", message: "" })
      setIsSupportOpen(false)
    }, 1200)
  }

  // --- SMART MATCHING ALGORITHM IMPLEMENTATION ---
  const userSkills = (user?.skills || "").toLowerCase().split(',').map(s => s.trim()).filter(Boolean)

  const computeJobMatch = (job) => {
    if (!job) return { score: 0, matched: [], missing: [] }
    if (!userSkills.length) return { score: 0, matched: [], missing: [] }

    let jobSkills = (job.skills || "").toLowerCase().split(',').map(s => s.trim()).filter(Boolean)
    
    const titleLower = (job.title || "").toLowerCase()
    const descLower = (job.description || "").toLowerCase()
    const textToSearch = `${titleLower} ${descLower}`

    // 1. If job has no explicit skills, let's infer them from title/description categories
    if (jobSkills.length === 0) {
      const commonSkills = [
        "react", "node", "express", "mongodb", "javascript", "js", "html", "css",
        "laravel", "php", "java", "spring", "c++", "c#", "dotnet", ".net", "python",
        "django", "flask", "angular", "vue", "typescript", "ts", "mysql", "sql", "postgresql",
        "aws", "docker", "kubernetes", "git", "nextjs", "next.js", "nuxt", "svelte"
      ]
      
      const detectedTech = commonSkills.filter(skill => {
        const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const regex = new RegExp(`\\b${escaped}\\b`, 'i')
        return regex.test(textToSearch)
      })

      if (detectedTech.length > 0) {
        jobSkills = detectedTech
      } else {
        const frontendKeywords = ["frontend", "web dev", "web developer", "ui", "ux", "designer"]
        const backendKeywords = ["backend", "apis", "api", "server"]
        const fullstackKeywords = ["full stack", "fullstack"]

        const isFrontendJob = frontendKeywords.some(kw => textToSearch.includes(kw))
        const isBackendJob = backendKeywords.some(kw => textToSearch.includes(kw))
        const isFullStackJob = fullstackKeywords.some(kw => textToSearch.includes(kw))

        const impliedSkills = new Set()
        if (isFrontendJob) {
          ["html", "css", "javascript", "js", "react"].forEach(s => impliedSkills.add(s))
        }
        if (isBackendJob) {
          ["node", "express", "mongodb"].forEach(s => impliedSkills.add(s))
        }
        if (isFullStackJob) {
          ["html", "css", "javascript", "js", "react", "node", "express", "mongodb"].forEach(s => impliedSkills.add(s))
        }
        jobSkills = Array.from(impliedSkills)
      }
    }

    // 2. Perform match computation
    let matched = []
    let missing = []

    if (jobSkills.length > 0) {
      jobSkills.forEach(skill => {
        if (userSkills.includes(skill)) {
          matched.push(skill)
        } else {
          // Synonym support for JS/Javascript
          if (skill === "js" && userSkills.includes("javascript")) {
            matched.push(skill)
          } else if (skill === "javascript" && userSkills.includes("js")) {
            matched.push(skill)
          } else {
            missing.push(skill)
          }
        }
      })

      const score = Math.round((matched.length / jobSkills.length) * 100)
      return { score, matched, missing }
    }

    return { score: 0, matched: [], missing: [] }
  }

  const matchedJobs = allJobs.map(job => {
    const matchDetails = computeJobMatch(job)
    return {
      ...job,
      matchScore: matchDetails.score,
      matchedSkills: matchDetails.matched,
      missingSkills: matchDetails.missing
    }
  }).sort((a, b) => b.matchScore - a.matchScore)

  // One-Click Apply Action from Dashboards
  const handleQuickApply = async (jobId) => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      setApplyLoadingId(jobId)
      const response = await axios.post(
        "https://careerbridge-b-1.onrender.com/application/applyJob",
        {
          userId: user._id,
          jobId
        }
      )
      setAppliedIds(prev => [...prev, jobId])
      toast.success(response.data.message || "Successfully applied using smart profile sync! 🚀")
      // Re-trigger application fetch
      const statsResponse = await axios.get(
        `https://careerbridge-b-1.onrender.com/application/appliedJobs/${user._id}`
      )
      if (statsResponse.data && Array.isArray(statsResponse.data)) {
        setApplications(statsResponse.data)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply")
    } finally {
      setApplyLoadingId(null)
    }
  }

  // --- SKILL GAP ANALYSIS COMPILATION ---
  const aggregateMissingSkills = () => {
    const counts = {}
    matchedJobs.forEach(job => {
      if (job.matchScore >= 30) {
        job.missingSkills.forEach(skill => {
          const formatted = skill.trim().toLowerCase()
          if (formatted) {
            counts[formatted] = (counts[formatted] || 0) + 1
          }
        })
      }
    })
    return Object.keys(counts).map(name => ({
      name,
      count: counts[name]
    })).sort((a, b) => b.count - a.count)
  }

  const skillGaps = aggregateMissingSkills()

  // Simulate Learning / Adding skills directly to user profile
  const handleLearnSkill = async (skillName) => {
    const formattedSkill = skillName.charAt(0).toUpperCase() + skillName.slice(1)
    const existingSkills = user?.skills || ""
    const newSkillsString = existingSkills 
      ? `${existingSkills}, ${formattedSkill}` 
      : formattedSkill

    try {
      const response = await axios.put(
        `https://careerbridge-b-1.onrender.com/api/updateUser/${user._id}`,
        {
          name: user.name,
          skills: newSkillsString
        }
      )
      localStorage.setItem("user", JSON.stringify(response.data.user))
      setUser(response.data.user)
      setLearnedSkills(prev => [...prev, skillName])
      toast.success(`Congratulations! "${formattedSkill}" has been added to your profile skills!`)
    } catch (err) {
      console.error(err)
      toast.error("Failed to sync learned skill with database")
    }
  }

  // Get resources recommendations based on skill name
  const getResourceLinks = (skill) => {
    const s = skill.toLowerCase()
    if (s.includes("react")) {
      return {
        tutorial: "https://react.dev/learn",
        video: "https://www.youtube.com/results?search_query=react+js+complete+course+freecodecamp",
        guide: "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_getting_started"
      }
    }
    if (s.includes("node") || s.includes("express")) {
      return {
        tutorial: "https://nodejs.org/en/docs",
        video: "https://www.youtube.com/results?search_query=nodejs+express+mongodb+course+freecodecamp",
        guide: "https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs"
      }
    }
    if (s.includes("ts") || s.includes("typescript")) {
      return {
        tutorial: "https://www.typescriptlang.org/docs/",
        video: "https://www.youtube.com/results?search_query=typescript+tutorial+for+beginners",
        guide: "https://quickref.me/typescript"
      }
    }
    if (s.includes("docker") || s.includes("kubernetes")) {
      return {
        tutorial: "https://docs.docker.com/get-started/",
        video: "https://www.youtube.com/results?search_query=docker+tutorial+for+beginners+freecodecamp",
        guide: "https://roadmap.sh/devops"
      }
    }
    return {
      tutorial: `https://www.google.com/search?q=${s}+documentation`,
      video: `https://www.youtube.com/results?search_query=learn+${s}+course+freecodecamp`,
      guide: `https://roadmap.sh`
    }
  }

  // --- INTERVIEW PREP HANDLERS ---
  const activeQuestions = prepQuestions[selectedPrepRole] || prepQuestions.frontend

  const toggleAnswer = (idx) => {
    setRevealedAnswers(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }))
  }

  const toggleMastered = (idx) => {
    setMasteredQuestions(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }))
  }

  const startPrepTimer = () => {
    setPrepTimerSeconds(120)
    setPrepTimerActive(true)
  }

  const masteredCount = Object.values(masteredQuestions).filter(Boolean).length
  const prepProgressPercent = Math.round((masteredCount / activeQuestions.length) * 100) || 0

  // --- CAREER COACH SIMULATOR ---
  const handleCoachMessageSubmit = (text) => {
    if (!text.trim()) return

    const newMsg = { sender: "user", text, timestamp: new Date() }
    setCoachMessages(prev => [...prev, newMsg])
    setCoachInput("")
    setIsCoachTyping(true)

    // Simulate AI Coaching response based on input content
    setTimeout(() => {
      let coachReply = ""
      const t = text.toLowerCase()

      if (t.includes("negotiate") || t.includes("salary") || t.includes("negotiation")) {
        coachReply = `**BridgeAI Salary Negotiation Framework:**\n\n1. **Do Not Reveal Your Number First**: When HR asks, redirect: *"I would love to understand the budget allocated for this role, as well as target competencies."*\n2. **Quote Ranges Supported by Market Data**: Reference Glassdoor or Levels.fyi. E.g. *"My research shows that similar roles in Bangalore command between ₹8L and ₹11L base."*\n3. **Counter Confidently**: Always ask for a 10-15% increase above their first written offer politely. *"Thank you so much. Based on the technical requirements, is there any flexibility to push the base to ₹Y?"*`
      } else if (t.includes("resume") || t.includes("cv") || t.includes("ats")) {
        coachReply = `**Resume Optimization Guide:**\n\n*   **Keep it clean**: Avoid multi-column layouts, graphics, or icons. ATS parsers read left-to-right, top-to-bottom.\n*   **The STAR Bullet Formula**: Start each bullet point with a powerful action verb (e.g., *Engineered*, *Optimized*, *Formulated*). Follow with quantitative metrics (e.g., *"reduced API response times by 32%"*).\n*   **Skills Placement**: Categorize your skills clearly: Languages (JavaScript, Python), Libraries (React, Express), Tools (Git, Docker).\n*   **Length**: Keep it to exactly one page unless you have 6+ years of relevant tech experience.`
      } else if (t.includes("cloud") || t.includes("aws") || t.includes("roadmap")) {
        coachReply = `**3-Month Cloud Development Roadmap (AWS Focus):**\n\n*   **Month 1 (Linux & Networks)**: Master terminal commands, SSH keys, routing protocols, subnets, and standard ports.\n*   **Month 2 (Core AWS Compute & Storage)**: Create EC2 instances, setup security groups, configure S3 buckets, and construct simple AWS Lambda serverless endpoints.\n*   **Month 3 (CI/CD & Containers)**: Containerize a Node/React app with Docker, upload it to ECR, and configure GitHub Actions to deploy to AWS Elastic Beanstalk automatically.`
      } else if (t.includes("intern") || t.includes("full-time")) {
        coachReply = `**Transitioning from Intern to Full-Time:**\n\n1. **Own Your Work**: Document your architecture code. Submit clean pull requests.\n2. **Solve Undesired Tasks**: Volunteer to write unit tests or clean up bug backlogs. Managers love reliable builders.\n3. **Proactive Updates**: Communicate blockers early during stand-ups. Never wait until the end of the week.\n4. **Ask for Performance Audits**: Schedule a 15-minute chat with your senior lead asking: *"What skills should I develop further to ensure full-time conversion?"*`
      } else {
        coachReply = `That's a vital career consideration. Here are the core actions I recommend:\n\n1. Build **end-to-end full stack projects** showing database integrations and user sessions rather than simple UI mockups.\n2. Document your design patterns on GitHub readmes. Write clean markdown.\n3. Commit daily to demonstrate discipline and git proficiency.\n\nCould you tell me more about your specific background so I can refine this roadmap?`
      }

      setCoachMessages(prev => [...prev, {
        sender: "coach",
        text: coachReply,
        timestamp: new Date()
      }])
      setIsCoachTyping(false)
    }, 900)
  }

  // --- PREMIUM VIP UPGRADE ACTION ---
  const handleUpgradePaymentSubmit = async (e) => {
    e.preventDefault()
    if (!billingForm.cardNumber || !billingForm.cardName || !billingForm.cardExpiry || !billingForm.cardCvc) {
      toast.error("Please fill in all security card fields")
      return
    }

    setUpgradingSpinner(true)
    setTimeout(async () => {
      try {
        const response = await axios.put(
          `https://careerbridge-b-1.onrender.com/api/updateUser/${user._id}`,
          {
            name: user.name,
            isPremium: true
          }
        )
        localStorage.setItem("user", JSON.stringify(response.data.user))
        setUser(response.data.user)
        setIsPremiumUser(true)
        toast.success("Welcome to CareerBridge VIP Gold Club! 👑")
        setShowUpgradeModal(false)
      } catch (err) {
        toast.error("Upgrade billing transaction failed. Please try again.")
      } finally {
        setUpgradingSpinner(false)
      }
    }, 1800)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 transition-colors duration-300 animate-fade-in">
      
      {/* Premium Accents Header */}
      {isPremiumUser && (
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-955 font-black text-center py-2 text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm animate-pulse-slow">
          <FaCrown className="text-sm shrink-0" /> CareerBridge VIP Premium Account Active <FaCrown className="text-sm shrink-0" />
        </div>
      )}

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 ${isPremiumUser ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950' : 'bg-brand-primary text-white'}`}>
              {isPremiumUser ? <FaCrown /> : <FaRocket />}
            </div>
            <div className="text-left">
              <h1 className="text-xl sm:text-2xl font-black text-slate-850 dark:text-white flex items-center gap-1.5">
                Dashboard {isPremiumUser && <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1"><FaCrown className="text-[9px]" /> VIP</span>}
              </h1>
              <p className="text-xs text-slate-405 dark:text-slate-500">Manage your career progress and tracking</p>
            </div>
          </div>

          {/* Navigation Pills (Mobile 2x3 grid, Desktop single row) */}
          <div className="grid grid-cols-2 md:flex md:flex-nowrap gap-2 w-full md:w-auto select-none">
            <button
              onClick={() => setActiveDashboardTab("overview")}
              className={`px-2 py-2.5 md:px-4 md:py-2 rounded-xl text-[11px] md:text-xs font-black transition whitespace-nowrap cursor-pointer border-none flex items-center justify-center gap-1.5 ${
                activeDashboardTab === "overview"
                  ? "bg-brand-primary text-white"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-655 dark:text-slate-355 hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
              }`}
            >
              <FaChartLine className="text-sm" /> Overview
            </button>
            <button
              onClick={() => setActiveDashboardTab("matching")}
              className={`px-2 py-2.5 md:px-4 md:py-2 rounded-xl text-[11px] md:text-xs font-black transition whitespace-nowrap cursor-pointer border-none flex items-center justify-center gap-1.5 ${
                activeDashboardTab === "matching"
                  ? "bg-brand-primary text-white"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-655 dark:text-slate-355 hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
              }`}
            >
              <FaBriefcase className="text-sm" /> Smart Matching
            </button>
            <button
              onClick={() => setActiveDashboardTab("gap")}
              className={`px-2 py-2.5 md:px-4 md:py-2 rounded-xl text-[11px] md:text-xs font-black transition whitespace-nowrap cursor-pointer border-none flex items-center justify-center gap-1.5 ${
                activeDashboardTab === "gap"
                  ? "bg-brand-primary text-white"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-655 dark:text-slate-355 hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
              }`}
            >
              <FaGraduationCap className="text-sm" /> Skill Gap Analysis
            </button>
            <button
              onClick={() => setActiveDashboardTab("prep")}
              className={`px-2 py-2.5 md:px-4 md:py-2 rounded-xl text-[11px] md:text-xs font-black transition whitespace-nowrap cursor-pointer border-none flex items-center justify-center gap-1.5 ${
                activeDashboardTab === "prep"
                  ? "bg-brand-primary text-white"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-655 dark:text-slate-355 hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
              }`}
            >
              <FaClipboardList className="text-sm" /> Interview Prep
            </button>
            <button
              onClick={() => setActiveDashboardTab("coach")}
              className={`px-2 py-2.5 md:px-4 md:py-2 rounded-xl text-[11px] md:text-xs font-black transition whitespace-nowrap cursor-pointer border-none flex items-center justify-center gap-1.5 ${
                activeDashboardTab === "coach"
                  ? "bg-brand-primary text-white"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-655 dark:text-slate-355 hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
              }`}
            >
              <FaComments className="text-sm" /> Career Coach
            </button>
            <button
              onClick={() => setActiveDashboardTab("premium")}
              className={`px-2 py-2.5 md:px-4 md:py-2 rounded-xl text-[11px] md:text-xs font-black transition whitespace-nowrap cursor-pointer border flex items-center justify-center gap-1.5 border-none ${
                activeDashboardTab === "premium"
                  ? "bg-amber-500 text-white"
                  : "bg-amber-100 dark:bg-amber-955/20 text-amber-700 dark:text-amber-400 hover:bg-amber-200/50"
              }`}
            >
              <FaCrown className="text-sm" /> Premium VIP
            </button>
          </div>
        </div>

        {/* ==================== TAB 1: OVERVIEW ==================== */}
        {activeDashboardTab === "overview" && (
          <div className="space-y-6 animate-fade-in text-left">
            {/* Banner Greeting */}
            <div className="relative overflow-hidden bg-gradient-to-r from-brand-primary to-brand-secondary p-6 sm:p-8 md:p-10 rounded-[2rem] text-white shadow-xl">
              <div className="absolute right-0 top-0 w-1/3 h-full bg-white/5 backdrop-blur-[2px] rounded-l-[10rem] pointer-events-none transform translate-x-12 translate-y-2 hidden md:block" />
              <div className="relative z-10 max-w-2xl space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
                  Welcome Back, {user?.name || "Job Seeker"}! 👋
                </h1>
                <p className="text-white/85 text-sm sm:text-base md:text-lg leading-relaxed">
                  Track your active job applications, optimize your professional resume score, and browse verified listings from top recruiters.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate('/jobs')}
                    className="px-5 py-2.5 bg-white text-brand-primary font-bold rounded-xl shadow-md hover:bg-slate-50 transition active:scale-95 text-sm cursor-pointer border-none"
                  >
                    Browse Jobs
                  </button>
                  <button
                    onClick={() => navigate('/resume')}
                    className="px-5 py-2.5 bg-brand-primary-hover text-white font-bold rounded-xl shadow-md hover:bg-brand-primary transition border border-white/20 active:scale-95 text-sm cursor-pointer border-none"
                  >
                    Build & Optimize Resume
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-6">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  onClick={stat.onClick}
                  className={`bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 border-t-4 ${stat.borderClass} p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition duration-300 flex items-center justify-between gap-2.5 sm:gap-4 ${stat.onClick ? 'cursor-pointer active:scale-95' : ''}`}
                >
                  <div className="space-y-0.5 sm:space-y-1 min-w-0">
                    <p className="text-slate-405 dark:text-slate-505 text-[10px] sm:text-xs font-black uppercase tracking-wider truncate">
                      {stat.label}
                    </p>
                    <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-white leading-tight">
                      {stat.value}
                    </h3>
                  </div>
                  <div className={`text-sm sm:text-xl p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl ${stat.color} shrink-0`}>
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Middle Two-Column Section */}
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
              
              {/* Profile Completeness Checklist (1 Column) */}
              <div className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 border-t-4 border-t-brand-primary p-6 rounded-[2rem] shadow-sm flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-black mb-1 text-slate-800 dark:text-white">Profile Strength</h2>
                  <p className="text-slate-400 dark:text-slate-505 text-xs mb-5">Complete your profile details to rank higher in recruiter searches.</p>
                  
                  {/* Strength Progress Bar */}
                  <div className="mb-6 space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-brand-primary">{strength}% Setup Complete</span>
                      <span className="text-slate-405 dark:text-slate-505">{strength === 100 ? "Ready to Apply! 🚀" : `${100 - strength}% left`}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-500 rounded-full" 
                        style={{ width: `${strength}%` }}
                      />
                    </div>
                  </div>

                  {/* Checklist details */}
                  <div className="space-y-4">
                    {checklist.map((item, idx) => {
                      const isDone = item.value && String(item.value).trim() !== ""
                      return (
                        <div 
                          key={idx} 
                          onClick={() => window.dispatchEvent(new Event("open-profile"))} 
                          className={`flex items-start gap-3 p-2.5 rounded-2xl border transition duration-200 cursor-pointer ${
                            isDone 
                              ? 'border-emerald-100/50 dark:border-emerald-950/20 bg-emerald-50/10 dark:bg-emerald-955/5 hover:bg-emerald-50/20 dark:hover:bg-emerald-955/10' 
                              : 'border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/10 hover:border-brand-primary/20 dark:hover:border-brand-primary/20 hover:bg-slate-50 dark:hover:bg-slate-950/30'
                          }`}
                        >
                          {isDone ? (
                            <FaCheckCircle className="text-emerald-500 text-lg mt-0.5 shrink-0" />
                          ) : (
                            <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-355 dark:border-slate-700 mt-0.5 shrink-0" />
                          )}
                          <div>
                            <h4 className={`text-sm font-bold ${isDone ? 'text-slate-755 dark:text-slate-300' : 'text-slate-505 dark:text-slate-400'}`}>
                              {item.label}
                            </h4>
                            {!isDone && (
                              <p className="text-[11px] text-brand-primary font-medium hover:underline mt-0.5">
                                {item.desc}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {strength === 100 && (
                  <div className="mt-6 p-3 bg-brand-secondary/10 dark:bg-brand-secondary/5 rounded-2xl text-center text-xs font-bold text-brand-secondary">
                    Your profile is 100% complete. You look amazing! ✨
                  </div>
                )}
              </div>

              {/* Applications List Tracker (2 Columns) */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 border-t-4 border-t-brand-secondary p-6 rounded-[2rem] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center gap-2 mb-1">
                    <h2 className="text-base sm:text-xl font-black text-slate-850 dark:text-white truncate whitespace-nowrap">
                      Applications Status Tracker
                    </h2>
                    {appsArray.length > 0 && (
                      <button 
                        onClick={() => navigate('/appliedJobs')} 
                        className="text-xs font-black text-brand-primary hover:underline hover:text-brand-primary-hover flex items-center gap-1 cursor-pointer border-none bg-transparent whitespace-nowrap shrink-0"
                      >
                        View All
                      </button>
                    )}
                  </div>
                  <p className="text-slate-400 dark:text-slate-505 text-xs mb-5">Updates on the jobs you've applied to recently.</p>

                  {loading ? (
                    <div className="flex flex-col justify-center items-center h-48 gap-3">
                      <FaSpinner className="animate-spin text-3xl text-brand-primary" />
                      <span className="text-xs font-bold text-slate-400">Fetching applications...</span>
                    </div>
                  ) : error ? (
                    <div className="p-6 text-center text-xs font-bold text-rose-500 bg-rose-50/50 dark:bg-rose-955/10 rounded-2xl border border-rose-100 dark:border-rose-950/20">
                      {error}
                    </div>
                  ) : appsArray.length === 0 ? (
                    <div className="p-8 text-center space-y-4">
                      <div className="w-14 h-14 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-505 text-2xl mx-auto">
                        <FaBriefcase />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white">No Active Applications</h4>
                        <p className="text-slate-400 dark:text-slate-550 text-xs max-w-xs mx-auto">Browse through our open vacancies and find the best fit for your skills.</p>
                      </div>
                      <button
                        onClick={() => navigate('/jobs')}
                        className="px-5 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95 cursor-pointer border-none"
                      >
                        Explore Job Vacancies
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                      {appsArray.slice(0, 5).map((app) => {
                        if (!app) return null
                        const job = app.jobId || {}
                        return (
                          <div 
                            key={app._id}
                            className="p-4 bg-slate-50/50 dark:bg-slate-955/20 border border-slate-100/50 dark:border-slate-800/80 rounded-2xl hover:border-slate-200/60 dark:hover:border-slate-700/60 hover:bg-white dark:hover:bg-slate-900/60 transition duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-left"
                          >
                            <div className="space-y-1 min-w-0">
                              <h4 className="text-sm font-black text-slate-800 dark:text-white truncate max-w-[200px] sm:max-w-[300px]">
                                {job.title || "Unknown Job Position"}
                              </h4>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 dark:text-slate-505">
                                <span className="font-semibold text-slate-755 dark:text-slate-355">{job.company || "N/A"}</span>
                                {job.location && (
                                  <span className="flex items-center gap-1">
                                    <FaMapMarkerAlt className="text-[10px]" /> {job.location}
                                  </span>
                                )}
                                {job.salary && (
                                  <span className="flex items-center gap-0.5 text-brand-secondary font-bold">
                                    <FaRupeeSign className="text-[9px]" /> {job.salary}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex sm:flex-col items-start sm:items-end gap-2 w-full sm:w-auto justify-between sm:justify-start">
                              {getStatusBadge(app.status)}
                              <span className="text-[10px] text-slate-400 dark:text-slate-505 flex items-center gap-1">
                                <FaCalendarAlt className="text-[9px]" /> {formatDate(app.appliedAt)}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
                
                {appsArray.length > 5 && (
                  <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800/50 mt-4">
                    <span className="text-xs text-slate-400 dark:text-slate-550 font-semibold">
                      Showing top 5 of {appsArray.length} applications
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Navigation Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div
                onClick={() => navigate('/jobs')}
                className="group relative overflow-hidden bg-gradient-to-br from-brand-primary to-blue-700 p-6 rounded-[2rem] text-white shadow-lg cursor-pointer hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between min-h-[160px] text-left"
              >
                <div className="relative z-10">
                  <h3 className="text-base sm:text-xl font-bold mb-2 truncate whitespace-nowrap">Browse Job Openings</h3>
                  <p className="text-white/80 text-xs leading-relaxed max-w-[200px]">Explore remote, full-time and freelance roles matching your skillset.</p>
                </div>
                <div className="relative z-10 flex items-center gap-2 font-bold text-xs group-hover:gap-4 transition-all">
                  Explore Now <FaArrowRight />
                </div>
                <FaBriefcase className="absolute -bottom-4 -right-4 text-[7rem] text-white/10 -rotate-12 pointer-events-none z-0" />
              </div>

              <div
                onClick={() => navigate('/resume')}
                className="group relative overflow-hidden bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 border-t-4 border-t-brand-accent p-6 rounded-[2rem] text-slate-855 dark:text-white shadow-sm hover:shadow-md hover:border-brand-accent hover:-translate-y-1 transition duration-300 flex flex-col justify-between min-h-[160px] text-left cursor-pointer"
              >
                <div className="relative z-10">
                  <h3 className="text-base sm:text-xl font-bold mb-2 truncate whitespace-nowrap">AI Resume Builder & Optimizer</h3>
                  <p className="text-slate-400 dark:text-slate-550 text-xs leading-relaxed max-w-[240px]">
                    Build a professional ATS-friendly resume from scratch with AI assistance, or upload & optimize your files.
                  </p>
                </div>
                <div className="relative z-10 flex items-center gap-2 font-bold text-xs text-[#F59E0B] group-hover:gap-4 transition-all">
                  Build & Optimize <FaArrowRight />
                </div>
                <FaFileAlt className="absolute -bottom-4 -right-4 text-[7rem] text-slate-100 dark:text-slate-800/20 -rotate-12 pointer-events-none z-0" />
              </div>

              <div
                onClick={() => window.dispatchEvent(new Event("open-profile"))}
                className="group relative overflow-hidden bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 border-t-4 border-t-brand-secondary p-6 rounded-[2rem] text-slate-855 dark:text-white shadow-sm hover:shadow-md hover:border-brand-secondary hover:-translate-y-1 transition duration-300 flex flex-col justify-between min-h-[160px] text-left cursor-pointer"
              >
                <div className="relative z-10">
                  <h3 className="text-base sm:text-xl font-bold mb-2 truncate whitespace-nowrap">Edit Account Profile</h3>
                  <p className="text-slate-400 dark:text-slate-550 text-xs leading-relaxed max-w-[200px]">Add experience, bio, details, skills and download profiles.</p>
                </div>
                <div className="relative z-10 flex items-center gap-2 font-bold text-xs text-brand-secondary group-hover:gap-4 transition-all">
                  Update Profile <FaArrowRight />
                </div>
                <FaUserCircle className="absolute -bottom-4 -right-4 text-[7rem] text-slate-100 dark:text-slate-800/20 -rotate-12 pointer-events-none z-0" />
              </div>
            </div>

            {/* Footer Support Info */}
            <div className="p-5 bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 border-t-4 border-t-brand-secondary rounded-2xl shadow-sm text-center">
              <p className="text-xs text-slate-405 dark:text-slate-550">
                Need additional assistance? Access our{" "}
                <span 
                  onClick={handleResourceHubClick}
                  className="text-brand-primary font-bold cursor-pointer hover:underline"
                >
                  Career Resource Hub
                </span>
                {" "}or{" "}
                <span 
                  onClick={handleReachSupportClick}
                  className="text-brand-primary font-bold cursor-pointer hover:underline"
                >
                  Reach Support
                </span>.
              </p>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: SMART MATCHING ==================== */}
        {activeDashboardTab === "matching" && (
          <div className="space-y-6 text-left animate-fade-in">
            <div className="p-6 bg-white dark:bg-slate-900/40 border border-slate-250 dark:border-slate-800 rounded-3xl space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">AI-Powered Smart Job Matcher</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-405 font-medium">
                Our proprietary alignment algorithm maps your registered skills against live roles in the CareerBridge network, detailing match criteria percentages and gaps.
              </p>
              {userSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 items-center pt-2">
                  <span className="text-xs font-black text-slate-455">Your Scored Skills:</span>
                  {userSkills.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary-light rounded-lg text-xs font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="p-3.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-semibold mt-2">
                  ⚠️ No skills found. Head to "Edit Account Profile" to list your tech stack to activate full algorithm mapping.
                </div>
              )}
            </div>

            {jobsLoading ? (
              <div className="flex flex-col justify-center items-center h-48 gap-3">
                <FaSpinner className="animate-spin text-3xl text-brand-primary" />
                <span className="text-xs font-bold text-slate-400">Comparing profile with current job database...</span>
              </div>
            ) : matchedJobs.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-3xl">
                <p className="text-slate-405 text-sm font-bold">No job positions found in the directory.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {matchedJobs.map((job) => {
                  const isApplied = appliedIds.includes(job._id)
                  // Exclusive check for premium jobs
                  const needsUpgradeToApply = job.isPremium && !isPremiumUser

                  return (
                    <div 
                      key={job._id}
                      className={`bg-white dark:bg-slate-900/40 border-2 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between ${
                        job.isPremium 
                          ? 'border-amber-400 dark:border-amber-550/60 bg-amber-500/[0.01]' 
                          : 'border-slate-200/60 dark:border-slate-800'
                      }`}
                    >
                      <div className="space-y-4">
                        {/* Title, Badge & Match Score Header */}
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="text-lg font-black text-slate-800 dark:text-white line-clamp-1">{job.title}</h3>
                              {job.isPremium && (
                                <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5">
                                  👑 PREMIUM VIP
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-brand-primary mt-0.5">{job.company}</p>
                          </div>

                          {/* Match score circle index */}
                          <div className="relative shrink-0 flex items-center justify-center w-14 h-14 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200/40 dark:border-slate-800">
                            <div className="text-center">
                              <p className={`text-base font-black ${
                                job.matchScore >= 80 ? 'text-emerald-500' : job.matchScore >= 50 ? 'text-amber-500' : 'text-slate-400'
                              }`}>
                                {job.matchScore}%
                              </p>
                              <p className="text-[7px] font-extrabold uppercase tracking-wider text-slate-400">Match</p>
                            </div>
                          </div>
                        </div>

                        {/* Location, Salary & Type */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-550 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt /> {job.location || "Remote"}
                          </span>
                          <span className="flex items-center gap-0.5 text-brand-secondary font-bold">
                            <FaRupeeSign /> {job.salary}
                          </span>
                          {job.jobType && (
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-black text-[9px] uppercase tracking-wider">
                              {job.jobType}
                            </span>
                          )}
                        </div>

                        {/* Matching details breakdown */}
                        <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/40 pt-3 text-xs">
                          {/* Matched tags */}
                          {job.matchedSkills.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Matched Skills ({job.matchedSkills.length})</span>
                              <div className="flex flex-wrap gap-1">
                                {job.matchedSkills.map((s, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 rounded-md text-[10px] font-bold">
                                    ✓ {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Missing tags */}
                          {job.missingSkills.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">Skill Gaps ({job.missingSkills.length})</span>
                              <div className="flex flex-wrap gap-1">
                                {job.missingSkills.map((s, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-amber-50 text-amber-600 dark:bg-amber-955/20 dark:text-amber-400 rounded-md text-[10px] font-bold">
                                    + {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Apply button container */}
                      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/40">
                        {isApplied ? (
                          <div className="w-full py-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold text-center text-xs flex items-center justify-center gap-1.5 border border-emerald-100/50 dark:border-emerald-900/30 select-none">
                            <FaCheckCircle /> Applied to Listing
                          </div>
                        ) : needsUpgradeToApply ? (
                          <button
                            onClick={() => {
                              setActiveDashboardTab("premium")
                              toast("Upgrade to premium membership to unlock apply features for VIP roles!", { icon: "👑" })
                            }}
                            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black rounded-xl text-xs transition active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer border-none"
                          >
                            <FaCrown /> Unlock with Premium VIP
                          </button>
                        ) : (
                          <button
                            onClick={() => handleQuickApply(job._id)}
                            disabled={applyLoadingId === job._id}
                            className="w-full py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl text-xs transition active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 border-none"
                          >
                            {applyLoadingId === job._id ? (
                              <FaSpinner className="animate-spin text-sm" />
                            ) : (
                              <>⚡ One-Click Profile Apply</>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 3: SKILL GAP ANALYSIS ==================== */}
        {activeDashboardTab === "gap" && (
          <div className="space-y-6 text-left animate-fade-in">
            <div className="p-6 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <FaGraduationCap className="text-brand-primary" /> Personalized Skill Gap Analyzer
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                We scanned target requirements of matching jobs and compiled top missing credentials. Mark any skill as completed to automatically add it to your profile and rank higher.
              </p>
            </div>

            {skillGaps.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2">
                <FaCheckCircle className="text-emerald-500 text-4xl mx-auto" />
                <h3 className="text-lg font-black text-slate-800 dark:text-white">Zero Gaps Detected! 🎉</h3>
                <p className="text-xs text-slate-405 max-w-sm mx-auto font-medium">Excellent! Your listed professional skills fully map to all available matching jobs. Keep applying!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider">Identified Missing Skills ({skillGaps.length})</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {skillGaps.slice(0, 8).map((gap, idx) => {
                    const links = getResourceLinks(gap.name)
                    const isLearned = learnedSkills.includes(gap.name)

                    return (
                      <div 
                        key={idx}
                        className={`bg-white dark:bg-slate-900/40 border rounded-3xl p-5 shadow-sm flex flex-col justify-between transition duration-200 ${
                          isLearned ? 'border-emerald-500/50 bg-emerald-500/[0.01]' : 'border-slate-200/60 dark:border-slate-800'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-base font-black text-slate-800 dark:text-white capitalize">{gap.name}</h4>
                              <p className="text-[10px] font-bold text-amber-500 dark:text-amber-400 uppercase tracking-wide mt-0.5">
                                Required in {gap.count} matching {gap.count === 1 ? 'job' : 'jobs'}
                              </p>
                            </div>
                            
                            {isLearned ? (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 rounded-md text-[10px] font-black uppercase tracking-wider">
                                Learned ✓
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-rose-50 text-rose-500 dark:bg-rose-955/20 dark:text-rose-400 rounded-md text-[10px] font-black uppercase tracking-wider">
                                Gap Detail
                              </span>
                            )}
                          </div>

                          {/* Free Resources grid */}
                          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/40">
                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-405 block">Curated Learning Material</span>
                            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                              <a 
                                href={links.tutorial}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl hover:bg-brand-primary/10 hover:text-brand-primary transition block text-slate-655 dark:text-slate-355 text-decoration-none"
                              >
                                <FaBookOpen className="mx-auto mb-1 text-xs" /> Docs & Guides
                              </a>
                              <a 
                                href={links.video}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 bg-slate-50 dark:bg-slate-955 rounded-xl hover:bg-brand-primary/10 hover:text-brand-primary transition block text-slate-655 dark:text-slate-355 text-decoration-none"
                              >
                                <FaLightbulb className="mx-auto mb-1 text-xs" /> freeCourse
                              </a>
                              <a 
                                href={links.guide}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl hover:bg-brand-primary/10 hover:text-brand-primary transition block text-slate-655 dark:text-slate-355 text-decoration-none"
                              >
                                <FaChartLine className="mx-auto mb-1 text-xs" /> Roadmap
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Learning trigger */}
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/40">
                          {isLearned ? (
                            <button
                              disabled
                              className="w-full py-2 bg-emerald-50 dark:bg-emerald-955/20 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 select-none border border-emerald-100/50 dark:border-emerald-900/30"
                            >
                              <FaCheck /> Added to Profile skills
                            </button>
                          ) : (
                            <button
                              onClick={() => handleLearnSkill(gap.name)}
                              className="w-full py-2 border border-brand-primary/20 dark:border-slate-800 hover:border-brand-primary text-brand-primary dark:text-brand-primary-light hover:bg-brand-primary hover:text-white rounded-xl font-bold text-xs transition active:scale-95 cursor-pointer bg-transparent"
                            >
                              ✓ Mark as Learned & Add to Profile
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 4: INTERVIEW PREP ==================== */}
        {activeDashboardTab === "prep" && (
          <div className="space-y-6 text-left animate-fade-in">
            {/* Top overview widget */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 p-6 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <FaClipboardList className="text-brand-primary" /> Technical Mock Prep Hub
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Challenge yourself with real developer interview questions compiled by senior leads. Score your readiness by reviewing answers and mastering key concepts.
                  </p>
                </div>
                
                {/* Readiness indicator */}
                <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800/40">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-brand-primary">Mock Interview Readiness: {prepProgressPercent}%</span>
                    <span className="text-slate-405 dark:text-slate-505">{masteredCount} of {activeQuestions.length} mastered</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-300 rounded-full" 
                      style={{ width: `${prepProgressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Timer & star framework checklist */}
              <div className="p-6 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col justify-between text-center space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-405 tracking-wider block">Timed Answer Simulation</span>
                  <div className="flex items-center justify-center gap-2">
                    <FaClock className={`text-xl ${prepTimerActive ? 'text-brand-primary animate-spin' : 'text-slate-400'}`} />
                    <span className={`text-3xl font-black tabular-nums ${prepTimerSeconds <= 20 ? 'text-rose-500 animate-pulse' : 'text-slate-855 dark:text-white'}`}>
                      {Math.floor(prepTimerSeconds / 60)}:{(prepTimerSeconds % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={startPrepTimer}
                    disabled={prepTimerActive}
                    className="w-1/2 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-50 border-none"
                  >
                    Start Timer
                  </button>
                  <button 
                    onClick={() => { setPrepTimerActive(false); setPrepTimerSeconds(120); }}
                    className="w-1/2 py-2 border border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-355 text-xs font-bold rounded-xl transition cursor-pointer bg-transparent"
                  >
                    Reset
                  </button>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-2xl text-[10px] text-left leading-relaxed text-slate-500 font-medium">
                  ⚡ <strong>Tip</strong>: Answer using the STAR approach (Situation, Task, Action, Result) in under 2 minutes.
                </div>
              </div>
            </div>

            {/* Role selector filters */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 select-none">
              {Object.keys(prepQuestions).map((roleKey) => (
                <button
                  key={roleKey}
                  onClick={() => {
                    setSelectedPrepRole(roleKey)
                    setRevealedAnswers({})
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-black capitalize transition cursor-pointer border-none ${
                    selectedPrepRole === roleKey
                      ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/30"
                      : "bg-transparent text-slate-405 hover:text-slate-855 dark:hover:text-white"
                  }`}
                >
                  {roleKey}
                </button>
              ))}
            </div>

            {/* Questions lists */}
            <div className="space-y-4">
              {activeQuestions.map((qObj, idx) => {
                const isRevealed = revealedAnswers[idx]
                const isMastered = masteredQuestions[idx]

                return (
                  <div 
                    key={idx}
                    className={`bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-855 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 transition ${
                      isMastered ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-brand-primary'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Question {idx + 1}</span>
                        <h4 className="text-base font-bold text-slate-855 dark:text-white leading-snug">{qObj.q}</h4>
                      </div>

                      <button
                        onClick={() => toggleMastered(idx)}
                        className={`p-1.5 rounded-xl border transition active:scale-95 shrink-0 cursor-pointer ${
                          isMastered 
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                            : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-655 bg-transparent'
                        }`}
                        title="Mark as Mastered"
                      >
                        <FaCheckCircle className="text-base" />
                      </button>
                    </div>

                    {/* Expandable answers */}
                    {isRevealed && (
                      <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-655 dark:text-slate-350 leading-relaxed whitespace-pre-line animate-fade-in">
                        <p className="font-extrabold text-slate-855 dark:text-white mb-2">⭐ Suggested Answer Guidance:</p>
                        {qObj.a}
                      </div>
                    )}

                    <div className="flex justify-between items-center gap-4 pt-1.5">
                      <button
                        onClick={() => toggleAnswer(idx)}
                        className="text-xs font-bold text-brand-primary hover:underline hover:text-brand-primary-hover border-none bg-transparent cursor-pointer"
                      >
                        {isRevealed ? "Hide Answer Details" : "Reveal Answer Details"}
                      </button>
                      
                      <span className="text-[10px] text-slate-400 font-semibold italic">
                        {isMastered ? "Mastered Concept" : "Pending Revision"}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB 5: CAREER COACHING (CHATBOT) ==================== */}
        {activeDashboardTab === "coach" && (
          <div className="space-y-6 text-left animate-fade-in">
            <div className="p-6 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <FaComments className="text-brand-primary" /> BridgeAI Career Guidance Advisor
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                Engage in interactive technical planning and career reviews with Coach Bridgey. Ask custom questions or run prompt configurations.
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-6 items-start">
              {/* Left templates column */}
              <div className="space-y-3 lg:col-span-1 select-none text-left">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Suggested Career Prompts</span>
                <div className="flex flex-col gap-2.5">
                  {Object.entries(coachTemplates).map(([key, promptText]) => (
                    <button
                      key={key}
                      onClick={() => handleCoachMessageSubmit(promptText)}
                      className="p-3 text-xs text-left bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 rounded-2xl hover:border-brand-primary hover:bg-slate-50 dark:hover:bg-slate-950/40 transition font-bold leading-normal text-slate-755 dark:text-slate-355 cursor-pointer"
                    >
                      {promptText}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Thread layout */}
              <div className="lg:col-span-3 bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 rounded-3xl flex flex-col h-[520px] shadow-sm relative overflow-hidden">
                {/* Chat Header */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center text-lg shrink-0">
                    <FaUserTie />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-black text-slate-800 dark:text-white">Coach Bridgey</h4>
                    <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 select-none"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Active AI Advisor</p>
                  </div>
                </div>

                {/* Chat Message Scroll */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {coachMessages.map((msg, idx) => (
                    <div 
                      key={idx}
                      className={`flex flex-col max-w-[85%] ${
                        msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                      }`}
                    >
                      <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line text-left ${
                        msg.sender === "user" 
                          ? "bg-brand-primary text-white rounded-tr-none" 
                          : "bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-300 rounded-tl-none"
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 select-none">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}

                  {/* Typing placeholder */}
                  {isCoachTyping && (
                    <div className="mr-auto items-start max-w-[85%] flex flex-col">
                      <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl rounded-tl-none flex items-center gap-1 select-none">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input container */}
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleCoachMessageSubmit(coachInput); }}
                  className="p-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/60 dark:border-slate-800 flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Type your question for Coach Bridgey..."
                    value={coachInput}
                    onChange={(e) => setCoachInput(e.target.value)}
                    className="flex-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-primary"
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl flex items-center justify-center shrink-0 border-none cursor-pointer"
                  >
                    <FaRegPaperPlane className="text-sm" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 6: PREMIUM VIP MEMBERSHIP ==================== */}
        {activeDashboardTab === "premium" && (
          <div className="space-y-6 text-left animate-fade-in">
            {/* Promo card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-[2rem] p-6 sm:p-10 shadow-xl border-2 border-amber-500/30 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="space-y-4 max-w-xl text-left">
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-500/30 inline-flex items-center gap-1 select-none">
                  <FaCrown /> Premium Upgrade Tier
                </span>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">Become a CareerBridge Gold Member</h2>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Gain instant access to recruiter-prioritized premium listings with 40%+ higher salary indices, priority application support, custom gap roadmap materials, and a gold account crown credential.
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                  <div className="flex items-center gap-2 text-slate-300">
                    <FaCheck className="text-amber-500" /> Exclusive High-Paying Jobs
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <FaCheck className="text-amber-500" /> Crown Profile Badge
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <FaCheck className="text-amber-500" /> Pre-approved Application Match
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <FaCheck className="text-amber-500" /> Priority Support Lines
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl text-center min-w-[200px] w-full md:w-auto shrink-0 shadow-lg">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">All-inclusive VIP Pass</p>
                <div className="py-3">
                  <span className="text-3xl font-black text-amber-400">₹499</span>
                  <span className="text-xs text-slate-405 font-semibold"> / month</span>
                </div>
                
                {isPremiumUser ? (
                  <div className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 select-none shadow-md">
                    <FaCheckCircle /> VIP Subscription Active
                  </div>
                ) : (
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black rounded-xl text-xs transition active:scale-95 shadow-lg cursor-pointer border-none"
                  >
                    Upgrade to VIP Pass
                  </button>
                )}
                <p className="text-[9px] text-slate-500 mt-2 font-medium">Cancel anytime with 1-click subscription panel</p>
              </div>
            </div>

            {/* Premium Job Listings container */}
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider">Premium VIP Job Board Listings ({matchedJobs.filter(j => j.isPremium).length})</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {matchedJobs.filter(job => job.isPremium).map((job) => {
                  const isApplied = appliedIds.includes(job._id)
                  const needsUpgrade = !isPremiumUser

                  return (
                    <div 
                      key={job._id}
                      className="bg-white dark:bg-slate-900/40 border-2 border-amber-400 dark:border-amber-500/60 bg-amber-500/[0.01] rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="text-base font-black text-slate-800 dark:text-white">{job.title}</h4>
                              <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-955 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5">
                                👑 VIP MATCH
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-brand-primary mt-0.5">{job.company}</p>
                          </div>

                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-955/20 dark:text-emerald-400 rounded-md text-[10px] font-black uppercase tracking-wider shrink-0 select-none">
                            {job.matchScore}% Score
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-405">
                          <span className="flex items-center gap-1"><FaMapMarkerAlt /> {job.location}</span>
                          <span className="flex items-center gap-0.5 text-brand-secondary font-bold"><FaRupeeSign /> {job.salary}</span>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed border-t border-slate-100 dark:border-slate-800/40 pt-3">
                          {job.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/40">
                        {isApplied ? (
                          <div className="w-full py-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold text-center text-xs flex items-center justify-center gap-1.5 border border-emerald-100/50 select-none">
                            <FaCheckCircle /> Applied Successfully
                          </div>
                        ) : needsUpgrade ? (
                          <button
                            onClick={() => {
                              setShowUpgradeModal(true)
                              toast("Upgrade to VIP Gold Membership to submit your application for this priority role!", { icon: "👑" })
                            }}
                            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-500 text-slate-955 font-black rounded-xl text-xs transition active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer border-none"
                          >
                            <FaCrown /> Unlock VIP Application
                          </button>
                        ) : (
                          <button
                            onClick={() => handleQuickApply(job._id)}
                            disabled={applyLoadingId === job._id}
                            className="w-full py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl text-xs transition active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 border-none"
                          >
                            {applyLoadingId === job._id ? <FaSpinner className="animate-spin text-sm" /> : <>⚡ Apply instantly as VIP</>}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Career Resources Modal */}
      {isHubOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-2xl w-full relative max-h-[85vh] overflow-y-auto text-slate-800 dark:text-slate-200 text-left">
            <button
              onClick={() => setIsHubOpen(false)}
              className="absolute top-2.5 right-2.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer z-50"
              aria-label="Close hub modal"
            >
              <HiX className="text-xl stroke-[3px]" />
            </button>

            <div className="mb-6">
              <h3 className="text-2xl font-black text-slate-855 dark:text-white">Career Resource Hub</h3>
              <p className="text-xs text-slate-405 dark:text-slate-500 mt-1">Free tips and strategies directly on-screen to guide your career path.</p>
            </div>

            {/* Tab select headers */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 mb-6 gap-2 select-none">
              <button
                type="button"
                onClick={() => setActiveTab("resume")}
                className={`pb-3 text-xs font-black tracking-wider uppercase border-b-2 transition cursor-pointer ${
                  activeTab === "resume" 
                    ? "border-brand-primary text-brand-primary" 
                    : "border-transparent text-slate-400 hover:text-slate-655 dark:hover:text-slate-200"
                }`}
              >
                Resume Guide
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("interview")}
                className={`pb-3 text-xs font-black tracking-wider uppercase border-b-2 transition cursor-pointer ${
                  activeTab === "interview" 
                    ? "border-brand-primary text-brand-primary" 
                    : "border-transparent text-slate-400 hover:text-slate-655 dark:hover:text-slate-200"
                }`}
              >
                Interview Excellence
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("skills")}
                className={`pb-3 text-xs font-black tracking-wider uppercase border-b-2 transition cursor-pointer ${
                  activeTab === "skills" 
                    ? "border-brand-primary text-brand-primary" 
                    : "border-transparent text-slate-400 hover:text-slate-655 dark:hover:text-slate-200"
                }`}
              >
                Marketable Skills
              </button>
            </div>

            {/* Tab content wrapper */}
            <div className="space-y-4 text-sm text-slate-655 dark:text-slate-350 leading-relaxed min-h-[180px]">
              {activeTab === "resume" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 dark:text-white">Resume Writing Standards</h4>
                  <ul className="list-disc pl-5 space-y-2 text-xs">
                    <li><strong>Rule of One Page:</strong> Unless you have 5+ years of relevant industry experience, keep your resume strictly to a single page.</li>
                    <li><strong>Action & Results:</strong> Use action verbs and metric results. Instead of "Responsible for writing code", use "Engineered modular React components resulting in a 15% loading speed increase".</li>
                    <li><strong>ATS Compatibility:</strong> Avoid graphics, tables, or text boxes inside columns as they can confuse Applicant Tracking System (ATS) parsers. Use standard fonts like Inter, Arial, or Georgia.</li>
                    <li><strong>Order of Experience:</strong> List experience in reverse-chronological order (most recent job first).</li>
                  </ul>
                </div>
              )}

              {activeTab === "interview" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-805 dark:text-white">Acing Your Job Interviews</h4>
                  <ul className="list-disc pl-5 space-y-2 text-xs">
                    <li><strong>The STAR Framework:</strong> Answer behavioral questions by outlining the <strong>S</strong>ituation, the <strong>T</strong>ask at hand, the <strong>A</strong>ction you implemented, and the final <strong>R</strong>esult.</li>
                    <li><strong>First Impressions:</strong> Prepare a 90-second "Tell me about yourself" overview focusing strictly on your career achievements and skill relevance.</li>
                    <li><strong>Company Deep-Dive:</strong> Research the company's recent news, product launches, and company values before stepping into the room. Ask targeted questions at the end of the call.</li>
                  </ul>
                </div>
              )}

              {activeTab === "skills" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-805 dark:text-white">Skills in High Demand</h4>
                  <ul className="list-disc pl-5 space-y-2 text-xs">
                    <li><strong>Frontend Development:</strong> High proficiency in React, TypeScript, Tailwind CSS, and headless CSS architectures is sought after in early-stage startups and corporations.</li>
                    <li><strong>Backend & Databases:</strong> Skills in Node.js, Express, databases (MongoDB, PostgreSQL), and cloud orchestration platforms (AWS, Docker) are key core competencies.</li>
                    <li><strong>Soft Skills:</strong> Clear asynchronous documentation, technical communication, and collaborative Git workflow management are highly valued.</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
              <button
                type="button"
                onClick={() => setIsHubOpen(false)}
                className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl text-xs transition cursor-pointer border-none"
              >
                Close Resources
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Request Modal */}
      {isSupportOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md w-full relative text-slate-800 dark:text-slate-200 text-left">
            <button
              onClick={() => setIsSupportOpen(false)}
              className="absolute top-2.5 right-2.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer z-50"
              aria-label="Close support modal"
            >
              <HiX className="text-xl stroke-[3px]" />
            </button>
            
            <div className="mb-6">
              <h3 className="text-2xl font-black text-slate-855 dark:text-white">Reach Support</h3>
              <p className="text-xs text-slate-405 dark:text-slate-500 mt-1">Get direct assistance from the CareerBridge helpdesk team.</p>
            </div>

            <form onSubmit={handleSupportSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Your Contact Email</label>
                <input 
                  type="email" 
                  value={user?.email || ""} 
                  disabled 
                  className="w-full bg-slate-50 dark:bg-slate-955/50 border border-slate-200 dark:border-slate-800/80 p-2.5 rounded-xl text-xs text-slate-455 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Subject</label>
                <input 
                  type="text" 
                  placeholder="e.g. Resume tool help" 
                  value={supportForm.subject}
                  onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                  className="w-full bg-white dark:bg-slate-955 border border-slate-305 dark:border-slate-805 p-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Message Description</label>
                <textarea 
                  rows="4" 
                  placeholder="Describe your issue or query..." 
                  value={supportForm.message}
                  onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                  className="w-full bg-white dark:bg-slate-955 border border-slate-305 dark:border-slate-805 p-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSupportOpen(false)}
                  className="w-1/2 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-55 dark:hover:bg-slate-800 rounded-xl font-bold transition text-xs cursor-pointer bg-transparent"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  loading={submitLoading}
                  className="w-1/2 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-bold text-xs border-none cursor-pointer"
                >
                  Submit Ticket
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simulated Premium Billing Modal Overlay */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md w-full relative text-slate-800 dark:text-slate-200 text-left">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-2.5 right-2.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer z-50"
              aria-label="Close billing modal"
            >
              <HiX className="text-xl stroke-[3px]" />
            </button>

            <div className="mb-5 flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-lg">
                <FaCrown />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-855 dark:text-white">Secure Checkout</h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Upgrade to VIP Account • ₹499/mo</p>
              </div>
            </div>

            <form onSubmit={handleUpgradePaymentSubmit} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Name on Card</label>
                <input 
                  type="text" 
                  placeholder="e.g. Aman Verma"
                  value={billingForm.cardName}
                  onChange={(e) => setBillingForm({ ...billingForm, cardName: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 p-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-primary"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Card Number</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="4242 •••• •••• 4242"
                    maxLength="19"
                    value={billingForm.cardNumber}
                    onChange={(e) => setBillingForm({ ...billingForm, cardNumber: e.target.value })}
                    className="w-full bg-white dark:bg-slate-955 border border-slate-303 dark:border-slate-805 pl-9 pr-4 p-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-primary"
                    required
                  />
                  <FaCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Expiry Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY"
                    maxLength="5"
                    value={billingForm.cardExpiry}
                    onChange={(e) => setBillingForm({ ...billingForm, cardExpiry: e.target.value })}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 p-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-primary"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">CVC / CVV</label>
                  <input 
                    type="password" 
                    placeholder="•••"
                    maxLength="4"
                    value={billingForm.cardCvc}
                    onChange={(e) => setBillingForm({ ...billingForm, cardCvc: e.target.value })}
                    className="w-full bg-white dark:bg-slate-955 border border-slate-303 dark:border-slate-805 p-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-primary"
                    required
                  />
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-[10px] text-slate-405 leading-relaxed font-medium">
                🔒 Protected by 256-bit SSL validation. This is a secure mock sandbox transaction. No real funds will be charged.
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-1/2 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-55 dark:hover:bg-slate-800 rounded-xl font-bold transition text-xs cursor-pointer bg-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={upgradingSpinner}
                  className="w-1/2 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 rounded-xl font-black text-xs border-none cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {upgradingSpinner ? (
                    <FaSpinner className="animate-spin text-sm" />
                  ) : (
                    <>Pay ₹499 & Upgrade</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default Welcome
