// src/types/quality.ts
export interface NCR {
  id: string;
  ncrNumber: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  category: string;
  location: string;
  detectedBy: TeamMember;
  assignedTo: TeamMember;
  detectedDate: string;
  dueDate: string;
  resolvedDate?: string;
  correctiveAction?: string;
  rootCause?: string;
  images: string[];
  documents: string[];
  comments: Comment[];
}

export interface ITP {
  id: string;
  itpNumber: string;
  title: string;
  description: string;
  phase: string;
  activity: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED' | 'REJECTED';
  inspectionType: 'VISUAL' | 'DIMENSIONAL' | 'MATERIAL_TEST' | 'PERFORMANCE' | 'SAFETY';
  inspector: TeamMember;
  scheduledDate: string;
  completedDate?: string;
  holdPoints: string[];
  results?: InspectionResult[];
}

export interface QualityMetrics {
  totalInspections: number;
  passedInspections: number;
  failedInspections: number;
  activeNCRs: number;
  resolvedNCRs: number;
  qualityScore: number;
  defectRate: number;
  reworkPercentage: number;
}
