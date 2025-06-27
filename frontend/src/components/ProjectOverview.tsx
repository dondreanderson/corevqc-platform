// Base Project Interface
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

// Enhanced Project Interface for UI Components
export interface EnhancedProject {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  completion: number;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  teamSize: number;
  owner: string;
  tags: string[];
  milestones: Milestone[];
  risks: Risk[];
  lastUpdated: string;
}

// Project Status Type
export type ProjectStatus = 
  | 'planning' 
  | 'in-progress' 
  | 'on-hold' 
  | 'completed' 
  | 'cancelled';

// Project Priority Type
export type ProjectPriority = 
  | 'low' 
  | 'medium' 
  | 'high' 
  | 'critical';

// Team Member Interface
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

// Quality Report Interface
export interface QualityReport {
  id: string;
  type: string;
  title: string;
  status: string;
  createdAt: string;
}

// Milestone Interface
export interface Milestone {
  id: string;
  name: string;
  description?: string;
  targetDate: string;
  actualDate?: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
  progress: number;
  assignedTo?: TeamMember[];
}

// Risk Interface
export interface Risk {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  impact: number;
  status: 'open' | 'mitigated' | 'closed';
  mitigationPlan?: string;
  assignedTo?: TeamMember;
}

// Inspection Result Interface
export interface InspectionResult {
  id: string;
  parameter: string;
  expectedValue: string;
  actualValue: string;
  result: 'pass' | 'fail' | 'warning';
  notes?: string;
  inspector: TeamMember;
  timestamp: string;
}

// Document Interface
export interface Document {
  id: string;
  name: string;
  fileName: string;
  type: DocumentType;
  category: DocumentCategory;
  size: number;
  url: string;
  thumbnailUrl?: string;
  version: string;
  uploadedBy: TeamMember;
  uploadedDate: string;
  lastModified: string;
  tags?: string[];
}

// Document Types
export type DocumentType = 
  | 'drawing' 
  | 'specification' 
  | 'report' 
  | 'image' 
  | 'video' 
  | 'certificate' 
  | 'contract';

export type DocumentCategory = 
  | 'architectural' 
  | 'structural' 
  | 'mechanical' 
  | 'electrical' 
  | 'quality' 
  | 'safety' 
  | 'legal' 
  | 'financial';

// Comment Interface
export interface Comment {
  id: string;
  text: string;
  author: TeamMember;
  timestamp: string;
  attachments?: string[];
}

// API Response Types
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

// Form State Types
export interface FormState {
  isSubmitting: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

// Filter State Types
export interface FilterState {
  search: string;
  status: ProjectStatus | 'all';
  priority: ProjectPriority | 'all';
  dateRange: {
    start: string;
    end: string;
  } | null;
}