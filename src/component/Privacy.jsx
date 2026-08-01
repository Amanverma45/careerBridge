import React from 'react'

function Privacy({ isModal }) {
  const content = (
    <div className={isModal ? "" : "max-w-4xl mx-auto bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-8 sm:p-12 shadow-sm"}>
      <h1 className="text-3xl font-black mb-4 text-brand-primary">
        Privacy Policy
      </h1>
      <p className="text-slate-405 dark:text-slate-500 text-xs mb-6">
        Last updated: August 1, 2026
      </p>

      <div className="space-y-5 text-slate-650 dark:text-slate-350 leading-relaxed text-sm">
        <p>
          At <strong>CareerBridge</strong>, we are committed to protecting your privacy. This Privacy Policy describes how we collect, use, and share your personal information when you use our platform.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
          1. Information We Collect
        </h2>
        <p>
          We collect information you provide directly to us, such as when you create an account, upload a resume, complete your profile, or apply for jobs. This may include your name, email address, phone number, work experience, and educational background.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
          2. How We Use Your Information
        </h2>
        <p>
          We use the information we collect to operate, maintain, and improve our platform. This includes matching candidates with relevant jobs, allowing recruiters to view applicant profiles, and sending updates related to application status.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
          3. Information Sharing
        </h2>
        <p>
          We share candidate application data directly with the recruiters of the jobs you apply to. We do not sell, rent, or trade your personal information to third parties for marketing purposes.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
          4. Security
        </h2>
        <p>
          We use industry-standard security measures to safeguard your personal data. However, please note that no internet transmission is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
          5. Contact Us
        </h2>
        <p>
          If you have any questions or concerns about this Privacy Policy, please reach out to our support team at <a href="mailto:yourcareerbridge.app@gmail.com" className="text-brand-secondary hover:underline">yourcareerbridge.app@gmail.com</a>.
        </p>
      </div>
    </div>
  );

  if (isModal) {
    return content;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 py-20 px-6 sm:px-10 lg:px-16 transition-colors duration-300">
      {content}
    </div>
  )
}

export default Privacy
