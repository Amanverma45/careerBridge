import React from 'react';
import { FaRocket, FaRobot, FaBriefcase, FaUserTie, FaSearchDollar, FaChartBar
} from 'react-icons/fa';

const Services = () => {
  const servicesList = [
    {
      icon: <FaSearchDollar />,
      title: "Smart Job Matching",
      description: "Our AI algorithm connects your unique skills with the most relevant high-paying job opportunities.",
      color: "from-blue-500 to-cyan-400"
    },
    {
      icon: <FaRobot />,
      title: "AI Resume Builder",
      description: "Generate professional, ATS-friendly resumes in minutes using our advanced AI writing assistant.",
      color: "from-indigo-500 to-purple-400"
    },
    {
      icon: <FaUserTie />,
      title: "Expert Career Coaching",
      description: "Connect with industry veterans for 1-on-1 mentorship and personalized career roadmaps.",
      color: "from-emerald-500 to-teal-400"
    },
    {
      icon: <FaBriefcase />,
      title: "Premium Listings",
      description: "Get early access to exclusive job openings from top-tier tech companies and startups.",
      color: "from-orange-500 to-yellow-400"
    },
    {
      icon: <FaChartBar />,
      title: "Skill Gap Analysis",
      description: "Identify exactly which skills you need to learn to land your dream role with our data insights.",
      color: "from-pink-500 to-rose-400"
    },
    {
      icon: <FaRocket />,
      title: "Interview Prep",
      description: "Practice with our AI mock interview tool and get real-time feedback on your performance.",
      color: "from-violet-500 to-fuchsia-400"
    },
  ];

  return (
    <div className="bg-white py-24 px-6 relative overflow-hidden">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2E7D32]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        <div className="text-center mb-16">

          <h2 className="text-[#2E7D32] font-bold uppercase tracking-[0.2em] text-sm mb-4">
            Our Expertise
          </h2>

          <h1 className="text-4xl md:text-5xl font-extrabold text-[#374151] mb-6">
            Everything you need to <br />
            <span className="bg-gradient-to-r from-[#2E7D32] to-[#F4A261] bg-clip-text text-transparent">
              Scale Your Career
            </span>
          </h1>

          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            We provide the tools and resources to help you transition from where you are to where you want to be.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {servicesList.map((service, index) => (
            <div
              key={index}
              className="group p-8 rounded-3xl bg-white border border-gray-200 hover:border-[#2E7D32]/40 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
            >

              <div className="absolute inset-0 bg-gradient-to-br from-[#2E7D32]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white text-2xl mb-6 shadow-lg`}
              >
                {service.icon}
              </div>

              <h3 className="text-xl font-bold text-[#374151] mb-3 group-hover:text-[#2E7D32] transition-colors">
                {service.title}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed">
                {service.description}
              </p>

              <div className="mt-6 flex items-center text-xs font-bold text-[#2E7D32] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                Learn More <span className="ml-2">→</span>
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Services;

