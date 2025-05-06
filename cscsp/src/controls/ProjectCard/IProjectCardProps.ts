export interface IMilestone {
  id: string;
  name: string;
  date: Date;
  type: 'start' | 'completion' | 'testing' | string;
}

export interface ILaborQuarter {
  quarter: string;
  "Project Engineering": number;
  "Design Engineering": number;
  "Software Engineering": number;
  "Startup & Checkout": number;
  "Electrical Install": number;
  "Pneumatic Install": number;
  key_activities?: string[];
}

export interface IProjectCardProps {
  projectNumber: string;
  title: string;
  businessName: string;
  estimatedRevenue: string;
  projectType?: string;
  serviceType?: string;
  startDate: Date;
  endDate: Date;
  progress?: number;
  laborHours: Record<string, number>;
  laborTimeline: ILaborQuarter[];
  milestones: IMilestone[];
  className?: string;
}