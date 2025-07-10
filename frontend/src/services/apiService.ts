// frontend/src/services/apiService.ts
import axios, { AxiosInstance } from 'axios';

// ============ TYPE DEFINITIONS ============
// Project Types
export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type UserRole = 'ADMIN' | 'MANAGER' | 'USER' | 'VIEWER';

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

// Quality Types
export type NCRSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type NCRStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type ITPStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED' | 'REJECTED';
export type InspectionType = 'VISUAL' | 'DIMENSIONAL' | 'MATERIAL_TEST' | 'PERFORMANCE' | 'SAFETY';

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
}

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

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Auth types
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizationName?: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

// ============ API SERVICE CLASS ============
class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
      timeout: 10000,
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
  }

  // User methods
  async getCurrentUser(): Promise<User> {
    const response = await this.api.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    const response = await this.api.get<ApiResponse<Project[]>>('/projects');
    return response.data.data;
  }

  async getProject(id: string): Promise<Project> {
    const response = await this.api.get<ApiResponse<Project>>(`/projects/${id}`);
    return response.data.data;
  }

  async createProject(data: CreateProjectData): Promise<Project> {
    const response = await this.api.post<ApiResponse<Project>>('/projects', data);
    return response.data.data;
  }

  async updateProject(id: string, data: UpdateProjectData): Promise<Project> {
    const response = await this.api.put<ApiResponse<Project>>(`/projects/${id}`, data);
    return response.data.data;
  }

  async deleteProject(id: string): Promise<void> {
    await this.api.delete(`/projects/${id}`);
  }

  // NCR methods
  async getNCRs(projectId?: string): Promise<NCR[]> {
    const params = projectId ? { projectId } : {};
    const response = await this.api.get<ApiResponse<NCR[]>>('/ncrs', { params });
    return response.data.data;
  }

  async getNCR(id: string): Promise<NCR> {
    const response = await this.api.get<ApiResponse<NCR>>(`/ncrs/${id}`);
    return response.data.data;
  }

  async createNCR(data: CreateNCRData): Promise<NCR> {
    const response = await this.api.post<ApiResponse<NCR>>('/ncrs', data);
    return response.data.data;
  }

  async updateNCR(id: string, data: Partial<CreateNCRData>): Promise<NCR> {
    const response = await this.api.put<ApiResponse<NCR>>(`/ncrs/${id}`, data);
    return response.data.data;
  }

  async deleteNCR(id: string): Promise<void> {
    await this.api.delete(`/ncrs/${id}`);
  }

  // ITP methods
  async getITPs(projectId?: string): Promise<ITP[]> {
    const params = projectId ? { projectId } : {};
    const response = await this.api.get<ApiResponse<ITP[]>>('/itps', { params });
    return response.data.data;
  }

  async getITP(id: string): Promise<ITP> {
    const response = await this.api.get<ApiResponse<ITP>>(`/itps/${id}`);
    return response.data.data;
  }

  async createITP(data: CreateITPData): Promise<ITP> {
    const response = await this.api.post<ApiResponse<ITP>>('/itps', data);
    return response.data.data;
  }

  async updateITP(id: string, data: Partial<CreateITPData>): Promise<ITP> {
    const response = await this.api.put<ApiResponse<ITP>>(`/itps/${id}`, data);
    return response.data.data;
  }

  async deleteITP(id: string): Promise<void> {
    await this.api.delete(`/itps/${id}`);
  }

  // Quality metrics
  async getQualityMetrics(projectId: string): Promise<QualityMetrics> {
    const response = await this.api.get<ApiResponse<QualityMetrics>>(`/quality/metrics/${projectId}`);
    return response.data.data;
  }

  // File upload
  async uploadFile(file: File, projectId: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);

    const response = await this.api.post<ApiResponse<{ url: string }>>('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data.url;
  }
}

export const apiService = new ApiService();
export default apiService;
