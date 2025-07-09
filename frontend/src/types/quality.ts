// frontend/src/types/quality.ts
export type NCRSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type NCRStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type ITPStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED' | 'REJECTED';
export type CheckpointStatus = 'PENDING' | 'PASSED' | 'FAILED';
export type InspectionType = 'VISUAL' | 'DIMENSIONAL' | 'MATERIAL_TEST' | 'PERFORMANCE' | 'SAFETY';
export type InspectionStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export interface NCR {
  id: string;
  ncrNumber: string;
  title: string;
  description: string;
  severity: NCRSeverity;
  status: NCRStatus;
  category: string;
  location?: string;
  correctiveAction?: string;
  rootCause?: string;
  dueDate?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  reportedById: string;
  project?: Project;
  reportedBy?: User;
  photos?: Photo[];
}

export interface ITP {
  id: string;
  itpNumber: string;
  title: string;
  description?: string;
  phase: string;
  activity: string;
  status: ITPStatus;
  inspectionType: InspectionType;
  scheduledAt?: string;
  completedAt?: string;
  location?: string;
  notes?: string;
  requirements: string[];
  holdPoints: string[];
  createdAt: string;
  updatedAt: string;
  projectId: string;
  inspectorId: string;
  project?: Project;
  inspector?: User;
  checkpoints?: ITPCheckpoint[];
  photos?: Photo[];
}

export interface ITPCheckpoint {
  id: string;
  description: string;
  status: CheckpointStatus;
  checkedBy?: string;
  checkedAt?: string;
  notes?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  itpId: string;
  itp?: ITP;
}

export interface Inspection {
  id: string;
  title: string;
  description?: string;
  status: InspectionStatus;
  scheduledAt?: string;
  completedAt?: string;
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  inspectorId: string;
  project?: Project;
  inspector?: User;
  photos?: Photo[];
}

export interface Photo {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  caption?: string;
  createdAt: string;
  inspectionId?: string;
  ncrId?: string;
  itpId?: string;
  inspection?: Inspection;
  ncr?: NCR;
  itp?: ITP;
}

// Import Project and User types
import type { Project, User } from './project';

// Create NCR/ITP Data
export interface CreateNCRData {
  title: string;
  description: string;
  severity: NCRSeverity;
  category: string;
  location?: string;
  dueDate?: string;
  projectId: string;
  reportedById: string;
}

export interface CreateITPData {
  title: string;
  description?: string;
  phase: string;
  activity: string;
  inspectionType: InspectionType;
  scheduledAt?: string;
  location?: string;
  notes?: string;
  requirements?: string[];
  holdPoints?: string[];
  projectId: string;
  inspectorId: string;
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
