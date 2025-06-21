// frontend/src/types/project.ts
export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  budget?: number;
  location?: string;
  client?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface QualityReport {
  id: string;
  type: string;
  title: string;
  status: string;
  createdAt: string;
}
