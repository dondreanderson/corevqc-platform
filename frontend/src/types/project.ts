// frontend/src/types/project.ts
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  budget?: number;
  clientName?: string;
  clientContact?: string;
  projectType?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  organizationId?: string;
  ownerId?: string;
  // Relations
  organization?: Organization;
  owner?: User;
  members?: ProjectMember[];
  ncrs?: any[];
  itps?: any[];
  documents?: any[];
  inspections?: any[];
}

// FIXED: Match Prisma schema exactly
export type ProjectStatus = 
  | 'PLANNING' 
  | 'IN_PROGRESS' 
  | 'ON_HOLD' 
  | 'COMPLETED' 
  | 'CANCELLED';

export type ProjectPriority = 
  | 'LOW' 
  | 'MEDIUM' 
  | 'HIGH' 
  | 'URGENT';

export type UserRole = 
  | 'ADMIN' 
  | 'MANAGER' 
  | 'USER' 
  | 'VIEWER';

export type ProjectRole = 
  | 'MANAGER' 
  | 'SUPERVISOR' 
  | 'INSPECTOR' 
  | 'MEMBER';

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  organizationId?: string;
}

export interface Organization {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  id: string;
  role: ProjectRole;
  joinedAt: string;
  projectId: string;
  userId: string;
  project?: Project;
  user?: User;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  department?: string;
  company?: string;
  avatar?: string;
  status?: 'active' | 'inactive' | 'pending';
}

// Document Types
export type DocumentType = 
  | 'DRAWING' 
  | 'SPECIFICATION' 
  | 'CONTRACT' 
  | 'PHOTO' 
  | 'REPORT' 
  | 'PLAN' 
  | 'PERMIT' 
  | 'OTHER';

export interface ProjectDocument {
  id: string;
  name: string;
  filePath: string;
  fileSize?: number;
  fileType?: string;
  documentType: DocumentType;
  uploadedAt: string;
  projectId: string;
  uploadedById: string;
  project?: Project;
  uploadedBy?: User;
}

// Form and API Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  budget?: number;
  clientName?: string;
  clientContact?: string;
  projectType?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  progress?: number;
}
