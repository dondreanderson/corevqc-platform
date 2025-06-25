import React, { useState, useEffect, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  PieChart,
  BarChart3,
  Download,
  Filter,
  RefreshCw,
  Target,
  Wallet,
  CreditCard,
  Calculator,
  FileText,
  Settings,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Activity
} from 'lucide-react';

// Enhanced types for budget management
interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  committed: number;
  remaining: number;
  variance: number;
  variancePercent: number;
  color: string;
  icon?: string;
  subcategories?: BudgetSubcategory[];
  lastUpdated: Date;
  status: 'On Track' | 'At Risk' | 'Over Budget' | 'Under Budget';
}

interface BudgetSubcategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  remaining: number;
  variance: number;
  variancePercent: number;
}

interface SpendingTrend {
  date: string;
  amount: number;
  category: string;
  cumulative: number;
  budgetedCumulative: number;
  description?: string;
}

interface BudgetAlert {
  id: string;
  type: 'overrun' | 'warning' | 'forecast' | 'milestone';
  category: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  threshold: number;
  current: number;
  recommendedAction?: string;
  dueDate?: Date;
}

interface BudgetForecast {
  category: string;
  projectedSpend: number;
  projectedVariance: number;
  confidence: number;
  completionDate: string;
  riskFactors: string[];
  recommendations: string[];
}

interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  totalCommitted: number;
  totalRemaining: number;
  overallVariance: number;
  overallVariancePercent: number;
  burnRate: number; // spending per day
  projectedCompletion: Date;
  budgetUtilization: number; // percentage
}

interface BudgetFilters {
  categories: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  status: string[];
  showForecasts: boolean;
  showSubcategories: boolean;
}

// Component Props Interface
interface BudgetDashboardProps {
  projectId?: string;
  showControls?: boolean;
  compactView?: boolean;
  refreshInterval?: number;
}


const BudgetDashboard: React.FC<BudgetDashboardProps> = ({
  projectId = 'PROJ-001',
  showControls = true,
  compactView = false,
  refreshInterval = 300000 // 5 minutes
}) => {
  // State Management
  const [budgetData, setBudgetData] = useState<BudgetCategory[]>([]);
  const [spendingTrends, setSpendingTrends] = useState<SpendingTrend[]>([]);
  const [budgetAlerts, setBudgetAlerts] = useState<BudgetAlert[]>([]);
  const [forecasts, setForecasts] = useState<BudgetForecast[]>([]);
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showForecasting, setShowForecasting] = useState(false);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'trends' | 'forecasts'>('overview');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const [filters, setFilters] = useState<BudgetFilters>({
    categories: [],
    dateRange: { start: null, end: null },
    status: [],
    showForecasts: false,
    showSubcategories: false
  });

  // Configuration objects
  const statusConfig = {
    'On Track': { color: 'bg-green-100 text-green-800', icon: CheckCircle, textColor: 'text-green-600' },
    'At Risk': { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle, textColor: 'text-yellow-600' },
    'Over Budget': { color: 'bg-red-100 text-red-800', icon: XCircle, textColor: 'text-red-600' },
    'Under Budget': { color: 'bg-blue-100 text-blue-800', icon: TrendingDown, textColor: 'text-blue-600' }
  };

  const alertSeverityConfig = {
    high: { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle },
    medium: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Info },
    low: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Info }
  };

  // Placeholder for component methods and effects
  // TODO: Add useEffect for data loading
  // TODO: Add handler functions
  // TODO: Add computed values and statistics
  // TODO: Add chart components

  return (
    <div className={`space-y-6 ${compactView ? 'space-y-4' : ''}`}>
      {/* Component content will be added in subsequent parts */}
      <div className="text-center py-8">
        <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">BudgetDashboard Component Structure</h3>
        <p className="text-gray-600">Basic structure created. Content will be added incrementally.</p>
      </div>
    </div>
  );
};

 return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Budget Analysis</h2>
            <p className="mt-1 text-sm text-gray-600">
              Track project expenses and budget performance
            </p>
          </div>
          {showControls && (
            <div className="mt-4 sm:mt-0 flex gap-2">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Budget Overview Cards */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Budget</p>
              <p className="text-2xl font-bold text-blue-900">
                ${budgetSummary.totalBudget.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Spent</p>
              <p className="text-2xl font-bold text-green-900">
                ${budgetSummary.totalSpent.toLocaleString()}
              </p>
              <p className="text-xs text-green-600">
                {((budgetSummary.totalSpent / budgetSummary.totalBudget) * 100).toFixed(1)}% of budget
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-6 rounded-lg">
          <div className="flex items-center">
            <PieChart className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Remaining</p>
              <p className="text-2xl font-bold text-yellow-900">
                ${budgetSummary.remainingBudget.toLocaleString()}
              </p>
              <p className="text-xs text-yellow-600">
                {((budgetSummary.remainingBudget / budgetSummary.totalBudget) * 100).toFixed(1)}% remaining
              </p>
            </div>
          </div>
        </div>
        
        <div className={`p-6 rounded-lg ${budgetSummary.variance >= 0 ? 'bg-red-50' : 'bg-green-50'}`}>
          <div className="flex items-center">
            <AlertTriangle className={`w-8 h-8 ${budgetSummary.variance >= 0 ? 'text-red-600' : 'text-green-600'}`} />
            <div className="ml-3">
              <p className={`text-sm font-medium ${budgetSummary.variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                Variance
              </p>
              <p className={`text-2xl font-bold ${budgetSummary.variance >= 0 ? 'text-red-900' : 'text-green-900'}`}>
                {budgetSummary.variance >= 0 ? '+' : ''}${budgetSummary.variance.toLocaleString()}
              </p>
              <p className={`text-xs ${budgetSummary.variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {budgetSummary.variance >= 0 ? 'Over budget' : 'Under budget'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <div className="px-6 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Alerts</h3>
          <div className="space-y-3">
            {budgetAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${getBudgetAlertStyle(alert.type)}`}>
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(alert.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget Categories */}
      <div className="px-6 pb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Budget by Category</h3>
        <div className="space-y-4">
          {budgetCategories.map((category) => {
            const spentPercentage = (category.spent / category.budgeted) * 100;
            const isOverBudget = category.spent > category.budgeted;
            
            return (
              <div key={category.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{category.name}</h4>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${category.spent.toLocaleString()} / ${category.budgeted.toLocaleString()}
                    </p>
                    <p className={`text-xs ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
                      {spentPercentage.toFixed(1)}% {isOverBudget ? 'over budget' : 'of budget'}
                    </p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isOverBudget ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                  />
                </div>
                
                {category.subcategories && category.subcategories.length > 0 && (
                  <div className="mt-3 pl-4 space-y-2">
                    {category.subcategories.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{sub.name}</span>
                        <span className="font-medium">
                          ${sub.spent.toLocaleString()} / ${sub.budgeted.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Forecast */}
      <div className="px-6 pb-6 border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Forecast</h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Projected Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">
                ${budgetForecast.projectedTotal.toLocaleString()}
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">Completion Date</p>
              <p className="text-lg font-medium text-gray-900">
                {new Date(budgetForecast.estimatedCompletion).toLocaleDateString()}
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">Confidence Level</p>
              <p className="text-lg font-medium text-gray-900">
                {(budgetForecast.confidence * 100).toFixed(0)}%
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Risk Factors:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              {budgetForecast.riskFactors.map((risk, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetDashboard;