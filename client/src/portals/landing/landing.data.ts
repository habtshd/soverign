import { 
  PillarItem, 
  SystemNode, 
  FounderMilestone, 
  ExperienceStep, 
  EventTimelineItem, 
  TargetAudienceProfile, 
  VisionCategory 
} from './landing.types.js';

export const BRAND_CONFIG = {
  name: "SOVEREIGN MEN'S CLUB",
  tagline: "Build the man. Strengthen the brotherhood. Create the legacy.",
  motto: "Discipline. Brotherhood. Purpose. Growth. Legacy.",
  description: "Sovereign Men's Club is a private ecosystem designed to help men develop themselves, connect with like-minded men, pursue meaningful goals, and build lasting relationships.",
  foundingYear: "[FOUNDING YEAR]",
  headquarters: "[FOUNDING LOCATION]",
};

export const FOUNDER_STORY: {
  name: string;
  title: string;
  portraitPlaceholder: string;
  summary: string;
  milestones: FounderMilestone[];
  message: {
    heading: string;
    body: string[];
    signatureTitle: string;
    signatureDate: string;
  };
} = {
  name: "[FOUNDER NAME]",
  title: "Founder, Sovereign Men's Club",
  portraitPlaceholder: "[FOUNDER PORTRAIT / VISUAL REVEAL]",
  summary: "[FOUNDER STORY] — Rooted in [FOUNDING LOCATION], born out of [KEY EXPERIENCE] and a relentless refusal to accept the spiritual, physical, and relational dilution of modern manhood.",
  milestones: [
    {
      stage: "ORIGIN",
      title: "The Crucible of Solitude",
      subtitle: "[FOUNDING LOCATION] • [FOUNDING YEAR]",
      narrative: "Born from the observation of a generation adrift—men surrounded by digital noise yet starved of authentic comradeship, rigorous standards, and tested guidance.",
      year: "ORIGIN"
    },
    {
      stage: "THE REALIZATION",
      title: "The Silent Epidemic of Comfort",
      subtitle: "[KEY EXPERIENCE]",
      narrative: "A profound understanding that passive consumerism, unchecked vices, and lack of accountability were actively eroding the masculine capacity to lead, protect, and build.",
      year: "PHASE 01"
    },
    {
      stage: "THE CHALLENGE",
      title: "Testing the Fire",
      subtitle: "[WHY HE STARTED SOVEREIGN]",
      narrative: "Assembling an initial cadre of committed men. Proving that true brotherhood is not formed through casual chatter in social apps, but through shared sacrifice, physical hardship, and unapologetic truth.",
      year: "PHASE 02"
    },
    {
      stage: "THE VISION",
      title: "The Architecture of Sovereignty",
      subtitle: "Beyond Transient Motivation",
      narrative: "Conceiving a permanent, structured institution combining ancient code, physical discipline, economic mastery, and a modern digital command system.",
      year: "PHASE 03"
    },
    {
      stage: "SOVEREIGN",
      title: "An International Order of Men",
      subtitle: "The Standard Established",
      narrative: "Today, Sovereign Men's Club stands as an uncompromising standard. A sovereign haven where brothers hold each other accountable to highest honor, stewardship, and legacy.",
      year: "PRESENT"
    }
  ],
  message: {
    heading: "A Message From The Founder",
    body: [
      "[FOUNDER MESSAGE] — \"To the man reading these words: do not seek an easy life. Seek the strength to endure a meaningful one.",
      "The world will gladly sell you comfort, distraction, and hollow validation until your vitality is spent and your potential is a ghost of what could have been.",
      "Sovereign Men's Club was founded on a singular premise: iron sharpens iron. When men of discipline stand side-by-side, hold each other to unflinching truth, and labor toward generational purpose, impossible standards become daily habits.",
      "If you are satisfied with mediocrity, this is not your home. But if there is a fire in your chest demanding more of who you are, take your place beside us.\""
    ],
    signatureTitle: "Founder & Sovereign Council",
    signatureDate: "Est. [FOUNDING YEAR]"
  }
};

