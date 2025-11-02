import * as assets from '@assets'
import Button from '@components/ui/Button'

export default function MissionSection() {
  return (

    <section className="text-white font-sans surface-2 edge-fade-top px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-h2 font-bold leading-tight text-balance mb-10 md:mb-14">
          We are a student initiative <br />
          formed of robotic <br />
          enthusiasts
        </h2>

        <div className="surface-light text-[#0B1B2E] rounded-2xl p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-[0_6px_24px_rgba(0,0,0,0.25)]">
          {/* Vision */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[1.25rem] md:text-[1.375rem] font-semibold">Vision</h3>
            <p className="text-text2 md:text-text1 text-black/80 leading-relaxed">
              To establish Munich as a global robotics hub, comparable to Boston or Switzerland
            </p>
          </div>

          {/* Mission */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[1.25rem] md:text-[1.375rem] font-semibold">Mission</h3>
            <p className="text-text2 md:text-text1 text-black/80 leading-relaxed">
              To bridge the gap between robotic industry and academia, driving innovation and entrepreneurship
            </p>
            <Button variant="primary" as="link" to="/about" className="mt-4 md:mt-6 self-start">
              About Us →
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}