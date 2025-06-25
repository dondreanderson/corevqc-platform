// Enhanced project types for COREVQC construction management platform

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: Date;
  endDate: Date;
  budget: ProjectBudget;
  progress: ProjectProgress;
  teamMembers: TeamMember[];
  documents: ProjectDocument[];
  qualityReports: QualityReport[];
  ncrs: NCR[];
  itps: ITP[];
  activities: ProjectActivity[];
  alerts: ProjectAlert[];
  issues: ProjectIssue[];
}

export interface ProjectBudget {
  total: number;
  allocated: number;
  spent: number;
  remaining: number;
  variance: number;
  categories: BudgetCategory[];
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  variance: number;
}

export interface ProjectProgress {
  overall: number;
  phases: ProjectPhase[];
  milestones: Milestone[];
}

export interface ProjectPhase {
  id: string;
  name: string;
  progress: number;
  status: PhaseStatus;
  startDate: Date;
  endDate: Date;
}

export interface Milestone {
  id: string;
  name: string;
  targetDate: Date;
  completedDate?: Date;
  status: MilestoneStatus;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  permissions: UserPermission[];
  assignments: Assignment[];
}

export interface Assignment {
  id: string;
  taskId: string;
  taskName: string;
  dueDate: Date;
  status: AssignmentStatus;
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: DocumentType;
  category: DocumentCategory;
  version: string;
  uploadDate: Date;
  uploadedBy: string;
  status: DocumentStatus;
  analysis?: DocumentAnalysis;
  versions: DocumentVersion[];
  approvals: DocumentApproval[];
}

export interface DocumentAnalysis {
  id: string;
  documentId: string;
  aiSuggestions: AISuggestion[];
  riskAssessment: RiskAssessment;
  complianceCheck: ComplianceCheck;
  extractedData: ExtractedData;
}

export interface AISuggestion {
  type: SuggestionType;
  description: string;
  priority: Priority;
  actionRequired: boolean;
}

export interface DocumentVersion {
  id: string;
  version: string;
  uploadDate: Date;
  uploadedBy: string;
  changes: string[];
  status: VersionStatus;
}

export interface DocumentApproval {
  id: string;
  approver: string;
  status: ApprovalStatus;
  date: Date;
  comments?: string;
}

export interface QualityReport {
  id: string;
  projectId: string;
  inspectionDate: Date;
  inspector: string;
  area: string;
  findings: QualityFinding[];
  overallRating: QualityRating;
  status: ReportStatus;
}

export interface QualityFinding {
  id: string;
  description: string;
  severity: Severity;
  category: FindingCategory;
  status: FindingStatus;
  correctiveAction?: string;
}

export interface NCR {
  id: string;
  projectId: string;
  title: string;
  description: string;
  severity: Severity;
  status: NCRStatus;
  raisedBy: string;
  raisedDate: Date;
  assignedTo?: string;
  dueDate?: Date;
  resolution?: string;
  closedDate?: Date;
  workflow: NCRWorkflowStep[];
}

export interface NCRWorkflowStep {
  id: string;
  step: string;
  status: WorkflowStepStatus;
  assignee: string;
  completedDate?: Date;
  comments?: string;
}

export interface ITP {
  id: string;
  projectId: string;
  name: string;
  description: string;
  inspectionPoints: InspectionPoint[];
  status: ITPStatus;
  createdBy: string;
  createdDate: Date;
  approvedBy?: string;
  approvedDate?: Date;
}

export interface InspectionPoint {
  id: string;
  name: string;
  description: string;
  criteria: string[];
  status: InspectionStatus;
  inspectedBy?: string;
  inspectionDate?: Date;
  result?: InspectionResult;
}

export interface ProjectActivity {
  id: string;
  projectId: string;
  type: ActivityType;
  description: string;
  timestamp: Date;
  userId: string;
  userName: string;
  metadata: ActivityMetadata;
}

export interface ActivityMetadata {
  entityType?: string;
  entityId?: string;
  changes?: Record<string, any>;
  additionalInfo?: Record<string, any>;
}

export interface ProjectAlert {
  id: string;
  projectId: string;
  type: AlertType;
  title: string;
  description: string;
  priority: Priority;
  status: AlertStatus;
  createdDate: Date;
  dueDate?: Date;
  assignedTo?: string;
  resolvedDate?: Date;
}

export interface ProjectIssue {
  id: string;
  projectId: string;
  title: string;
  description: string;
  type: IssueType;
  priority: Priority;
  status: IssueStatus;
  reportedBy: string;
  reportedDate: Date;
  assignedTo?: string;
  dueDate?: Date;
  resolution?: string;
  resolvedDate?: Date;
}

