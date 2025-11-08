import React, { useState } from 'react';
import * as assets from '@assets'
import Button from '@components/ui/Button'
import ImageFrame from '@components/ui/ImageFrame'

const events = [
  {
    id: 1,
    category: 'Hackathons',
    title: 'Hackathon',
    date: '17.07.2025',
    description:
      'A high-energy, team-based innovation sprint where participants collaboratively develop creative technical solutions to real-world challenges — all within 24 hours.',
    image: assets.event1,
  },
  {
    id: 2,
    category: 'Conferences',
    title: 'Robot Summit',
    date: '24.07.2025',
    description:
      'An interdisciplinary event bringing together experts, researchers, and students to discuss the latest developments in robotics, AI, and automation.',
    image: assets.event2,
  },
  {
    id: 3,
    category: 'Info events',
    title: 'RoboTUM info session',
    date: '28.07.2025',
    description:
      'An introductory session providing insights into RoboTUM’s mission, projects, and how students can get involved in one of the university’s leading robotics clubs.',
    image: assets.event3,
  },
  {
    id: 4,
    category: 'Conferences',
    title: 'RoboCast speaker series #3',
    date: '30.07.2025',
    description:
      'The third edition of our expert talk series, featuring a guest speaker from academia or industry sharing cutting-edge insights into robotics and AI.',
    image: assets.event4,
  },
  {
    id: 5,
    category: 'Conferences',
    title: '1min paper review',
    date: '04.08.2025',
    description:
      'A fast-paced session where recent robotics and AI publications are presented and discussed — each in just one minute. Designed to keep the community informed and inspired.',
    image: assets.event5,
  },
];

const categories = ['All', 'Hackathons', 'Conferences', 'Info events'];

export default function EventsSection() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredEvents =
    activeCategory === 'All'
      ? events
      : events.filter((e) => e.category === activeCategory);

  return (
    <section
      className="section-container font-sans text-white surface-1 edge-fade-top edge-fade-bottom surface-wrap surface-pattern"
      aria-labelledby="events-section-heading"
      role="region"
    >
      <div>
        {/* Heading */}
        <h2 id="events-section-heading" className="heading heading-h1 leading-tight mb-8 text-center md:text-left">
          Upcoming Events
        </h2>
        {/* Category Filter */}
        <div className="flex justify-center mb-10 flex-wrap gap-3 sm:gap-4">
          {categories.map((cat) => {
            const active = activeCategory === cat
            return (
              <Button
                key={cat}
                variant="secondary"
                onClick={() => setActiveCategory(cat)}
                className={`
                  text-sm md:text-base px-5 py-2 rounded-full transition-all duration-300
                  ${active
                    ? 'bg-accent text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] scale-[1.05]'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white hover:scale-[1.03]'}
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
                src={event.image}
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
                <p className="text-sm text-white/70 mb-3">{event.date}</p>
                <p className="text-text2 text-white/80 mb-6 grow leading-relaxed">
                  {event.description}
                </p>

                <Button
                  variant="secondary"
                  as="link"
                  to={`/events/${event.id}`}
                  className="self-start text-sm px-5 py-2 mt-auto"
                >
                  Register →
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}