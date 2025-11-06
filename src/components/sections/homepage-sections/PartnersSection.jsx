import * as assets from '@assets'

const partners = [
  // Lead Sponsors
  { name: 'LIMX Dynamics', image: assets.limx, tier: 'Lead Sponsor' },
  { name: 'Maxon', image: assets.maxon, tier: 'Lead Sponsor' },
  { name: 'Reply Roboverse', image: assets.reply, tier: 'Lead Sponsor' },

  // Sponsors
  { name: 'CubeMars', image: assets.cubemars, tier: 'Sponsor' },
  { name: 'Cadfem', image: assets.cadfem, tier: 'Sponsor' },
  { name: 'Fort', image: assets.fort, tier: 'Sponsor' },
  { name: 'Maytec', image: assets.maytec, tier: 'Sponsor' },

  // Industry Collaborators
  { name: 'NVIDIA', image: assets.nvidia, tier: 'Industry Collaborator' },
  { name: 'UVC', image: assets.uvc, tier: 'Industry Collaborator' },
  { name: '3Dconnexion', image: assets.threeDConnexion, tier: 'Industry Collaborator' },
  { name: 'Ansys', image: assets.ansys, tier: 'Industry Collaborator' },
  { name: 'GATE', image: assets.gate, tier: 'Industry Collaborator' },
  { name: 'Makerspace', image: assets.makerspace, tier: 'Industry Collaborator' },
  { name: 'Siemens', image: assets.siemens, tier: 'Industry Collaborator' },

  // Academic Collaborators
  { name: 'TUM', image: assets.tum, tier: 'Academic Collaborator' },
  { name: 'Max Planck Institute', image: assets.maxPlanck, tier: 'Academic Collaborator' },
  { name: 'Applied Mechanics', image: assets.appliedMechanics, tier: 'Academic Collaborator' },
  { name: 'TUM Venture Labs', image: assets.tumVenture, tier: 'Academic Collaborator' },
  { name: 'MIRMI', image: assets.mirmi, tier: 'Academic Collaborator' },
  { name: 'KU Leuven', image: assets.kuLeuven, tier: 'Academic Collaborator' },
]

export default function PartnersSection() {
  return (
    <section
      className="w-full py-12 md:py-16 font-sans surface-light edge-fade-top edge-fade-bottom flex justify-center"
      role="region"
      aria-labelledby="partners-heading"
    >
      <div className="relative w-full max-w-7xl overflow-hidden">
        {/* Accessible heading (visually hidden) */}
        <h2 id="partners-heading" className="sr-only">
          Our Sponsors & Partners
        </h2>

        {/* Left/Right gradient fades to soften edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-24 bg-linear-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-24 bg-linear-to-l from-white to-transparent" />

        {/* Marquee lane */}
        <div className="flex gap-10 py-4 px-4 whitespace-nowrap overflow-hidden">
          <div
            className="flex gap-12 items-center animate-marquee animate-marquee-slow"
            role="list"
            aria-label="Sponsor logos"
          >
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                role="listitem"
                className="flex flex-col items-center justify-center min-w-[140px] sm:min-w-40"
              >
                <span className="mb-1 px-3 py-0.5 border border-accent text-xs rounded-full text-accent bg-accent/5">
                  {partner.tier}
                </span>
                <img
                  src={partner.image}
                  alt={partner.name}
                  className="h-8 sm:h-10 md:h-12 object-contain opacity-90 hover:opacity-100 transition-opacity"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}