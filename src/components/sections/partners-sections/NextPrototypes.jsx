import React from 'react'
import * as assets from '@assets'
import ImageFrame from '@components/ui/ImageFrame'

const NextPrototypes = () => {
  return (
    <section
      id="next-prototypes"
      className="section-container surface-2 edge-fade-top edge-fade-bottom text-center font-sans overflow-hidden"
      role="region"
      aria-labelledby="next-prototypes-heading"
    >
      <div className="animate-fadeIn">
        <h3
          id="next-prototypes-heading"
          className="heading heading-h2 mb-8 text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]"
        >
          Proud Member of
        </h3>

        <div className="flex justify-center items-center mb-6">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-500 hover:bg-white/10">
            <ImageFrame
              src={assets.nextPrototypes}
              alt="Next Prototypes"
              fit="contain"
              variant="none"
              rounded="md"
              className="w-40 md:w-48 h-auto filter invert brightness-200 transition-all duration-500"
            />
          </div>
        </div>

        <p className="text-text2 md:text-text1 text-white/80 leading-relaxed max-w-2xl mx-auto">
          We are proud to be part of{' '}
          <span className="font-semibold text-[#60A5FA]">Next Prototypes</span>, an innovative
          community pushing the boundaries of{' '}
          <span className="text-[#7C3AED] font-semibold">technology</span> and{' '}
          <span className="text-[#60A5FA] font-semibold">creativity</span>.
        </p>
      </div>
    </section>
  )
}

export default NextPrototypes