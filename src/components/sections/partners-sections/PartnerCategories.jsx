import * as assets from '@assets'
import Button from '@components/ui/Button'
import ImageFrame from '@components/ui/ImageFrame'

const partnerTypes = [
    {
        title: 'Lead Sponsors',
        partners: [
            { name: 'LIMX Dynamics', logo: assets.limx, link: 'https://limx.com' },
            { name: 'Maxon', logo: assets.maxon, link: 'https://maxonmotor.com' },
            { name: 'Reply Roboverse', logo: assets.reply, link: 'https://reply.com' },
        ]
    },
    {
        title: 'Sponsors',
        partners: [
            { name: 'CubeMars', logo: assets.cubemars, link: 'https://cubemars.com' },
            { name: 'Cadfem', logo: assets.cadfem, link: '#' },
            { name: 'Fort', logo: assets.fort, link: '#' },
            { name: 'MayTec', logo: assets.maytec, link: '#' },
        ]
    },
    {
        title: 'Industry Collaborators',
        partners: [
            { name: 'NVIDIA', logo: assets.nvidia, link: 'https://nvidia.com' },
            { name: 'UVC Partners', logo: assets.uvc, link: '#' },
            { name: '3Dconnexion', logo: assets.threeDConnexion, link: '#' },
            { name: 'Ansys', logo: assets.ansys, link: 'https://ansys.com' },
            { name: 'GATE', logo: assets.gate, link: 'https://gate.de' },
            { name: 'Makerspace', logo: assets.makerspace, link: '#' },
            { name: 'Siemens', logo: assets.siemens, link: 'https://siemens.com' },
        ]
    },
    {
        title: 'Academic Collaborators',
        partners: [
            { name: 'TUM', logo: assets.tum, link: 'https://tum.de' },
            { name: 'Max Planck Institute', logo: assets.maxPlanck, link: 'https://mpg.de/en' },
            { name: 'Applied Mechanics', logo: assets.appliedMechanics, link: '#' },
            { name: 'TUM Venture Labs', logo: assets.tumVenture, link: 'https://tumventurelabs.com' },
            { name: 'MiRMI', logo: assets.mirmi, link: 'https://mirmi.de' },
            { name: 'KU Leuven', logo: assets.kuLeuven, link: 'https://kuleuven.be' },
        ]
    }
]

const PartnerCategories = () => {
    return (
        <div className="grid gap-12">
            {partnerTypes.map((partnerType, idx) => (
                <div key={idx}>
                    <h2 className="heading heading-h2 font-bold text-center mb-6">{partnerType.title}</h2>
                    <div className="flex justify-center gap-8 flex-wrap">
                        {partnerType.partners.map((partner, index) => (
                            <a
                                key={index}
                                href={partner.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-32 h-32 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-white/10"
                            >
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="w-24 h-24 object-contain"
                                />
                            </a>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PartnerCategories