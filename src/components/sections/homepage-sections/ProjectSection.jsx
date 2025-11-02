import { useState } from 'react'
import * as assets from '@assets'
import Button from '@components/ui/Button'

const projects = [
  {
    title: 'Humanoid Project',
    description:
      'Building the world\'s fastest and most energy-efficient Bipedal Robot. Design, Test, and iterate on hardware systems, work on our RL learning in Simulation, or come up with business proposals for its use cases. The Humanoid project needs every kind of background, from Tech to Marketing and Business! Help push the main technical Project of RoboTUM and revolutionize Humanoids!',
    image: assets.humanoidImg,
    link: '#humanoid'
  },
  {
    title: 'Creative Robotics',
    description:
      'Building awesome robotics stuff with the abundance of resources we have gathered over the past year. Build cocktail mixing robots, self-positioning trash bins, or anything else that comes to your mind. The end goal for every project should be to present at some event somewhere, in order to create value for RoboTUM.',
    image: assets.creativeRobotics,
    link: '#creative-robotics'
  },
  {
    title: 'Website Development',
    description:
      'From our Partnership with TU Design last Semester, we have an amazing website design waiting to be implemented. Help to shape RoboTUM\'s online presence and work on your web development skills!',
    image: assets.websiteDevelopment,
    link: '#website-development'
  },
  {
    title: 'ITQ Plastix Project',
    description:
      'Together with our Partner ITQ, we are starting the PlastiX Project to clean our Beaches of Trash! Work closely together under our Partners supervision to develop an autonomous Robotic system consisting of drones and wheeled robots, to scan and clear beaches from Plastic. This project needs both Hardware and Software support. If you want to build robots and help our Planet while doing so, this is the place for you!',
    image: assets.itqPlastix,
    link: '#itq-plastix-project'
  },
  {
    title: 'Reply',
    description:
      'Together with our sponsor, Reply, we\'re developing a cutting-edge software stack that expands on the autonomous capabilities of the PUMA Quadruped robot. This project is right for you if your focus is on software in autonomous systems!',
    image: assets.replyProject,
    link: '#reply'
  },
  {
    title: 'HR, Finance & Legal',
    description:
      'RoboTUM is an organization with more than 100 Members that needs a backbone to run on! If you want to help keep RoboTUM running, manage our Members, our Legal and Contractual obligations, or get some practical experience in Financial Accounting, RoboTUM needs you!',
    image: assets.hrFinanceLegal,
    link: '#hr-finance-legal'
  },
  {
    title: 'Community Engagement',
    description:
      'Help bring together the RoboTUM Community by planning cool events, Bar evenings, multi-day retreats, or anything else that could be fun!',
    image: assets.communityEngagement,
    link: '#community-engagement'
  },
  {
    title: 'Bookclub & DnD Project',
    description:
      'Want to engage with other RoboTUM members and discuss an interesting book or go on a DnD Campaign? Help organize it here!',
    image: assets.bookclubDnD,
    link: '#bookclub-dnd'
  },
  {
    title: 'Workshop Wednesday',
    description:
      'Creating Value for our Members by hosting and organizing Weekly Workshops to bring together the community and share knowledge. If you want to help create interesting events and share knowledge across our members, this is the right place for you!',
    image: assets.workshop,
    link: '#workshop'
  },
  {
    title: 'Generation Robotics: European Federation of Robotics Organizations',
    description:
      'RoboTUM goes International! We are planning to expand our network across Europe and engage with other Student initiatives from Zurich, Paris, London, Delft, and everywhere else. If you are interested in building an international community from the ground up, are interested in Event Planning, marketing, legal, or financial matters, help build this amazing platform!',
    image: assets.generation,
    link: '#generation'
  },
  {
    title: 'Robotics Student Precelerator',
    description:
      'In addition to bringing together Robotics Talent in Gen R, we also want to deliver a platform for entrepreneurially minded roboticists, set up workshops, engage with VC Funds, Industry Partners, Accelerators like EF, and other stakeholders, to build amazing deep tech/Robotics companies!',
    image: assets.precelerator,
    link: '#precelerator'
  },
  {
    title: 'Roboweek (industry + academic events)',
    description:
      'Planned for April next year, RoboTUM wants to bring together the whole Robotics Ecosystem from all over Germany and Europe and host a full week of amazing Robotics Events all over Munich!',
    image: assets.roboweek,
    link: '#roboweek'
  },
  {
    title: 'RoboTUM Podcast',
    description:
      'Our Podcast continues as it exists right now, but needs passionate talent to lift it to the next level, increase its reach, and find amazing Partners! Join now to spread the Robotics Gospel.',
    image: assets.podcast,
    link: '#podcast'
  },
  {
    title: 'Robo spark SUMMIT',
    description:
      'Unite with Bavaria\'s leading robotics and AI innovators at Google HQ Munich for a day of groundbreaking insights and game-changing connections.',
    image: assets.robospark,
    link: '#robospark'
  },
]

