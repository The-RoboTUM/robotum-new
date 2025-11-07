export const PROJECT_CATEGORIES = ['technical', 'operations', 'innovation'];

export const projects = [
  // TECHNICAL
  {
    slug: 'humanoid-project',
    title: 'Humanoid Project',
    category: 'technical',
    summary: 'Research & prototyping toward dynamic humanoid locomotion.',
    description: 'Longer copy for the detail page…',
    cover: '/assets/projects/humanoid.jpg',
    tags: ['control', 'locomotion', 'hardware'],
    links: [{ label: 'GitHub', href: '#' }],
  },
  { slug: 'creative-robotics', title: 'Creative Robotics', category: 'technical', summary: 'Expressive robots & HRI.', cover: '/assets/projects/creative-robotics.jpg', tags: ['HRI','interaction'] },
  { slug: 'website-dev', title: 'Website Development', category: 'technical', summary: 'RoboTUM website and tooling.', cover: '/assets/projects/website.jpg', tags: ['frontend','infra'] },
  { slug: 'itq-plastix', title: 'ITQ Plastix Project', category: 'technical', summary: 'Sustainable materials & robotics.', cover: '/assets/projects/itq.jpg', tags: ['materials'] },
  { slug: 'reply', title: 'Reply', category: 'technical', summary: 'Industry collaboration with Reply.', cover: '/assets/projects/reply.jpg', tags: ['industry'] },

  // OPERATIONS
  { slug: 'hr-finance-legal', title: 'HR, Finance & Legal', category: 'operations', summary: 'Backbone of RoboTUM operations.', cover: '/assets/projects/ops-hr.jpg', tags: ['ops'] },
  { slug: 'community-engagement', title: 'Community Engagement', category: 'operations', summary: 'Events, outreach, community.', cover: '/assets/projects/ops-community.jpg', tags: ['events'] },
  { slug: 'bookclub-dnd', title: 'Bookclub & DnD', category: 'operations', summary: 'Culture + learning tracks.', cover: '/assets/projects/ops-bookclub.jpg', tags: ['community'] },
  { slug: 'workshop-wednesday', title: 'Workshop Wednesday', category: 'operations', summary: 'Weekly hands-on workshops.', cover: '/assets/projects/ops-workshop.jpg', tags: ['learning'] },

  // INNOVATION & ENTREPRENEURSHIP
  { slug: 'generation-robotics-efr', title: 'Generation Robotics: EFR', category: 'innovation', summary: 'European Federation of Robotics Organizations.', cover: '/assets/projects/innov-efr.jpg', tags: ['ecosystem'] },
  { slug: 'student-precelerator', title: 'Robotics Student Precelerator', category: 'innovation', summary: 'From concept to pilot.', cover: '/assets/projects/innov-precelerator.jpg', tags: ['startup'] },
  { slug: 'roboweek', title: 'Roboweek', category: 'innovation', summary: 'Industry + academic events.', cover: '/assets/projects/innov-roboweek.jpg', tags: ['events'] },
  { slug: 'podcast', title: 'RoboTUM Podcast', category: 'innovation', summary: 'Conversations with builders.', cover: '/assets/projects/innov-podcast.jpg', tags: ['media'] },
  { slug: 'robo-spark-summit', title: 'ROBO SPARK SUMMIT', category: 'innovation', summary: 'Summit for founders & researchers.', cover: '/assets/projects/innov-summit.jpg', tags: ['summit'] },
];