export const WHAT_WE_ARE_BUILDING: {
  title: string;
  subtitle: string;
  tenets: { label: string; detail: string; category: string }[];
} = {
  title: "What Are We Building?",
  subtitle: "Sovereign Men's Club is not a temporary community; it is an enduring institution forged across ten interconnected dimensions of manhood.",
  tenets: [
    { label: "Stronger Men", detail: "Tempered in physical vitality, mental clarity, and spiritual fortitude.", category: "Core Self" },
    { label: "Stronger Relationships", detail: "Loyalty, honor, and deep mutual trust that withstands external chaos.", category: "Brotherhood" },
    { label: "Stronger Communities", detail: "Men who serve, protect, and anchor their local cities and families.", category: "Impact" },
    { label: "Leadership", detail: "Self-governance established first before attempting to direct others.", category: "Command" },
    { label: "Discipline", detail: "Daily non-negotiables executed consistently over passing emotions.", category: "Standard" },
    { label: "Purpose", detail: "Clarity of mission, directional conviction, and strategic life focus.", category: "Vision" },
    { label: "Personal Responsibility", detail: "Zero excuses. Total ownership of outcomes, responses, and failures.", category: "Accountability" },
    { label: "Continuous Development", detail: "Lifelong mastery of craft, finances, leadership, and emotional control.", category: "Mastery" },
    { label: "Meaningful Contribution", detail: "Mentoring junior aspirants, funding initiatives, and uplifting the ranks.", category: "Service" },
    { label: "Long-term Legacy", detail: "Building reputations, enterprises, and bloodlines that outlive the moment.", category: "Eternity" }
  ]
};

export const THE_SOVEREIGN_SYSTEM: {
  title: string;
  subtitle: string;
  nodes: SystemNode[];
} = {
  title: "One Ecosystem. One Brotherhood.",
  subtitle: "A unified digital and real-world operating platform that seamlessly integrates every aspect of masculine self-development, brotherhood accountability, and council governance.",
  nodes: [
    { id: "members", label: "MEMBERS", description: "Vetted aspirants inducted under the Sovereign standard.", status: "ACTIVE", category: "CORE" },
    { id: "profile", label: "PERSONAL PROFILE", description: "Digital credential, MAN identification, and sovereign verification.", status: "ACTIVE", category: "CORE" },
    { id: "goals", label: "GOALS", description: "Quarterly objectives across physical, business, and character standards.", status: "ACTIVE", category: "DEVELOPMENT" },
    { id: "activities", label: "ACTIVITIES", description: "Daily physical training, morning routines, and disciplined habits.", status: "ACTIVE", category: "DEVELOPMENT" },
    { id: "learning", label: "LEARNING", description: "Curated masterclasses, leadership curriculum, and strategic literature.", status: "ACTIVE", category: "DEVELOPMENT" },
    { id: "community", label: "COMMUNITY", description: "Dedicated council discussions, squad communication, and mutual counsel.", status: "ACTIVE", category: "NETWORK" },
    { id: "events", label: "EVENTS", description: "Exclusive summits, regional rucks, workout meets, and conclaves.", status: "ACTIVE", category: "NETWORK" },
    { id: "progress", label: "PROGRESS", description: "Real-time biometric, service, and milestone tracking without delusion.", status: "ACTIVE", category: "CORE" },
    { id: "accountability", label: "ACCOUNTABILITY", description: "Squad leader checkpoints, peer check-ins, and failure reports.", status: "ACTIVE", category: "CORE" }
  ]
};

export const INSIDE_EXPERIENCE: ExperienceStep[] = [
  {
    number: "01",
    title: "ENTER",
    subtitle: "Cross the Threshold",
    description: "Submit your readiness application. Undergo council intake screening, receive your unique MAN identifier, and step onto the sovereign path.",
    details: ["38-Question Readiness Application", "Council Identity Issuance", "Welcome Orientation & Covenant"]
  },
  {
    number: "02",
    title: "CONNECT",
    subtitle: "Meet Men Who Build",
    description: "Connect immediately with men who share ambition, timeless values, and uncompromising purpose across chapters worldwide.",
    details: ["Regional Squad Placement", "Accountability Pairing", "Direct Encrypted Comms"]
  },
  {
    number: "03",
    title: "DEVELOP",
    subtitle: "Systematic Personal Mastery",
    description: "Forge physical vitality, sharpen business acumen, refine leadership capability, and build daily habits that reject complacency.",
    details: ["Leadership Video Curricula", "Reading & Mastery Standards", "Fitness Benchmarks"]
  },
  {
    number: "04",
    title: "CHALLENGE",
    subtitle: "Beyond the Comfort Zone",
    description: "Participate in structured brotherhood challenges, weighted rucks, cold exposure, fasting disciplines, and mental fortitude exercises.",
    details: ["Monthly Operational Challenges", "Squad Leaderboards", "Physical Standard Verification"]
  },
  {
    number: "05",
    title: "CONTRIBUTE",
    subtitle: "Strengthen the Collective",
    description: "Bring tangible value to fellow brothers through professional collaboration, peer mentorship, community service, and council leadership.",
    details: ["Community Service Hours", "Peer Knowledge Sharing", "Squad Mentorship"]
  },
  {
    number: "06",
    title: "GROW",
    subtitle: "Generational Evolution",
    description: "Track your transformation over years. Advance through council tiers, earn leadership standing, and leave an indelible mark.",
    details: ["Lifetime Conclave Standing", "Executive Council Elevation", "Generational Impact"]
  }
];

