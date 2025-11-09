import * as assets from '@assets'

export const PROJECT_CATEGORIES = ['technical', 'operations', 'innovation'];

export const members = [
  {
    id: 'marco-faerber-gonzalez',
    name: 'Marco Färber-Gonzalez',
    role: 'Head of External Relations',
    email: 'outreach@robotum.info',
    phone: '+49 1573 8255775',
    photo: assets.member,
    team: 'operations',                    // for filtering tabs
    socials: { linkedin: '', github: '' },
    priority: 1                            // ordering within a team
  },
]