export interface ProjectRole {
  id: string;
  name: string;
  permissions: UserPermission[];
  description: string;
}

export interface ActivityFilter {
  type: ActivityType;
  enabled: boolean;
  dateRange?: DateRange;
  userId?: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

// Enums
export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PhaseStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DELAYED = 'delayed'
}

export enum MilestoneStatus {
  UPCOMING = 'upcoming',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue'
}

export enum DocumentType {
  DRAWING = 'drawing',
  SPECIFICATION = 'specification',
  REPORT = 'report',
  CERTIFICATE = 'certificate',
  PHOTO = 'photo',
  OTHER = 'other'
}

export enum DocumentCategory {
  DESIGN = 'design',
  QUALITY = 'quality',
  SAFETY = 'safety',
  COMPLIANCE = 'compliance',
  PROGRESS = 'progress'
}

export enum DocumentStatus {
  DRAFT = 'draft',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ARCHIVED = 'archived'
}

export enum NCRStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  CANCELLED = 'cancelled'
}

export enum ITPStatus {
  DRAFT = 'draft',
  APPROVED = 'approved',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export enum InspectionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  PASSED = 'passed',
  FAILED = 'failed',
  CONDITIONAL = 'conditional'
}

export enum ActivityType {
  PROJECT_CREATED = 'project_created',
  DOCUMENT_UPLOADED = 'document_uploaded',
  NCR_RAISED = 'ncr_raised',
  INSPECTION_COMPLETED = 'inspection_completed',
  MILESTONE_ACHIEVED = 'milestone_achieved',
  TEAM_MEMBER_ASSIGNED = 'team_member_assigned',
  BUDGET_UPDATED = 'budget_updated',
  ALERT_CREATED = 'alert_created'
}

export enum AlertType {
  DEADLINE = 'deadline',
  BUDGET = 'budget',
  QUALITY = 'quality',
  SAFETY = 'safety',
  COMPLIANCE = 'compliance'
}

export enum IssueType {
  TECHNICAL = 'technical',
  RESOURCE = 'resource',
  SCHEDULE = 'schedule',
  QUALITY = 'quality',
  SAFETY = 'safety'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum Severity {
  MINOR = 'minor',
  MAJOR = 'major',
  CRITICAL = 'critical'
}

export enum UserRole {
  PROJECT_MANAGER = 'project_manager',
  SITE_ENGINEER = 'site_engineer',
  QUALITY_INSPECTOR = 'quality_inspector',
  SAFETY_OFFICER = 'safety_officer',
  CONTRACTOR = 'contractor',
  CLIENT = 'client'
}

export enum UserPermission {
  VIEW_PROJECT = 'view_project',
  EDIT_PROJECT = 'edit_project',
  MANAGE_DOCUMENTS = 'manage_documents',
  MANAGE_QUALITY = 'manage_quality',
  MANAGE_TEAM = 'manage_team',
  MANAGE_BUDGET = 'manage_budget',
  CREATE_NCR = 'create_ncr',
  RESOLVE_NCR = 'resolve_ncr',
  APPROVE_DOCUMENTS = 'approve_documents'
}

// Additional supporting types
export type AssignmentStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';
export type ReportStatus = 'draft' | 'submitted' | 'approved' | 'rejected';
export type QualityRating = 'excellent' | 'good' | 'satisfactory' | 'poor';
export type FindingCategory = 'workmanship' | 'materials' | 'safety' | 'compliance';
export type FindingStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type WorkflowStepStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';
export type InspectionResult = 'pass' | 'fail' | 'conditional' | 'not_applicable';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'dismissed';
export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type SuggestionType = 'compliance' | 'quality' | 'safety' | 'optimization';
export type VersionStatus = 'current' | 'superseded' | 'archived';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';

// Additional interfaces for AI and analysis features
export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: RiskFactor[];
  mitigationSuggestions: string[];
}

export interface RiskFactor {
  category: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  probability: 'low' | 'medium' | 'high';
}

export interface ComplianceCheck {
  status: 'compliant' | 'non_compliant' | 'requires_review';
  standards: ComplianceStandard[];
  violations: ComplianceViolation[];
}

export interface ComplianceStandard {
  name: string;
  version: string;
  status: 'met' | 'not_met' | 'partial';
}

export interface ComplianceViolation {
  standard: string;
  description: string;
  severity: Severity;
  recommendation: string;
}

export interface ExtractedData {
  keyValues: Record<string, any>;
  tables: TableData[];
  images: ImageData[];
  text: string;
}

export interface TableData {
  headers: string[];
  rows: string[][];
  title?: string;
}

export interface ImageData {
  url: string;
  caption?: string;
  analysis?: string;
}
