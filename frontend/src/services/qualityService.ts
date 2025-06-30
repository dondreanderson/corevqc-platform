const API_BASE_URL = 'http://localhost:8000/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class QualityService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // NCR Methods
  async getNCRs(projectId: string): Promise<NCR[]> {
    try {
      const response = await this.request<NCR[]>(`/quality-control/projects/${projectId}/ncrs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching NCRs:', error);
      throw error;
    }
  }

  async createNCR(projectId: string, ncrData: Partial<NCR>): Promise<NCR> {
    try {
      const response = await this.request<NCR>(`/quality-control/projects/${projectId}/ncrs`, {
        method: 'POST',
        body: JSON.stringify(ncrData),
      });
      return response.data;
    } catch (error) {
      console.error('Error creating NCR:', error);
      throw error;
    }
  }

  async updateNCR(ncrId: string, ncrData: Partial<NCR>): Promise<NCR> {
    try {
      const response = await this.request<NCR>(`/quality-control/ncrs/${ncrId}`, {
        method: 'PUT',
        body: JSON.stringify(ncrData),
      });
      return response.data;
    } catch (error) {
      console.error('Error updating NCR:', error);
      throw error;
    }
  }

  async deleteNCR(ncrId: string): Promise<void> {
    try {
      await this.request(`/quality-control/ncrs/${ncrId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting NCR:', error);
      throw error;
    }
  }

  // ITP Methods
  async getITPs(projectId: string): Promise<ITP[]> {
    try {
      const response = await this.request<ITP[]>(`/quality-control/projects/${projectId}/itps`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ITPs:', error);
      throw error;
    }
  }

  async createITP(projectId: string, itpData: Partial<ITP>): Promise<ITP> {
    try {
      const response = await this.request<ITP>(`/quality-control/projects/${projectId}/itps`, {
        method: 'POST',
        body: JSON.stringify(itpData),
      });
      return response.data;
    } catch (error) {
      console.error('Error creating ITP:', error);
      throw error;
    }
  }

  async updateITP(itpId: string, itpData: Partial<ITP>): Promise<ITP> {
    try {
      const response = await this.request<ITP>(`/quality-control/itps/${itpId}`, {
        method: 'PUT',
        body: JSON.stringify(itpData),
      });
      return response.data;
    } catch (error) {
      console.error('Error updating ITP:', error);
      throw error;
    }
  }

  async deleteITP(itpId: string): Promise<void> {
    try {
      await this.request(`/quality-control/itps/${itpId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting ITP:', error);
      throw error;
    }
  }

  // Quality Metrics
  async getQualityMetrics(projectId: string): Promise<QualityMetrics> {
    try {
      const response = await this.request<QualityMetrics>(`/quality-control/projects/${projectId}/metrics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quality metrics:', error);
      throw error;
    }
  }
}

// TypeScript Interfaces (should match your existing types)
interface NCR {
  id: string;
  ncrNumber: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: string;
  location: string;
  reportedBy: string;
  assignedTo: string;
  createdDate: string;
  dueDate: string;
  resolvedDate?: string;
  correctiveAction?: string;
  rootCause?: string;
  images?: string[];
}

interface ITP {
  id: string;
  itpNumber: string;
  name: string;
  phase: string;
  inspector: string;
  location: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'approved' | 'rejected';
  inspectionType: 'visual' | 'dimensional' | 'material_test' | 'performance' | 'safety';
  requirements: string[];
  notes?: string;
}

interface QualityMetrics {
  totalInspections: number;
  passedInspections: number;
  failedInspections: number;
  activeNCRs: number;
  resolvedNCRs: number;
  qualityScore: number;
  defectRate: number;
  overdueItems: number;
  pendingITPs: number;
  completedITPs: number;
}

// Export singleton instance
export const qualityService = new QualityService();
export default qualityService;