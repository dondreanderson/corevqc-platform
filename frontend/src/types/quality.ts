import type { TeamMember } from './project';

export interface NCR {
  id: string;
  ncrNumber: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
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

export interface InspectionResult {
  id: string;
  parameter: string;
  expectedValue: string;
  actualValue: string;
  result: 'pass' | 'fail' | 'na';
  notes?: string;
  timestamp: string;
  inspector: string;
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
  criteria: InspectionCriteria[];
  results?: InspectionResult[];
  overallResult?: 'pass' | 'fail' | 'conditional';
  holdPoints: string[];
  references: string[];
}

export interface InspectionCriteria {
  parameter: string;
  requirement: string;
  tolerance?: string;
  method: string;
  acceptanceCriteria: string;
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

export interface CheckPoint {
  id: string;
  description: string;
  status: 'pending' | 'passed' | 'failed';
  checkedBy?: string;
  checkedDate?: string;
  notes?: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  type?: 'note' | 'action' | 'resolution';
}