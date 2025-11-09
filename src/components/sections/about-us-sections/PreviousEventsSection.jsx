import { events } from '@data'
import ImageFrame from '@components/ui/ImageFrame'
import Button from '@components/ui/Button'

const PreviousEventsSection = () => {
  // Filter and sort past events (most recent first)
  const pastEvents = events
    .filter(event => event.past)
    .sort((a, b) => new Date(b.end) - new Date(a.end))

  // Format date for display (e.g., "February 2025")
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  }

  return (
    <section className="section-container font-sans surface-1 edge-fade-top edge-fade-bottom surface-wrap surface-pattern">
      <h2 className="heading heading-h2 font-bold text-center mb-8">Previous Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {pastEvents.map((event, index) => (
          <a
            key={index}
            href={event.links?.register || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center transition-all duration-300 hover:bg-white/10"
          >
            <ImageFrame
              src={event.cover}
              alt={event.title}
              aspect="3/2"
              fit="cover"
              variant="soft"
              rounded="xl"
              className="w-full mb-6"
            />
            <h3 className="text-text1 font-semibold mb-2">{event.title}</h3>
            <p className="text-text2 text-white/80">{formatDate(event.end)}</p>
          </a>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button as="link" to="/events" variant="primary">
          View all events
        </Button>
      </div>
    </section>
  )
}

export default PreviousEventsSection
