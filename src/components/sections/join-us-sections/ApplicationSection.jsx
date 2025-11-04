import React from 'react'
import * as assets from '@assets'

const steps = [
  {
    number: 1,
    title: 'Apply',
    description:
      'Fill out our short application form and tell us about yourself, your interests, and what you’d like to contribute to RoboTUM.',
  },
  {
    number: 2,
    title: 'Interview',
    description:
      'If your application matches one of our open spots, we’ll invite you to a short interview. It’s a casual conversation — we just want to get to know you better!',
  },
  {
    number: 3,
    title: 'Welcome!',
    description:
      'If it’s a fit on both sides — welcome to the RoboTUM team! We’ll onboard you, introduce you to your project group, and get you started.',
  },
]

const ApplicationSection = () => {
  return (
    <section className="w-full px-6 md:px-16 py-20 md:py-28 font-sans text-white surface-1 edge-fade-top edge-fade-bottom surface-wrap surface-pattern">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-h1 font-bold leading-tight text-balance mb-6">
          Application Process
        </h2>
        <p className="text-text2 md:text-text1 text-white/80 leading-relaxed max-w-3xl mx-auto">
          Interested in joining RoboTUM? Great! Here’s how our application process works.
          <br />
          The next application phase will open soon — stay tuned on our website or social media.
        </p>
      </div>

      {/* Steps grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 max-w-6xl mx-auto text-center">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex flex-col items-center p-8 rounded-3xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_28px_rgba(59,130,246,0.25)] transition-all duration-300"
          >
            <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-accent/10 text-accent text-4xl font-bold mb-5">
              {step.number}
            </div>
            <h3 className="text-text1 font-semibold mb-2 capitalize">{step.title}</h3>
            <p className="text-text2 text-white/80 leading-relaxed max-w-xs">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ApplicationSection
