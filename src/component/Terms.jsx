import React from 'react'

function Terms({ isModal }) {
  const content = (
    <div className={isModal ? "" : "max-w-4xl mx-auto bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-8 sm:p-12 shadow-sm"}>
      <h1 className="text-3xl font-black mb-4 text-brand-primary">
        Terms of Service
      </h1>
      <p className="text-slate-405 dark:text-slate-500 text-xs mb-6">
        Last updated: August 1, 2026
      </p>

      <div className="space-y-5 text-slate-650 dark:text-slate-350 leading-relaxed text-sm">
        <p>
          Welcome to <strong>CareerBridge</strong>. By accessing or using our website, you agree to comply with and be bound by the following Terms of Service.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
          1. Acceptance of Terms
        </h2>
        <p>
          By registering for an account or using our hiring services, you agree to these Terms. If you do not agree, please do not access or use our platform.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
          2. User Accounts
        </h2>
        <p>
          You are responsible for maintaining the confidentiality of your credentials and account information. You agree to provide accurate, complete, and current information when registering.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
          3. Job Application and Posting
        </h2>
        <p>
          Candidates are responsible for the accuracy of their resume and profiles. Recruiters are responsible for verifying that all job listings correspond to active and legitimate vacancies. We reserve the right to remove any listing or suspend any account that violates our policies.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
          4. Limitation of Liability
        </h2>
        <p>
          CareerBridge facilitates the match between candidates and employers but does not guarantee employment or candidate quality. We are not liable for any disputes, hiring decisions, or consequences resulting from interviews and job placement.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
          5. Modifications to Terms
        </h2>
        <p>
          We may update these Terms of Service from time to time. Your continued use of the platform after any changes indicates your acceptance of the new terms.
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

export default Terms