export const THE_PILLARS: PillarItem[] = [
  {
    id: "discipline",
    title: "DISCIPLINE",
    tagline: "Consistency over comfort.",
    description: "The unwavering execution of duty regardless of emotion, fatigue, or mood. We measure a man not by how he speaks in victory, but by his standard when nobody is watching.",
    quote: "A sovereign man does what must be done, even when every impulse cries for comfort.",
    iconName: "Shield"
  },
  {
    id: "brotherhood",
    title: "BROTHERHOOD",
    tagline: "Relationships built through trust and shared experience.",
    description: "Not casual social networking, but an ironclad pact. Men who speak hard truths into your life, celebrate your genuine triumphs, and stand beside you in hardship.",
    quote: "Iron sharpens iron; so one man sharpens another.",
    iconName: "Users"
  },
  {
    id: "purpose",
    title: "PURPOSE",
    tagline: "Know what you are building and why.",
    description: "Rejection of wandering existence. Every brother identifies his primary mission—in family, craft, and community—and aligns his daily hours toward that singular peak.",
    quote: "A man without a mission is at the mercy of every distraction.",
    iconName: "Compass"
  },
  {
    id: "growth",
    title: "GROWTH",
    tagline: "Never stop developing.",
    description: "Physical strength, intellectual depth, emotional control, and financial sovereignty. Stagnation is the quiet death of potential; we demand continuous ascension.",
    quote: "The day you stop growing is the day you begin decay.",
    iconName: "TrendingUp"
  },
  {
    id: "leadership",
    title: "LEADERSHIP",
    tagline: "Lead yourself before leading others.",
    description: "Authority earned through personal responsibility and competence. A sovereign man leads his household, his team, and his brothers by living the standard first.",
    quote: "He who cannot govern himself cannot govern a household or a nation.",
    iconName: "Award"
  },
  {
    id: "legacy",
    title: "LEGACY",
    tagline: "Build something that outlives the moment.",
    description: "We work for what will stand 50 years from now. Strong sons, thriving enterprises, honored names, and enduring institutions that testify to a life well-fought.",
    quote: "What we do in this brotherhood echoes into the generations that follow.",
    iconName: "Crown"
  }
];

export const EVENTS_EXPERIENCES: EventTimelineItem[] = [
  {
    id: "summit",
    title: "Annual Sovereign Conclave",
    category: "EXECUTIVE ASSEMBLY",
    format: "IN_PERSON",
    location: "Addis Ababa & Regional Retreat Centers",
    seasonOrFrequency: "Annual Flagship",
    description: "A three-day high-elevation gathering of brotherhood leaders, keynote council lectures, strategic planning, and sacred initiation ceremonies.",
    status: "ESTABLISHED"
  },
  {
    id: "ruck",
    title: "Brotherhood Ruck & Standard March",
    category: "PHYSICAL CRUCIBLE",
    format: "IN_PERSON",
    location: "Entoto Mountain Trails & Selected Chapters",
    seasonOrFrequency: "Monthly Discipline",
    description: "Weighted 20kg ruck marches testing endurance, grit, and cohesion across varied terrain. Followed by brotherhood fireside fellowship.",
    status: "ESTABLISHED"
  },
  {
    id: "masterclass",
    title: "Council Masterminds & Tactical Forums",
    category: "KNOWLEDGE MASTERY",
    format: "HYBRID",
    location: "Sovereign Command Center & Virtual",
    seasonOrFrequency: "Bi-Weekly",
    description: "Intensive sessions exploring capital allocation, real estate, psychological resilience, classical philosophy, and legal sovereignty.",
    status: "ESTABLISHED"
  },
  {
    id: "challenges",
    title: "90-Day Operational Challenges",
    category: "DISCIPLINE STANDARD",
    format: "VIRTUAL",
    location: "Global Platform Ecosystem",
    seasonOrFrequency: "Quarterly Cadence",
    description: "Strict daily accountability protocols monitoring training, cold showers, reading, fasting, and digital detox.",
    status: "ESTABLISHED"
  },
  {
    id: "global",
    title: "International Diaspora Expeditions",
    category: "EXPEDITION & SERVICE",
    format: "IN_PERSON",
    location: "Dubai, East Africa & North America",
    seasonOrFrequency: "Coming 2026/2027",
    description: "Expanding regional conclaves for brothers in the diaspora to align investments, foster brotherhood, and establish sovereign outposts.",
    status: "COMING_SOON"
  }
];

