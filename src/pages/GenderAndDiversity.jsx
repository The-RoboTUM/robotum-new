// General imports
import Navbar from '@components/sections/common-sections/Navbar'
import FooterSection from '@components/sections/common-sections/FooterSection'

import React, { useEffect } from 'react'

export default function GenderAndDiversity() {
  useEffect(() => { document.title = 'Gender & Biodiversity | RoboTUM' }, [])

  return (
    <>
      <Navbar />
      <main className="w-full px-6 md:px-16 py-16 font-sans surface-2 edge-fade-top edge-fade-bottom">
        <article className="prose prose-invert max-w-3xl mx-auto">
          <h1 className="heading heading-h2 font-bold mb-6">Gender and Biodiversity</h1>

          <section className="mb-8">
            <h2 className="text-text1 font-semibold">RoboTUM Diversity &amp; Gender Equality Plan</h2>
            <p>
              RoboTUM fosters a culture of integrity, open mindedness, and tolerance. It recognizes the value created through
              diversity and respect as a central guiding principle for its proven success: It is the diversity of its scientists,
              students, and employees that makes RoboTUM an innovative and dynamic organization. RoboTUM is thus committed to holistic
              diversity management that actively promotes the equality of talent, irrespective of gender, nationality, religion,
              ideology, physical ability, age, sexual identity, or socioeconomic status. RoboTUM translates this commitment into
              numerous concrete measures, many of which have already been successfully implemented, established, and optimized since
              the publication of the first Diversity &amp; Gender Equality Plan at the end of 2024. With the publication of the current
              Diversity &amp; Gender Equality Plan, RoboTUM reaffirms its forward looking vision of establishing an ever more inclusive
              organizational culture through ongoing efforts in the context of systematic diversity management, which is reflected in
              the continuation, further development, and renewal of diversity measures.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-text1 font-semibold">Commitment</h2>
            <p>
              This Diversity &amp; Gender Equality Plan represents RoboTUM’s continued commitment to the principle of an open minded
              organization that attracts and supports the best talents in all their diversity. These measures are intended to create
              the best possible conditions for each person to develop their individual potential. Equality is an elementary pillar of
              RoboTUM, and the organization is committed to a focus on diversity and talent management. The RoboTUM Board of Management
              fosters gender equality and wholeheartedly supports the Diversity &amp; Gender Equality Plan. In order to promote equality
              in a diverse community in the best possible way, the implementation status of the measures in the Diversity &amp; Gender
              Equality Plan is checked at regular intervals and, if necessary, supplemented by other innovative formats and measures in
              the sense of a living document.
            </p>
          </section>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {/* TODO: Replace href with your actual Google Drive link */}
            <a
              href="https://drive.google.com/file/d/1kupm6BU3foNyq5-uRd3pPVc3qzEbjy2y/view"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Download GEP
            </a>
          </div>

          <p className="text-white/60 mt-10 text-sm">Last reviewed: {new Date().toLocaleDateString()}</p>
        </article>
      </main>
      <FooterSection />
    </>
  )
}