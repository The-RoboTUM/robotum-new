import React, { useState } from 'react'
import * as assets from '@assets'
import Button from '@components/ui/Button'
import ImageFrame from '@components/ui/ImageFrame'
import { events, EVENT_CATEGORIES } from '@data'

export default function EventsSection() {
  const [activeCategory, setActiveCategory] = useState('All')

  // Filter events by category
  const filteredEvents =
    activeCategory === 'All'
      ? events
      : events.filter((e) => e.type === activeCategory)

  // Format event date range
  const formatDateRange = (start, end) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const sameMonth = startDate.getMonth() === endDate.getMonth()
    const options = { day: 'numeric', month: 'short', year: 'numeric' }
    const startStr = startDate.toLocaleDateString('en-US', options)
    const endStr = endDate.toLocaleDateString('en-US', options)
    return sameMonth
      ? `${startDate.getDate()}–${endDate.getDate()} ${startDate.toLocaleString('en-US', { month: 'short' })}, ${startDate.getFullYear()}`
      : `${startStr} – ${endStr}`
  }

  return (
    <section
      id="upcoming-events"
      className="section-container font-sans text-white surface-1 edge-fade-top edge-fade-bottom surface-wrap surface-pattern"
      aria-labelledby="events-section-heading"
      role="region"
    >
      <div>
        {/* Heading */}
        <h2
          id="events-section-heading"
          className="heading heading-h1 leading-tight mb-8 text-center md:text-left"
        >
          Upcoming Events
        </h2>

        {/* Category Filter */}
        <div className="flex justify-center mb-10 flex-wrap gap-3 sm:gap-4">
          {['All', ...EVENT_CATEGORIES].map((cat) => {
            const active = activeCategory === cat
            return (
              <Button
                key={cat}
                variant="secondary"
                onClick={() => setActiveCategory(cat)}
                className={`
                  text-sm md:text-base px-5 py-2 rounded-full transition-all duration-300
                  ${
                    active
                      ? 'bg-accent text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] scale-[1.05]'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white hover:scale-[1.03]'
                  }
                `}
              >
                {cat}
              </Button>
            )
          })}
        </div>

        {/* Events Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {filteredEvents.map((event) => (
            <article
              key={event.id}
              role="listitem"
              className="flex flex-col bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-accent transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_rgba(59,130,246,0.3)]"
            >
              <ImageFrame
                src={event.cover}
                alt={event.title}
                aspect="3/2"
                fit="cover"
                variant="soft"
                rounded="none"
              />

              <div className="p-6 flex flex-col grow text-left">
                <h3 className="text-text1 md:text-h2 font-semibold mb-2 leading-tight text-white">
                  {event.title}
                </h3>
                <p className="text-sm text-white/70 mb-1">
                  {formatDateRange(event.start, event.end)}
                </p>
                <p className="text-sm text-white/50 mb-3 italic">
                  {event.location}
                </p>
                <p className="text-text2 text-white/80 mb-6 grow leading-relaxed">
                  {event.blurb}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <Button
                    variant="secondary"
                    as="link"
                    to={event.links.register}
                    className="text-sm px-5 py-2"
                  >
                    Register →
                  </Button>
                  {event.past && (
                    <span className="text-xs text-white/50 italic">
                      Past Event
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}