export const THE_SCROLL_JOURNEY = [
  { step: "DISCOVER", text: "Awaken to the reality that comfort is the enemy of masculine destiny." },
  { step: "JOIN", text: "Submit your readiness application and declare your intent with honor." },
  { step: "CONNECT", text: "Integrate with a squad of men who hold you to uncompromising accountability." },
  { step: "BUILD", text: "Construct your daily routine, physical power, and strategic mission." },
  { step: "LEAD", text: "Command your impulses, anchor your family, and direct your enterprise." },
  { step: "CONTRIBUTE", text: "Invest into the rising generation of brothers and serve your community." },
  { step: "LEAVE A LEGACY", text: "Stand as a landmark of strength that endures beyond your lifetime." }
];

export const WHO_IS_SOVEREIGN_FOR: TargetAudienceProfile[] = [
  {
    criterion: "Men Hungry for Relentless Discipline",
    elaboration: "Who are tired of hollow excuses, broken morning routines, and comfortable compromises, seeking structure that demands their best."
  },
  {
    criterion: "Builders, Creators & Professionals",
    elaboration: "Men who run businesses, manage high responsibility, or are building formidable careers and need peer counsel without envy."
  },
  {
    criterion: "Leaders Seeking High-Tier Brotherhood",
    elaboration: "Men who often find themselves leading everywhere else, but need a room of peers where they can be challenged, sharpened, and grounded."
  },
  {
    criterion: "Fathers & Guardians of the Future",
    elaboration: "Men who realize the moral and physical safety of their family depends on their personal vitality, wisdom, and emotional mastery."
  },
  {
    criterion: "Men Willing to Give As Much As They Receive",
    elaboration: "This is not a spectator audience or passive consumption channel. We require presence, action, respect, and mutual uplift."
  }
];

export const FUTURE_VISION_AREAS: VisionCategory[] = [
  {
    title: "Decentralized Sovereign Chapters",
    scope: "Global Brotherhood Network",
    manifesto: "Establishing vetted chapter leadership across East Africa, Europe, the Middle East, and North America—uniting men under one unbroken code."
  },
  {
    title: "Physical Sovereign Academies",
    scope: "Real-World Infrastructure",
    manifesto: "Developing dedicated brotherhood training compounds, recovery facilities, and private retreats designed for intense conclaves and physical crucibles."
  },
  {
    title: "Sovereign Capital Syndicate",
    scope: "Economic Independence",
    manifesto: "Pooling resources, co-investing in sovereign agricultural, real estate, and technology assets that build generational prosperity for member families."
  },
  {
    title: "Philanthropic & Community Guardianship",
    scope: "Civic Service",
    manifesto: "Directly funding and executing service projects, youth mentorship programs, and widow/orphan relief initiatives across our home communities."
  }
];

export const FOOTER_DATA = {
  navigation: [
    { label: "About The Club", href: "#about" },
    { label: "The Founder's Journey", href: "#founder" },
    { label: "What We Build", href: "#vision" },
    { label: "The System", href: "#system" },
    { label: "Inside Sovereign", href: "#experience" },
    { label: "The 6 Pillars", href: "#pillars" },
    { label: "Events & Timeline", href: "#events" },
    { label: "Who It Is For", href: "#who-for" },
    { label: "Membership Intake", href: "#membership" },
  ],
  socials: [
    { platform: "YouTube", handle: "[YOUTUBE]", url: "https://youtube.com/@official_eyobhaile" },
    { platform: "Telegram", handle: "[TELEGRAM]", url: "https://t.me/sovereignmensclub" },
    { platform: "Instagram", handle: "[INSTAGRAM]", url: "#" },
    { platform: "TikTok", handle: "[TIKTOK]", url: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Brotherhood Terms", href: "#" },
    { label: "Membership Agreement", href: "#" },
    { label: "Readiness Code", href: "#" },
  ],
  copyrightYear: new Date().getFullYear(),
};
