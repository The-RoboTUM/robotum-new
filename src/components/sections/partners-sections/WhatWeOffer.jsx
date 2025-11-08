import React from 'react'
import * as assets from '@assets'

const offers = [
  {
    icon: assets.roboticsIcon,
    title: 'ROBOTICS & AI TALENT POOL',
    description: 'Get access to our network of highly motivated students with a specialization in artificial intelligence technologies. Many of our members are interested in internships and working student positions.',
  },
  {
    icon: assets.marketingIcon,
    title: 'MARKETING & AWARENESS',
    description: 'As a partner, you will be featured on our website. Plus, we will advertise your company as a supporter in our marketing campaigns. Boost the perception of your brand among students across Munich and beyond.',
  },
  {
    icon: assets.collaborationIcon,
    title: 'PROJECT COLLABORATIONS',
    description: 'Being a partner opens the door for many sorts of collaborations, like becoming a challenge setter for our Hackathons, joining us for an industry project or hosting networking workshops with our members. We are only limited by your creativity!',
  },
  {
    icon: assets.networkingIcon,
    title: 'NETWORK & ECOSYSTEMS',
    description: 'We invite you to benefit from our entrepreneurial ecosystem, our own AI startup founders, as well as insights from our own R&D projects. We invite you to leverage our connections to other top university clubs, as well as the association to the TUM brand to drive robotics in your company.',
  },
]

const WhatWeOffer = () => {
  return (
    <section
      id="what-we-offer"
      className="section-container surface-2 edge-fade-top edge-fade-bottom text-center font-sans"
    >
      <div>
        <h2 className="heading heading-h2 font-bold mb-12 text-white animate-fadeIn">
          What We Offer
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          {offers.map((offer, index) => (
            <div
              key={index}
              className="group bg-white/10 border border-white/10 rounded-2xl p-8 backdrop-blur-md text-white transition-all duration-500 hover:scale-[1.04] hover:border-white/20 hover:shadow-[0_0_24px_rgba(59,130,246,0.25)] animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-white/10 border border-white/20 shadow-inner group-hover:bg-linear-to-br group-hover:from-accent/40 group-hover:to-[#7C3AED]/40 transition-all duration-500">
                  <img
                    src={offer.icon}
                    alt={offer.title}
                    className="w-10 h-10 object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300 icon-white"
                  />
                </div>

                <h3 className="text-text1 font-semibold mb-3">{offer.title}</h3>
                <p className="text-text2 text-white/80 leading-relaxed max-w-xs mx-auto">
                  {offer.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhatWeOffer