import React, { useState, useEffect } from 'react';
import { 
  Document, 
  DocumentCategory, 
  DocumentStatus,
  User 
} from '../types/enhanced-project-types';
import {
  DocumentTextIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  CloudArrowUpIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface DocumentManagerProps {
  projectId: string;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({ projectId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<DocumentStatus | 'all'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Mock data for demonstration
  const mockDocuments: Document[] = [
    {
      id: 'doc-1',
      title: 'Project Requirements Specification',
      description: 'Comprehensive requirements document outlining project scope and deliverables',
      category: 'requirements',
      status: 'approved',
      fileUrl: '/documents/requirements-spec.pdf',
      fileSize: 2048576,
      mimeType: 'application/pdf',
      version: '2.1',
      tags: ['requirements', 'specification', 'scope'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      createdBy: {
        id: 'user-1',
        name: 'Sarah Chen',
        email: 'sarah.chen@company.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        role: 'project_manager'
      },
      aiCategorized: true,
      aiConfidence: 0.95
    },
    {
      id: 'doc-2',
      title: 'Technical Architecture Design',
      description: 'System architecture and technical design documentation',
      category: 'technical',
      status: 'draft',
      fileUrl: '/documents/tech-architecture.docx',
      fileSize: 1536000,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      version: '1.3',
      tags: ['architecture', 'technical', 'design'],
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-22'),
      createdBy: {
        id: 'user-2',
        name: 'Michael Rodriguez',
        email: 'michael.rodriguez@company.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        role: 'developer'
      },
      aiCategorized: true,
      aiConfidence: 0.88
    },
    {
      id: 'doc-3',
      title: 'Quality Assurance Plan',
      description: 'Comprehensive QA strategy and testing procedures',
      category: 'quality',
      status: 'review',
      fileUrl: '/documents/qa-plan.pdf',
      fileSize: 3072000,
      mimeType: 'application/pdf',
      version: '1.0',
      tags: ['quality', 'testing', 'procedures'],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-23'),
      createdBy: {
        id: 'user-3',
        name: 'Emily Johnson',
        email: 'emily.johnson@company.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        role: 'qa_engineer'
      },
      aiCategorized: false,
      aiConfidence: 0
    },
    {
      id: 'doc-4',
      title: 'Meeting Minutes - Sprint Planning',
      description: 'Sprint planning meeting notes and action items',
      category: 'meeting_notes',
      status: 'approved',
      fileUrl: '/documents/sprint-planning-minutes.md',
      fileSize: 51200,
      mimeType: 'text/markdown',
      version: '1.0',
      tags: ['meeting', 'sprint', 'planning'],
      createdAt: new Date('2024-01-21'),
      updatedAt: new Date('2024-01-21'),
      createdBy: {
        id: 'user-1',
        name: 'Sarah Chen',
        email: 'sarah.chen@company.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        role: 'project_manager'
      },
      aiCategorized: true,
      aiConfidence: 0.92
    },
    {
      id: 'doc-5',
      title: 'Budget Analysis Report',
      description: 'Financial analysis and budget tracking report',
      category: 'financial',
      status: 'draft',
      fileUrl: '/documents/budget-analysis.xlsx',
      fileSize: 768000,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      version: '2.0',
      tags: ['budget', 'financial', 'analysis'],
      createdAt: new Date('2024-01-19'),
      updatedAt: new Date('2024-01-24'),
      createdBy: {
        id: 'user-4',
        name: 'David Kim',
        email: 'david.kim@company.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        role: 'stakeholder'
      },
      aiCategorized: true,
      aiConfidence: 0.97
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadDocuments = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDocuments(mockDocuments);
      setLoading(false);
    };

    loadDocuments();
  }, [projectId]);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryIcon = (category: DocumentCategory) => {
    switch (category) {
      case 'requirements': return <DocumentTextIcon className="w-5 h-5" />;
      case 'technical': return <DocumentTextIcon className="w-5 h-5" />;
      case 'quality': return <DocumentTextIcon className="w-5 h-5" />;
      case 'meeting_notes': return <DocumentTextIcon className="w-5 h-5" />;
      case 'financial': return <DocumentTextIcon className="w-5 h-5" />;
      default: return <DocumentTextIcon className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // Handle file drop logic here
    console.log('Files dropped:', e.dataTransfer.files);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Manager</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and organize project documents with AI-powered categorization
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Upload Document
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as DocumentCategory | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="requirements">Requirements</option>
              <option value="technical">Technical</option>
              <option value="quality">Quality</option>
              <option value="meeting_notes">Meeting Notes</option>
              <option value="financial">Financial</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as DocumentStatus | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            <button className="font-medium text-blue-600 hover:text-blue-500">
              Click to upload
            </button>{' '}
            or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PDF, DOC, DOCX, XLS, XLSX up to 10MB
          </p>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => (
          <div key={document.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  {getCategoryIcon(document.category)}
                  {document.aiCategorized && (
                    <SparklesIcon className="w-4 h-4 text-purple-500 ml-2" title="AI Categorized" />
                  )}
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                  {document.status}
                </span>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                  {document.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                  {document.description}
                </p>
              </div>

              <div className="mt-4 flex items-center">
                <img
                  className="h-8 w-8 rounded-full"
                  src={document.createdBy.avatar}
                  alt={document.createdBy.name}
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {document.createdBy.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {document.updatedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1">
                {document.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
                {document.tags.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                    +{document.tags.length - 3}
                  </span>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {formatFileSize(document.fileSize)} • v{document.version}
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <DocumentArrowDownIcon className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria or upload a new document.
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentManager;