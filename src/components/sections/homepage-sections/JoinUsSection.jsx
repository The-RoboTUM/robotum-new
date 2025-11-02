import * as assets from '@assets'
import Button from '@components/ui/Button'

export default function JoinUsSection() {
  return (
    <section
      id="join"
      className="w-full px-6 py-24 text-white font-sans surface-1 edge-fade-top"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Become a Member */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src={assets.memberImg}
            alt="Join as Member"
            className="md:w-1/2 w-full rounded-xl shadow-lg border border-white/10"
          />
          <div className="md:w-1/2 w-full space-y-6">
            <h2 className="text-4xl font-bold">Become a Member</h2>
            <p className="text-slate-300">
              Join RoboTUM and shape the future of robotics with us. Attend our events,
              participate in projects, and grow your skills alongside passionate innovators.
            </p>
            <div className="flex gap-4">
              <Button variant="primary" as="link" to="#apply">Apply Now</Button>
              <Button variant="secondary" as="link" to="#learn-more">Learn More</Button>
            </div>
          </div>
        </div>

        {/* Become a Partner */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          <img
            src={assets.partnerImg}
            alt="Join as Partner"
            className="md:w-1/2 w-full rounded-xl shadow-lg border border-white/10"
          />
          <div className="md:w-1/2 w-full space-y-6">
            <h2 className="text-4xl font-bold">Become a Partner</h2>
            <p className="text-slate-300">
              Collaborate with RoboTUM to sponsor innovation, support future engineers,
              and gain visibility in our events and projects.
            </p>
            <div className="flex gap-4">
              <Button variant="primary" as="link" to="#partner">Become a Partner</Button>
              <Button variant="secondary" as="link" to="#view-partners">View Partners</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}