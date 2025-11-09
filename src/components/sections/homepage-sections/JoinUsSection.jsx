import * as assets from '@assets'
import Button from '@components/ui/Button'
import ImageFrame from '@components/ui/ImageFrame'

export default function JoinUsSection() {
  return (
    <section
      id="join"
      className="section-container text-white font-sans surface-1 edge-fade-top edge-fade-bottom surface-wrap surface-pattern"
    >
      <div className="flex flex-col gap-20 md:gap-24">
        {/* Become a Member */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 w-full">
            <ImageFrame
              src={assets.memberImg}
              alt="Join as Member"
              aspect="3/2"
              fit="cover"
              variant="soft"
              rounded="xl"
              className="w-full"
            />
          </div>
          <div className="md:w-1/2 w-full space-y-6">
            <h2 id="apply" className="heading heading-h2 font-bold leading-tight">Become a Member</h2>
            <p className="text-text2 md:text-text1 text-white/80 leading-relaxed">
              Join RoboTUM and shape the future of robotics with us. Attend our events,
              participate in projects, and grow your skills alongside passionate innovators.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <Button variant="primary" as="link" to="/join">Apply Now</Button>
              <Button variant="secondary" as="link" to="#learn-more">Learn More</Button>
            </div>
          </div>
        </div>

        {/* Become a Partner */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="md:w-1/2 w-full">
            <ImageFrame
              src={assets.partnerImg}
              alt="Join as Partner"
              aspect="3/2"
              fit="cover"
              variant="soft"
              rounded="xl"
              className="w-full"
            />
          </div>
          <div className="md:w-1/2 w-full space-y-6">
            <h2 id="partner" className="heading heading-h2 font-bold leading-tight">Become a Partner</h2>
            <p className="text-text2 md:text-text1 text-white/80 leading-relaxed">
              Collaborate with RoboTUM to sponsor innovation, support future engineers,
              and gain visibility in our events and projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <Button variant="primary" as="link" to="/partners#contact">Become a Partner</Button>
              <Button variant="secondary" as="link" to="/partners">View Partners</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}