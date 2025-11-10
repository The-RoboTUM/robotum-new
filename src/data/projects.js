import * as assets from "@assets";

export const PROJECT_CATEGORIES = ["technical", "operations", "innovation"];

export const TABS = [
  { key: "technical", label: "Technical" },
  { key: "operations", label: "Operations" },
  { key: "innovation", label: "Innovation & Entrepreneurship" },
];

export const projects = [
  // TECHNICAL
  {
    slug: "humanoid-project",
    title: "Humanoid Project",
    category: "technical",
    summary: "Research & prototyping toward dynamic humanoid locomotion.",
    description:
      "Building the world's fastest and most energy-efficient Bipedal Robot. Design, Test, and iterate on hardware systems, work on our RL learning in Simulation, or come up with business proposals for its use cases. The Humanoid project needs every kind of background, from Tech to Marketing and Business! Help push the main technical Project of RoboTUM and revolutionize Humanoids!",
    cover: assets.humanoid,
    tags: ["control", "locomotion", "hardware"],
  },
  {
    slug: "creative-robotics",
    title: "Creative Robotics",
    category: "technical",
    summary: "Expressive robots & HRI.",
    description:
      "Building awesome robotics stuff with the abundance of resources we have gathered over the past year. Build cocktail mixing robots, self-positioning trash bins, or anything else that comes to your mind. The end goal for every project should be to present at some event somewhere, in order to create value for RoboTUM.",
    cover: assets.creativeRobotics,
    tags: ["HRI", "interaction"],
  },
  {
    slug: "website-dev",
    title: "Website Development",
    category: "technical",
    summary: "RoboTUM website and tooling.",
    description:
      "From our Partnership with TU Design last Semester, we have an amazing website design waiting to be implemented. Help to shape RoboTUM's online presence and work on your web development skills!",
    cover: assets.websiteDevelopment,
    tags: ["frontend", "infra"],
    links: [{ label: "GitHub", href: "#" }],
  },
  {
    slug: "itq-plastix",
    title: "ITQ Plastix Project",
    category: "technical",
    summary: "Sustainable materials & robotics.",
    description:
      "Together with our Partner ITQ, we are starting the PlastiX Project to clean our Beaches of Trash! Work closely together under our Partners supervision to develop an autonomous Robotic system consisting of drones and wheeled robots, to scan and clear beaches from Plastic. This project needs both Hardware and Software support. If you want to build robots and help our Planet while doing so, this is the place for you!",
    cover: assets.itqPlastix,
    tags: ["materials"],
  },
  {
    slug: "reply",
    title: "Reply",
    category: "technical",
    summary: "Industry collaboration with Reply.",
    description:
      "Together with our sponsor, Reply, we're developing a cutting-edge software stack that expands on the autonomous capabilities of the PUMA Quadruped robot. This project is right for you if your focus is on software in autonomous systems!",
    cover: assets.replyProject,
    tags: ["industry"],
  },

  // OPERATIONS
  {
    slug: "hr-finance-legal",
    title: "HR, Finance & Legal",
    category: "operations",
    summary: "Backbone of RoboTUM operations.",
    description:
      "RoboTUM is an organization with more than 100 Members that needs a backbone to run on! If you want to help keep RoboTUM running, manage our Members, our Legal and Contractual obligations, or get some practical experience in Financial Accounting, RoboTUM needs you!",
    cover: assets.hrFinanceLegal,
    tags: ["ops"],
  },
  {
    slug: "community-engagement",
    title: "Community Engagement",
    category: "operations",
    summary: "Events, outreach, community.",
    description:
      "Help bring together the RoboTUM Community by planning cool events, Bar evenings, multi-day retreats, or anything else that could be fun!",
    cover: assets.communityEngagement,
    tags: ["events"],
  },
  {
    slug: "bookclub-dnd",
    title: "Bookclub & DnD",
    category: "operations",
    summary: "Culture + learning tracks.",
    description:
      "Want to engage with other RoboTUM members and discuss an interesting book or go on a DnD Campaign? Help organize it here!",
    cover: assets.bookclubDnD,
    tags: ["community"],
  },
  {
    slug: "workshop-wednesday",
    title: "Workshop Wednesday",
    category: "operations",
    summary: "Weekly hands-on workshops.",
    description:
      "Creating Value for our Members by hosting and organizing Weekly Workshops to bring together the community and share knowledge. If you want to help create interesting events and share knowledge across our members, this is the right place for you!",
    cover: assets.workshop,
    tags: ["learning"],
  },

  // INNOVATION & ENTREPRENEURSHIP
  {
    slug: "generation-robotics-efr",
    title: "Generation Robotics: EFR",
    category: "innovation",
    summary: "European Federation of Robotics Organizations.",
    description:
      "RoboTUM goes International! We are planning to expand our network across Europe and engage with other Student initiatives from Zurich, Paris, London, Delft, and everywhere else. If you are interested in building an international community from the ground up, are interested in Event Planning, marketing, legal, or financial matters, help build this amazing platform!",
    cover: assets.generation,
    tags: ["ecosystem"],
  },
  {
    slug: "student-precelerator",
    title: "Robotics Student Precelerator",
    category: "innovation",
    summary: "From concept to pilot.",
    description:
      "In addition to bringing together Robotics Talent in Gen R, we also want to deliver a platform for entrepreneurially minded roboticists, set up workshops, engage with VC Funds, Industry Partners, Accelerators like EF, and other stakeholders, to build amazing deep tech/Robotics companies!",
    cover: assets.precelerator,
    tags: ["startup"],
  },
  {
    slug: "roboweek",
    title: "Roboweek",
    category: "innovation",
    summary: "Industry + academic events.",
    description:
      "Planned for April next year, RoboTUM wants to bring together the whole Robotics Ecosystem from all over Germany and Europe and host a full week of amazing Robotics Events all over Munich!",
    cover: assets.roboweek,
    tags: ["events"],
  },
  {
    slug: "podcast",
    title: "RoboTUM Podcast",
    category: "innovation",
    summary: "Conversations with builders.",
    description:
      "Our Podcast continues as it exists right now, but needs passionate talent to lift it to the next level, increase its reach, and find amazing Partners! Join now to spread the Robotics Gospel.",
    cover: assets.podcast,
    tags: ["media"],
  },
  {
    slug: "robo-spark-summit",
    title: "ROBO SPARK SUMMIT",
    category: "innovation",
    summary: "Summit for founders & researchers.",
    description:
      "Unite with Bavaria's leading robotics and AI innovators at Google HQ Munich for a day of groundbreaking insights and game-changing connections.",
    cover: assets.robospark,
    tags: ["summit"],
  },
];
