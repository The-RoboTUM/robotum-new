import * as assets from '@assets'

// High-level categories for filtering and display
export const PROJECT_CATEGORIES = ['technical', 'operations', 'innovation']
export const MEMBER_CATEGORIES = ['All', 'Founders', 'Department Leads', 'Project Leads', 'Members']

export const members = [
  // === Founders ===
  {
    id: 'jonas-schneider',
    name: 'Jonas Schneider',
    role: 'Co-Founder & Technical Lead',
    email: 'jonas.schneider@robotum.info',
    phone: '+49 176 12345678',
    photo: assets.memberJonas,
    team: 'technical',
    socials: {
      linkedin: 'https://linkedin.com/in/jonas-schneider',
      github: 'https://github.com/jonasschneider'
    },
    category: 'Founders',
    priority: 1
  },
  {
    id: 'marco-faerber-gonzalez',
    name: 'Marco Färber-Gonzalez',
    role: 'Co-Founder & Head of External Relations',
    email: 'outreach@robotum.info',
    phone: '+49 1573 8255775',
    photo: assets.memberMarco,
    team: 'operations',
    socials: {
      linkedin: 'https://linkedin.com/in/marco-faerber',
      github: ''
    },
    category: 'Founders',
    priority: 2
  },

  // === Department Leads ===
  {
    id: 'lena-wolf',
    name: 'Lena Wolf',
    role: 'Head of Operations & Finance',
    email: 'lena.wolf@robotum.info',
    phone: '+49 172 9345678',
    photo: assets.memberLena,
    team: 'operations',
    socials: {
      linkedin: 'https://linkedin.com/in/lena-wolf',
      github: ''
    },
    category: 'Department Leads',
    priority: 1
  },
  {
    id: 'tobias-keller',
    name: 'Tobias Keller',
    role: 'Head of Innovation & Entrepreneurship',
    email: 'tobias.keller@robotum.info',
    phone: '+49 176 88234567',
    photo: assets.memberTobias,
    team: 'innovation',
    socials: {
      linkedin: 'https://linkedin.com/in/tobias-keller',
      github: 'https://github.com/tobiaskeller'
    },
    category: 'Department Leads',
    priority: 1
  },
  {
    id: 'emily-stein',
    name: 'Emily Stein',
    role: 'Head of Creative Robotics',
    email: 'emily.stein@robotum.info',
    phone: '',
    photo: assets.memberEmily,
    team: 'technical',
    socials: {
      linkedin: 'https://linkedin.com/in/emily-stein',
      github: 'https://github.com/emilystein'
    },
    category: 'Department Leads',
    priority: 2
  },

  // === Project Leads ===
  {
    id: 'maximilian-bauer',
    name: 'Maximilian Bauer',
    role: 'Lead - Humanoid Project',
    email: 'max.bauer@robotum.info',
    phone: '',
    photo: assets.memberMax,
    team: 'technical',
    socials: {
      linkedin: 'https://linkedin.com/in/maxbauer',
      github: 'https://github.com/maxbauer'
    },
    category: 'Project Leads',
    priority: 1
  },
  {
    id: 'sarah-nguyen',
    name: 'Sarah Nguyen',
    role: 'Lead - Robotics Student Precelerator',
    email: 'sarah.nguyen@robotum.info',
    phone: '',
    photo: assets.memberSarah,
    team: 'innovation',
    socials: {
      linkedin: 'https://linkedin.com/in/sarahnguyen',
      github: ''
    },
    category: 'Project Leads',
    priority: 2
  },

  // === Members ===
  {
    id: 'philipp-meyer',
    name: 'Philipp Meyer',
    role: 'Mechanical Engineer - Humanoid Project',
    email: 'philipp.meyer@robotum.info',
    photo: assets.memberPhilipp,
    team: 'technical',
    socials: { linkedin: '', github: '' },
    category: 'Members',
    priority: 1
  },
  {
    id: 'nina-kim',
    name: 'Nina Kim',
    role: 'Marketing & Community Engagement',
    email: 'nina.kim@robotum.info',
    photo: assets.memberNina,
    team: 'operations',
    socials: { linkedin: '', github: '' },
    category: 'Members',
    priority: 2
  }
]