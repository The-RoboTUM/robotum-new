import * as assets from '@assets'
import Button from '@components/ui/Button'

export default function MissionSection() {
  return (

    <section className="text-white font-sans surface-2 edge-fade-toppx-6 py-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-h2 font-bold leading-tight mb-16">
          We are a student initiative <br />
          formed of robotic <br />
          enthusiasts
        </h2>

        <div className="bg-[var(--surface-light)] text-[var(--primary)] rounded-xl p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Vision</h3>
            <p className="text-base">
              To establish Munich as a global robotics hub, comparable to Boston or Switzerland
            </p>
          </div>

          {/* Mission */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Mission</h3>
            <p className="text-base">
              To bridge the gap between robotic industry and academia, driving innovation and entrepreneurship
            </p>
            <Button variant="primary" as="link" to="/about" className="mt-2 self-start">
              About Us →
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}