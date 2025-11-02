import React, { useState } from 'react'
import * as assets from '@assets'

const teamData = [
  {
    name: 'Loren Ipsum',
    position: 'Founder',
    category: 'Founders',
    image: assets.member,
    linkedin: '#'
  },
  {
    name: 'Loren Ipsum',
    position: 'Lead',
    category: 'Departments Leads',
    image: assets.member,
    linkedin: '#'
  },
  {
    name: 'Loren Ipsum',
    position: 'Project Manager',
    category: 'Projects',
    image: assets.member,
    linkedin: '#'
  },
  {
    name: 'Loren Ipsum',
    position: 'Project Manager',
    category: 'Projects',
    image: assets.member,
    linkedin: '#'
  },
  {
    name: 'Loren Ipsum',
    position: 'Project Manager',
    category: 'Projects',
    image: assets.member,
    linkedin: '#'
  },
  {
    name: 'Loren Ipsum',
    position: 'Project Manager',
    category: 'Projects',
    image: assets.member,
    linkedin: '#'
  },
  {
    name: 'Loren Ipsum',
    position: 'Project Manager',
    category: 'Projects',
    image: assets.member,
    linkedin: '#'
  },
  {
    name: 'Loren Ipsum',
    position: 'Project Manager',
    category: 'Projects',
    image: assets.member,
    linkedin: '#'
  },
  {
    name: 'Loren Ipsum',
    position: 'Project Manager',
    category: 'Projects',
    image: assets.member,
    linkedin: '#'
  },
  {
    name: 'Loren Ipsum',
    position: 'Project Manager',
    category: 'Projects',
    image: assets.member,
    linkedin: '#'
  },
]

const categories = ['All', 'Founders', 'Departments Leads', 'Projects']

export default function TeamSection() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredTeam =
    selectedCategory === 'All'
      ? teamData
      : teamData.filter((member) => member.category === selectedCategory)

  return (
    <section
      className="section-gradient text-white py-16 px-6 lg:px-10 font-sans"
      aria-labelledby="team-heading"
    >
      <div className="max-w-7xl mx-auto">
        <h2 id="team-heading" className="text-h2 font-bold leading-tight mb-8 [text-wrap:balance]">
          Meet Our Team
        </h2>

        {/* Category pills — horizontal scroll on mobile */}
        <div className="-mx-2 mb-10 overflow-x-auto">
          <div
            className="px-2 inline-flex gap-3 whitespace-nowrap"
            role="tablist"
            aria-label="Team categories"
          >
            {categories.map((category) => {
              const active = selectedCategory === category
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  role="tab"
                  aria-selected={active}
                  className={[
                    'px-4 py-2 rounded-full border transition-colors',
                    'text-sm md:text-base cursor-pointer',
                    active
                      ? 'bg-white/15 text-white border-white/20'
                      : 'text-white/70 border-white/20 hover:bg-white/10 hover:text-white',
                  ].join(' ')}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {filteredTeam.map((member, index) => (
            <article
              key={`${member.name}-${index}`}
              className="group bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="w-full aspect-square overflow-hidden rounded-xl bg-white/10 border border-white/5 cursor-pointer">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300 ease-out"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="mt-3">
                <h3 className="text-text1 font-semibold leading-tight">{member.name}</h3>
                <p className="text-text2 text-white/70">{member.position}</p>
              </div>

              <div className="mt-3">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${member.name} LinkedIn`}
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white"
                >
                  <img src={assets.linkedinIcon} alt="" className="w-5 h-5" />
                  <span className="text-sm">LinkedIn</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
