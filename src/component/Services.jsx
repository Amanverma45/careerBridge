import React, { useEffect } from 'react';
import { FaRocket, FaRobot, FaBriefcase, FaUserTie, FaSearchDollar, FaChartBar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Services = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
            // After transition finishes (500ms), remove animation classes so hover works perfectly
            setTimeout(() => {
              entry.target.classList.remove(
                'scroll-anim-card',
                'is-visible',
                'opacity-0',
                '-translate-x-16',
                'translate-x-16',
                'rotate-[-1deg]',
                'rotate-[1deg]',
                'lg:-translate-x-24',
                'lg:translate-y-24',
                'lg:rotate-[-2deg]',
                'lg:rotate-[2deg]',
                'lg:translate-y-0'
              );
            }, 500);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "0px 0px 80px 0px"
      }
    );

    const cards = document.querySelectorAll('.scroll-anim-card');
    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card));
    };
  }, []);

  const getAnimationClass = (index) => {
    // 2-column layout (mobile/tablet)
    const isMobileLeft = index % 2 === 0;
    const mobileClass = isMobileLeft 
      ? "-translate-x-16 rotate-[-1deg]" 
      : "translate-x-16 rotate-[1deg]";

    // 3-column layout (desktop)
    let desktopClass = "";
    if (index % 3 === 0) {
      desktopClass = "lg:-translate-x-24 lg:translate-y-0 lg:rotate-[-2deg]";
    } else if (index % 3 === 1) {
      desktopClass = "lg:translate-x-0 lg:translate-y-24 lg:rotate-0";
    } else {
      desktopClass = "lg:translate-x-24 lg:translate-y-0 lg:rotate-[2deg]";
    }

    return `scroll-anim-card opacity-0 ${mobileClass} ${desktopClass}`;
  };

  const servicesList = [
    {
      icon: FaSearchDollar,
      title: "Smart Job Matching",
      description: "Our AI algorithm connects your unique skills with the most relevant high-paying job opportunities.",
      roleBadge: "Candidates"
    },
    {
      icon: FaRobot,
      title: "AI Resume Builder",
      description: "Generate professional, ATS-friendly resumes in minutes using our advanced AI writing assistant.",
      roleBadge: "Candidates"
    },
    {
      icon: FaUserTie,
      title: "Expert Career Coaching",
      description: "Connect with industry veterans for 1-on-1 mentorship and personalized career roadmaps.",
      roleBadge: "Candidates"
    },
    {
      icon: FaBriefcase,
      title: "Premium Listings",
      description: "Get early access to exclusive job openings from top-tier tech companies and startups.",
      roleBadge: "Candidates"
    },
    {
      icon: FaChartBar,
      title: "Skill Gap Analysis",
      description: "Identify exactly which skills you need to learn to land your dream role with our data insights.",
      roleBadge: "Candidates"
    },
    {
      icon: FaRocket,
      title: "Interview Prep",
      description: "Practice with our AI mock interview tool and get real-time feedback on your performance.",
      roleBadge: "Candidates"
    },
  ];

  const handleServiceClick = (index) => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    // Block recruiter from Candidate-only features
    if (user?.role === "recruiter" && [0, 1, 2, 3, 4, 5].includes(index)) {
      toast.error("This feature is exclusive to Candidate / Job Seeker accounts.");
      return;
    }

    // Force authentication popup if not logged in for profile-based features
    if (!token && [0, 1, 2, 3, 4, 5].includes(index)) {
      window.dispatchEvent(new Event("open-login"));
      toast.error("Please login to access this service.");
      return;
    }

    switch (index) {
      case 0: // Smart Job Matching
      case 3: // Premium Listings
        navigate('/jobs');
        break;
      case 1: // AI Resume Builder
        navigate('/resume');
        break;
      case 4: // Skill Gap Analysis
        navigate('/dashboard');
        break;
      case 2: // Expert Career Coaching
        toast.success("Coaching: Submit a Reach Support ticket to get matched with a 1-on-1 industry mentor!");
        break;
      case 5: // Interview Prep
        toast.success("AI Interview Prep guides are active in your Career Resource Hub under Interview Excellence!");
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0f172a] pt-14 pb-24 px-6 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-secondary/5 dark:bg-brand-secondary/3 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-brand-secondary font-bold uppercase tracking-[0.2em] text-sm mb-4">
            Our Expertise
          </h2>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white mb-6">
            Everything you need to <br />
            <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
              Scale Your Career
            </span>
          </h1>

          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            We provide the tools and resources to help you transition from where you are to where you want to be.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {servicesList.map((service, index) => {
            const borderColors = [
              "border-t-brand-primary",
              "border-t-brand-secondary",
              "border-t-brand-accent"
            ];
            const iconColors = [
              "text-brand-primary",
              "text-brand-secondary",
              "text-brand-accent"
            ];
            const borderClass = borderColors[index % 3];
            const iconColorClass = iconColors[index % 3];
            const IconComponent = service.icon;

            return (
              <div
                key={index}
                onClick={() => handleServiceClick(index)}
                className={`group p-3.5 xs:p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/80 border-t-4 ${borderClass} hover:border-brand-primary/40 dark:hover:border-brand-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden cursor-pointer ${getAnimationClass(index)}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {service.roleBadge && (
                  <span className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-secondary z-20">
                    {service.roleBadge}
                  </span>
                )}

                <div
                  className={`w-9 h-9 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm transition-all group-hover:scale-105 duration-300 ${iconColorClass} mb-4 sm:mb-6`}
                >
                  <IconComponent className="text-xl sm:text-2xl" />
                </div>

                <h3 className="text-sm sm:text-xl font-bold text-slate-800 dark:text-slate-200 mb-1.5 sm:mb-3 group-hover:text-brand-primary transition-colors">
                  {service.title}
                </h3>

                <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-sm leading-normal sm:leading-relaxed">
                  {service.description}
                </p>

                <div className="mt-4 sm:mt-6 flex items-center text-[10px] sm:text-xs font-bold text-brand-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                  Learn More <span className="ml-2">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Services;
