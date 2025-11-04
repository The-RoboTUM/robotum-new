import { useState } from 'react' 
import * as assets from '@assets'
import Button from '@components/ui/Button'
import ImageFrame from '@components/ui/ImageFrame'

const events = [
  {
    date: 'JUL 05',
    category: 'RoboTalk',
    title: 'Speaker Series #1 - Julian Hoffmann',
    description: '19:00 TUM Seminarraum (5532.EG.002)\nBuilding autonomous robots onto construction sites',
    link: '#'
  },
  {
    date: 'JUL 11',
    category: 'RoboTalk',
    title: 'Speaker Series #2 - Pedro Jinjun Dong',
    description: '19:00 TUM Seminarraum (5532.EG.002)\nBuilding autonomous robots onto construction sites',
    link: '#'
  },
  {
    date: 'AUG 08',
    category: 'Competition',
    title: 'Hackathon 2025',
    description: 'Join us for a weekend of coding, collaboration, and competition!',
    link: '#'
  },
  {
    date: 'OCT 23',
    category: 'Club Event',
    title: 'TUM Student Club Fair 2025',
    description: 'Explore various student initiatives and clubs at TUM.',
    link: '#'
  }
]

export default function EventSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section
      id="events"
      className="w-full px-6 py-24 font-sans text-white surface-2 edge-fade-top edge-fade-bottom surface-wrap surface-pattern"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left side - image and title */}
        <div className="md:w-5/12 text-left">
          <h2 id="upcoming" className="heading heading-h1 font-bold leading-tight mb-8">Upcoming Events</h2>
          <ImageFrame
            src={assets.speakerImg}
            alt="Event speaker"
            aspect="3/2"
            fit="cover"
            variant="soft"
            rounded="xl"
            className="w-full"
          />
        </div>

        {/* Right side - events */}
        <div className="md:w-7/12 flex flex-col gap-6" role="list" aria-labelledby="upcoming">
          {events.map((event, index) => {
            const [month, day] = event.date.split(' ')
            const isActive = activeIndex === index
            return (
              <button
                type="button"
                key={index}
                role="listitem"
                onClick={() => setActiveIndex(index)}
                aria-expanded={isActive}
                aria-controls={`event-panel-${index}`}
                className={`w-full text-left cursor-pointer p-6 rounded-2xl border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 backdrop-blur-sm ${
                  isActive
                    ? 'bg-accent/15 border-accent shadow-[0_8px_28px_rgba(59,130,246,0.25)]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="text-center px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs font-bold text-slate-300 tracking-wider">{month}</div>
                      <div className="text-2xl font-bold text-white leading-none">{day}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-300">{event.category}</div>
                      <div className="text-[15px] md:text-base font-semibold text-white">
                        {event.title}
                      </div>
                    </div>
                  </div>
                  <div className="text-white text-xl">{isActive ? '▾' : '▸'}</div>
                </div>

                {isActive && event.description && (
                  <div id={`event-panel-${index}`} className="mt-4 text-slate-200 whitespace-pre-line">
                    {event.description}
                    {event.link && (
                      <div className="mt-4">
                        <Button
                          variant="secondary"
                          as="link"
                          to={event.link}
                          className="text-sm px-4 py-2"
                        >
                          Register →
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}