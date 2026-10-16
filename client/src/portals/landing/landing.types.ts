export interface PillarItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  quote?: string;
  iconName: string;
}

export interface SystemNode {
  id: string;
  label: string;
  description: string;
  status: 'ACTIVE' | 'COMING_SOON';
  category: 'CORE' | 'DEVELOPMENT' | 'NETWORK';
}

export interface FounderMilestone {
  stage: string;
  title: string;
  subtitle: string;
  narrative: string;
  year?: string;
}

export interface ExperienceStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
}

export interface EventTimelineItem {
  id: string;
  title: string;
  category: string;
  format: 'IN_PERSON' | 'VIRTUAL' | 'HYBRID';
  location: string;
  seasonOrFrequency: string;
  description: string;
  status: 'ESTABLISHED' | 'EXPANDING' | 'COMING_SOON';
}

export interface TargetAudienceProfile {
  criterion: string;
  elaboration: string;
}

export interface VisionCategory {
  title: string;
  scope: string;
  manifesto: string;
}
