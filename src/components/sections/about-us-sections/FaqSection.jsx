import React, { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline' // Importing Chevron icons from Heroicons

const faqItems = [
  {
    question: 'What is RoboTUM?',
    answer:
      'RoboTUM is a student-led initiative at the Technical University of Munich focusing on robotics innovation and research. We engage students in robotics projects, competitions, and collaborations with industry leaders.',
  },
  {
    question: 'How can I become a member?',
    answer:
      'To become a member, you can apply through our website. Simply fill out the form on the "Join Us" page, and we will get in touch with you about the next steps!',
  },
  {
    question: 'What kind of projects do you work on?',
    answer:
      'RoboTUM is a student-led initiative at the Technical University of Munich focusing on robotics innovation and research. We engage students in robotics projects, competitions, and collaborations with industry leaders.',
  },
  {
    question: 'How can I become a member?',
    answer:
      'To become a member, you can apply through our website. Simply fill out the form on the "Join Us" page, and we will get in touch with you about the next steps!',
  },
  {
    question: 'What kind of projects do you work on?',
    answer:
      'We work on a wide range of robotics projects, from humanoid robots to autonomous systems. Our projects cover areas such as AI, machine learning, and computer vision in robotics.',
  },
  {
    question: 'Can I collaborate with RoboTUM?',
    answer:
      'Yes! We welcome collaboration with industry partners, academic institutions, and other student groups. Please reach out to us through our contact page for more information.',
  },
]

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleAnswer = index => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="w-full px-6 md:px-16 py-20 md:py-28 font-sans surface-1 edge-fade-top edge-fade-bottom surface-wrap surface-pattern">
      <div className="max-w-7xl mx-auto">
        <h2 className="heading heading-h2 font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqItems.map((item, index) => (
            <div key={index} className="space-y-2">
              {/* Question */}
              <button
                onClick={() => toggleAnswer(index)}
                className="w-full text-left text-text1 font-semibold bg-transparent hover:text-accent hover:cursor-pointer transition-colors duration-300 flex items-center justify-between"
              >
                <span>{item.question}</span>
                {openIndex === index ? (
                  <ChevronUpIcon className="h-5 w-5 text-accent" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-accent" />
                )}
              </button>

              {/* Answer with smooth sliding animation */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-text2 text-white/80 leading-relaxed mt-2">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FaqSection
