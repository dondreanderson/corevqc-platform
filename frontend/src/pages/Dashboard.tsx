import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

// TypeScript interfaces
interface OverviewData {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalBudget: number;
  totalActualCost: number;
  budgetVariance: number;
  averageQualityScore: number;
  averageProgress: number;
  costEfficiency: number;
}

interface ProgressData {
  name: string;
  progress: number;
  status: string;
  id: string;
}

interface FinancialData {
  name: string;
  budget: number;
  actualCost: number;
  variance: number;
  efficiency: number;
}

interface QualityData {
  averageScore: number;
  scoreDistribution: Array<{
    name: string;
    score: number;
    status: string;
  }>;
  qualityTrends: Array<{
    month: string;
    score: number;
  }>;
}

const Dashboard: React.FC = () => {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [financialData, setFinancialData] = useState<FinancialData[]>([]);
  const [qualityData, setQualityData] = useState<QualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all analytics data
      const [overviewRes, progressRes, financialRes, qualityRes] = await Promise.all([
        fetch('http://localhost:8000/api/analytics/overview'),
        fetch('http://localhost:8000/api/analytics/progress'),
        fetch('http://localhost:8000/api/analytics/financial'),
        fetch('http://localhost:8000/api/analytics/quality')
      ]);

      if (!overviewRes.ok || !progressRes.ok || !financialRes.ok || !qualityRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const [overviewData, progressData, financialData, qualityData] = await Promise.all([
        overviewRes.json(),
        progressRes.json(),
        financialRes.json(),
        qualityRes.json()
      ]);

      setOverview(overviewData);
      setProgressData(progressData);
      setFinancialData(financialData);
      setQualityData(qualityData);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Chart colors
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <h2 className="text-white text-xl font-semibold mt-4">Loading COREVQC Dashboard...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-4">Error Loading Dashboard</h2>
          <p className="text-white opacity-80 mb-6">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="btn-enhanced"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Enhanced Header */}
      <div className="enhanced-header">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="animate-fade-in">COREVQC Dashboard</h1>
          <p className="animate-fade-in">Construction Quality Control Analytics & Insights</p>
          <div className="flex justify-center space-x-4 mt-6 animate-slide-in">
            <Link to="/projects" className="btn-enhanced">
              View All Projects
            </Link>
            <button className="btn-construction">
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-main animate-fade-in">
        {/* Enhanced Overview Cards */}
        {overview && (
          <div className="stats-grid">
            <div className="stats-card">
              <div className="stats-icon bg-gradient">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="stats-number">{overview.totalProjects}</div>
              <div className="stats-label">Total Projects</div>
            </div>

            <div className="stats-card">
              <div className="stats-icon" style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}>
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stats-number" style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{overview.activeProjects}</div>
              <div className="stats-label">Active Projects</div>
            </div>

            <div className="stats-card">
              <div className="stats-icon construction-gradient">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="stats-number" style={{background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>${(overview.totalBudget / 1000000).toFixed(1)}M</div>
              <div className="stats-label">Total Budget</div>
            </div>

            <div className="stats-card">
              <div className="stats-icon" style={{background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'}}>
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="stats-number" style={{background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{overview.averageQualityScore}</div>
              <div className="stats-label">Avg Quality Score</div>
            </div>
          </div>
        )}

        {/* Enhanced Charts Grid */}
        <div className="charts-grid">
          {/* Project Progress Chart */}
          <div className="chart-container">
            <h3 className="chart-title">Project Progress Overview</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="progress" fill="url(#progressGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Financial Analysis Chart */}
          <div className="chart-container">
            <h3 className="chart-title">Budget vs Actual Cost</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  formatter={(value) => [`$${(Number(value) / 1000000).toFixed(1)}M`, '']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="budget" fill="#10b981" name="Budget" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actualCost" fill="#3b82f6" name="Actual Cost" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quality Metrics */}
        <div className="charts-grid">
          {qualityData && (
            <>
              <div className="chart-container">
                <h3 className="chart-title">Quality Score Distribution</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={qualityData.scoreDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="score"
                      label={({ name, score }) => `${name}: ${score}`}
                    >
                      {qualityData.scoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3 className="chart-title">Quality Score Trends</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={qualityData.qualityTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                    <YAxis domain={[60, 100]} stroke="#6b7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#8b5cf6" 
                      fill="url(#qualityGradient)"
                      strokeWidth={3}
                    />
                    <defs>
                      <linearGradient id="qualityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>

        {/* Enhanced Performance Summary */}
        {overview && (
          <div className="performance-summary">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">Performance Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="summary-item">
                <div className="summary-number text-gradient">{overview.averageProgress}%</div>
                <div className="summary-label">Average Progress</div>
              </div>
              <div className="summary-item">
                <div className="summary-number" style={{color: '#10b981'}}>{overview.costEfficiency}%</div>
                <div