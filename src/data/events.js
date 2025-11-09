import * as assets from '@assets'

export const EVENT_CATEGORIES = ['Hackathons', 'Info events', 'Conference', 'Workshops', 'Meetups'];

export const events = [
  {
    id: 'roboweek-2025',
    title: 'Roboweek',
    type: 'Conference',                    
    start: '2025-02-10',
    end: '2025-02-14',
    location: 'TUM Garching',
    cover: assets.event1,
    blurb: 'Industry + academic events...',
    links: { register: '',},
    past: true                             // or compute: new Date(end) < today
  },
]