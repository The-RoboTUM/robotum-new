import * as assets from '@assets'

const sponsors = [
    { name: 'LIMX Dynamics', image: assets.limx, tier: 'Lead Sponsor' },
    { name: 'Maxon', image: assets.maxon, tier: 'Lead Sponsor' },
    { name: 'Reply Roboverse', image: assets.reply, tier: 'Lead Sponsor' },
    { name: 'CubeMars', image: assets.cubemars, tier: 'Sponsor' },
    { name: 'Olive Robotics', image: assets.olive, tier: 'Sponsor' }
]

export default function PartnersSection() {
    return (
        <section className="w-full py-10 font-sans surface-light edge-fade-top flex justify-center">
            <div className="w-full rounded-lg overflow-hidden">
                <div className="flex gap-8 py-3 px-4 whitespace-nowrap overflow-hidden">
                    <div className="flex gap-12 animate-marquee">
                        {[...sponsors, ...sponsors].map((sponsor, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center justify-center min-w-[160px]"
                            >
                                <span className="mb-1 px-3 py-0.5 border border-blue-500 text-xs rounded-full text-blue-500">
                                    {sponsor.tier}
                                </span>
                                <img
                                    src={sponsor.image}
                                    alt={sponsor.name}
                                    className="h-8 sm:h-10 object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}