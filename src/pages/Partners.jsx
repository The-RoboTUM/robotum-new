// Above-the-fold imports
import Navbar from '@components/sections/common-sections/Navbar'
import FooterSection from '@components/sections/common-sections/FooterSection'

// Lazy-load below-the-fold content for performance
import React, { lazy, Suspense, useEffect } from 'react'
const PartnersSection = lazy(() => import('@components/sections/homepage-sections/PartnersSection'))

export default function Partners() {
  useEffect(() => {
    document.title = 'Partners | RoboTUM'
  }, [])

  return (
    <>
      <Navbar />

      <Suspense
        fallback={
          <div className="w-full min-h-[40vh] flex items-center justify-center text-white/70">
            Loading…
          </div>
        }
      >
        <PartnersSection />
      </Suspense>

      <FooterSection />
    </>
  )
}