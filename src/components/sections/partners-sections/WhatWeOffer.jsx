import React from 'react'
import * as assets from '@assets'

const offers = [
  {
    icon: assets.roboticsIcon,
    title: 'Networking Opportunities',
    description: 'Connect with professionals and experts in robotics to share knowledge and ideas.',
  },
  {
    icon: assets.marketingIcon,
    title: 'Skill Development',
    description: 'Gain hands-on experience in cutting-edge robotics projects and technologies.',
  },
  {
    icon: assets.collaborationIcon,
    title: 'Innovation Support',
    description: 'Collaborate on innovative solutions with industry leaders and academic experts.',
  },
  {
    icon: assets.networkingIcon,
    title: 'Global Exposure',
    description: 'Get involved in international competitions and events to showcase your skills.',
  },
]

const WhatWeOffer = () => {
  return (
    <section
      id="what-we-offer"
      className="surface-2 edge-fade-top edge-fade-bottom py-24 px-6 text-center font-sans"
    >
      <div className="max-w-7xl mx-auto">
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
                <div className="relative w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-white/10 border border-white/20 shadow-inner group-hover:bg-linear-to-br group-hover:from-[#2563EB]/40 group-hover:to-[#7C3AED]/40 transition-all duration-500">
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