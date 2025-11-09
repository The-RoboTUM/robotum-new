import * as assets from '@assets'

export const PARTNER_CATEGORIES = [
  'Lead Sponsors',
  'Sponsors',
  'Industry Collaborators',
  'Academic Collaborators',
];

export const partners = [
  {
    title: 'Lead Sponsors',
    partners: [
      { id: 'limx', name: 'LIMX Dynamics', logo: assets.limx, link: 'https://limx.com' },
      { id: 'maxon', name: 'Maxon', logo: assets.maxon, link: 'https://maxongroup.com' },
      { id: 'reply', name: 'Reply Roboverse', logo: assets.reply, link: 'https://reply.com' },
    ],
  },
  {
    title: 'Sponsors',
    partners: [
      { id: 'cubemars', name: 'CubeMars', logo: assets.cubemars, link: 'https://cubemars.com' },
      { id: 'cadfem', name: 'Cadfem', logo: assets.cadfem, link: '#' },
      { id: 'fort', name: 'Fort', logo: assets.fort, link: '#' },
      { id: 'maytec', name: 'MayTec', logo: assets.maytec, link: '#' },
    ],
  },
  {
    title: 'Industry Collaborators',
    partners: [
      { id: 'nvidia', name: 'NVIDIA', logo: assets.nvidia, link: 'https://nvidia.com' },
      { id: 'uvc', name: 'UVC Partners', logo: assets.uvc, link: '#' },
      { id: '3dconnexion', name: '3Dconnexion', logo: assets.threeDConnexion, link: '#' },
      { id: 'ansys', name: 'Ansys', logo: assets.ansys, link: 'https://ansys.com' },
      { id: 'gate', name: 'GATE', logo: assets.gate, link: 'https://gate.de' },
      { id: 'makerspace', name: 'Makerspace', logo: assets.makerspace, link: '#' },
      { id: 'siemens', name: 'Siemens', logo: assets.siemens, link: 'https://siemens.com' },
    ],
  },
  {
    title: 'Academic Collaborators',
    partners: [
      { id: 'tum', name: 'TUM', logo: assets.tum, link: 'https://tum.de' },
      { id: 'mpg', name: 'Max Planck Institute', logo: assets.maxPlanck, link: 'https://mpg.de/en' },
      { id: 'appliedMech', name: 'Applied Mechanics', logo: assets.appliedMechanics, link: '#' },
      { id: 'tumVenture', name: 'TUM Venture Labs', logo: assets.tumVenture, link: 'https://tumventurelabs.com' },
      { id: 'mirmi', name: 'MiRMI', logo: assets.mirmi, link: 'https://mirmi.de' },
      { id: 'kuLeuven', name: 'KU Leuven', logo: assets.kuLeuven, link: 'https://kuleuven.be' },
    ],
  },
];