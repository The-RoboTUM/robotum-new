import * as assets from '@assets'

export const PROJECT_CATEGORIES = ['technical', 'operations', 'innovation'];

export const projects = [
  // TECHNICAL
  {
    slug: 'humanoid-project',
    title: 'Humanoid Project',
    category: 'technical',
    summary: 'Research & prototyping toward dynamic humanoid locomotion.',
    description: 'Longer copy for the detail page…',
    cover: assets.humanoid,
    tags: ['control', 'locomotion', 'hardware'],
    links: [{label: 'GitHub', href: '#'}],
  },
  {
    slug: 'creative-robotics',
    title: 'Creative Robotics',
    category: 'technical',
    summary: 'Expressive robots & HRI.',
    cover: assets.creativeRobotics,
    tags: ['HRI', 'interaction']
  },
  {
    slug: 'website-dev',
    title: 'Website Development',
    category: 'technical',
    summary: 'RoboTUM website and tooling.',
    cover: assets.websiteDevelopment,
    tags: ['frontend', 'infra']
  },
  {
    slug: 'itq-plastix',
    title: 'ITQ Plastix Project',
    category: 'technical',
    summary: 'Sustainable materials & robotics.',
    cover: assets.itqPlastix,
    tags: ['materials']
  },
  {
    slug: 'reply',
    title: 'Reply',
    category: 'technical',
    summary: 'Industry collaboration with Reply.',
    cover: assets.replyProject,
    tags: ['industry']
  },

  // OPERATIONS
  {
    slug: 'hr-finance-legal',
    title: 'HR, Finance & Legal',
    category: 'operations',
    summary: 'Backbone of RoboTUM operations.',
    cover: assets.hrFinanceLegal,
    tags: ['ops']
  },
  {
    slug: 'community-engagement',
    title: 'Community Engagement',
    category: 'operations',
    summary: 'Events, outreach, community.',
    cover: assets.communityEngagement,
    tags: ['events']
  },
  {
    slug: 'bookclub-dnd',
    title: 'Bookclub & DnD',
    category: 'operations',
    summary: 'Culture + learning tracks.',
    cover: assets.bookclubDnD,
    tags: ['community']
  },
  {
    slug: 'workshop-wednesday',
    title: 'Workshop Wednesday',
    category: 'operations',
    summary: 'Weekly hands-on workshops.',
    cover: assets.workshop,
    tags: ['learning']
  },

  // INNOVATION & ENTREPRENEURSHIP
  {
    slug: 'generation-robotics-efr',
    title: 'Generation Robotics: EFR',
    category: 'innovation',
    summary: 'European Federation of Robotics Organizations.',
    cover: assets.generation,
    tags: ['ecosystem']
  },
  {
    slug: 'student-precelerator',
    title: 'Robotics Student Precelerator',
    category: 'innovation',
    summary: 'From concept to pilot.',
    cover: assets.precelerator,
    tags: ['startup']
  },
  {
    slug: 'roboweek',
    title: 'Roboweek',
    category: 'innovation',
    summary: 'Industry + academic events.',
    cover: assets.roboweek,
    tags: ['events']
  },
  {
    slug: 'podcast',
    title: 'RoboTUM Podcast',
    category: 'innovation',
    summary: 'Conversations with builders.',
    cover: assets.podcast,
    tags: ['media']
  },
  {
    slug: 'robo-spark-summit',
    title: 'ROBO SPARK SUMMIT',
    category: 'innovation',
    summary: 'Summit for founders & researchers.',
    cover: assets.robospark,
    tags: ['summit']
  },
];