export default function ProjectSection() {
  const [current, setCurrent] = useState(0)

  const nextProject = () => {
    setCurrent((prev) => (prev + 1) % projects.length)
  }

  const prevProject = () => {
    setCurrent((prev) => (prev - 1 + projects.length) % projects.length)
  }

  return (
    <section
      id="projects"
      className="w-full px-6 py-24 text-white font-sans surface-1 edge-fade-top"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-12">
        {/* Left side */}
        <div className="md:w-1/2 relative text-center md:text-left min-h-[300px] sm:min-h-[360px] md:min-h-[420px]">
          <div
            key={current}
            className="transition-all duration-700 ease-in-out opacity-0 translate-x-6 animate-fadeIn"
          >
            <h2 className="text-[1.5rem] md:text-h2 font-bold mb-2 md:mb-4 [text-wrap:balance]">
              {projects[current].title}
            </h2>

            {/* Show description only on md and up */}
            <p className="hidden md:block text-text1 text-white/80 mb-6 leading-relaxed">
              {projects[current].description}
            </p>

            {/* Button for desktop */}
            <div className="hidden md:block">
              <Button
                variant="primary"
                as="link"
                to={projects[current].link}
                className="text-base px-6 py-3"
              >
                View more →
              </Button>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="md:w-1/2 relative flex flex-col items-center">
          <div
            key={current}
            className="transition-opacity duration-700 ease-in-out animate-fadeIn w-full"
          >
            <div className="relative w-full max-w-md mx-auto h-[300px] sm:h-[360px] md:h-[420px]">
              <div className="w-full h-full rounded-xl overflow-hidden">
                <img
                  src={projects[current].image}
                  alt={projects[current].title}
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Navigation buttons (visible on all sizes, positioned responsively) */}
              <button
                onClick={prevProject}
                aria-label="Previous project"
                className="flex items-center justify-center absolute left-2 md:-left-10 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-10 h-10 md:w-11 md:h-11 rounded-full transition-all z-10"
              >
                ←
              </button>
              <button
                onClick={nextProject}
                aria-label="Next project"
                className="flex items-center justify-center absolute right-2 md:-right-10 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-10 h-10 md:w-11 md:h-11 rounded-full transition-all z-10"
              >
                →
              </button>
            </div>
          </div>

          {/* Button for mobile */}
          <div className="mt-6 flex justify-center md:hidden">
            <Button
              variant="primary"
              as="link"
              to={projects[current].link}
              className="text-sm px-4 py-2"
            >
              View more →
            </Button>
          </div>
        </div>
      </div>

      {/* Dots indicator */}
      <div className="mt-10 flex justify-center gap-2">
        {projects.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === current ? 'bg-white' : 'bg-gray-400/40'
            }`}
          />
        ))}
      </div>
    </section>
  )
}