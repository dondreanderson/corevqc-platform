import React, { useState } from 'react';

interface Project {
  id: string;
  name: string;
}

interface ProjectDocumentsProps {
  project: Project;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedDate: string;
  category: string;
  url?: string;
}

const ProjectDocuments: React.FC<ProjectDocumentsProps> = ({ project }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUpload, setShowUpload] = useState(false);

  // Mock documents data
  const documents: Document[] = [
    {
      id: '1',
      name: 'Architectural Plans v2.1.pdf',
      type: 'PDF',
      size: '15.2 MB',
      uploadedBy: 'John Smith',
      uploadedDate: '2024-06-15',
      category: 'plans'
    },
    {
      id: '2',
      name: 'Structural Engineering Report.pdf',
      type: 'PDF',
      size: '8.7 MB',
      uploadedBy: 'Sarah Johnson',
      uploadedDate: '2024-06-20',
      category: 'reports'
    },
    {
      id: '3',
      name: 'Site Photos - Week 1.zip',
      type: 'ZIP',
      size: '45.3 MB',
      uploadedBy: 'Mike Chen',
      uploadedDate: '2024-07-01',
      category: 'photos'
    },
    {
      id: '4',
      name: 'Material Specifications.xlsx',
      type: 'Excel',
      size: '2.1 MB',
      uploadedBy: 'Emily Davis',
      uploadedDate: '2024-07-02',
      category: 'specifications'
    },
    {
      id: '5',
      name: 'Safety Inspection Checklist.pdf',
      type: 'PDF',
      size: '1.8 MB',
      uploadedBy: 'Emily Davis',
      uploadedDate: '2024-07-03',
      category: 'safety'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Documents', count: documents.length },
    { id: 'plans', label: 'Plans & Drawings', count: documents.filter(d => d.category === 'plans').length },
    { id: 'reports', label: 'Reports', count: documents.filter(d => d.category === 'reports').length },
    { id: 'photos', label: 'Photos', count: documents.filter(d => d.category === 'photos').length },
    { id: 'specifications', label: 'Specifications', count: documents.filter(d => d.category === 'specifications').length },
    { id: 'safety', label: 'Safety', count: documents.filter(d => d.category === 'safety').length }
  ];

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return '📄';
      case 'excel':
      case 'xlsx':
        return '📊';
      case 'word':
      case 'docx':
        return '📝';
      case 'zip':
      case 'rar':
        return '🗜️';
      case 'image':
      case 'jpg':
      case 'png':
        return '🖼️';
      default:
        return '📎';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="project-documents">
      <div className="documents-header">
        <div className="header-info">
          <h3>Project Documents</h3>
          <span className="doc-count">{filteredDocuments.length} documents</span>
        </div>
        <button 
          onClick={() => setShowUpload(true)}
          className="btn-primary"
        >
          📤 Upload Document
        </button>
      </div>

      <div className="documents-filters">
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
            >
              {category.label}
              <span className="category-count">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="documents-grid">
        {filteredDocuments.map((document) => (
          <div key={document.id} className="document-card">
            <div className="document-header">
              <div className="document-icon">
                {getFileIcon(document.type)}
              </div>
              <div className="document-actions">
                <button className="action-btn" title="Download">⬇️</button>
                <button className="action-btn" title="Share">🔗</button>
                <button className="action-btn" title="Delete">🗑️</button>
              </div>
            </div>

            <div className="document-info">
              <h4 className="document-name" title={document.name}>
                {document.name}
              </h4>
              <div className="document-meta">
                <span className="document-type">{document.type}</span>
                <span className="document-size">{document.size}</span>
              </div>
            </div>

            <div className="document-footer">
              <div className="upload-info">
                <span className="uploaded-by">By {document.uploadedBy}</span>
                <span className="upload-date">{formatDate(document.uploadedDate)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="empty-documents">
          <div className="empty-icon">📁</div>
          <h4>No documents found</h4>
          <p>Upload your first document to get started</p>
          <button onClick={() => setShowUpload(true)} className="btn-primary">
            Upload Document
          </button>
        </div>
      )}

      {showUpload && (
        <div className="upload-modal">
          <div className="modal-overlay" onClick={() => setShowUpload(false)}></div>
          <div className="modal-content">
            <h4>Upload Document</h4>
            <div className="upload-form">
              <div className="file-upload-area">
                <div className="upload-icon">📤</div>
                <p>Drag and drop files here or click to browse</p>
                <input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.zip" />
              </div>
              <div className="form-fields">
                <select>
                  <option value="">Select Category</option>
                  <option value="plans">Plans & Drawings</option>
                  <option value="reports">Reports</option>
                  <option value="photos">Photos</option>
                  <option value="specifications">Specifications</option>
                  <option value="safety">Safety</option>
                </select>
                <textarea placeholder="Description (optional)"></textarea>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowUpload(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDocuments;
