// frontend/src/components/DocumentManager.js
import React, { useState, useEffect } from 'react';
import './DocumentManager.css';

const DocumentManager = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [filters, setFilters] = useState({
    category: 'ALL',
    search: '',
    projectId: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [documents, filters]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockDocuments = [
        {
          id: '1',
          name: 'Project_Plans_v2.pdf',
          type: 'application/pdf',
          size: 2048576,
          uploadedAt: '2024-01-15T10:30:00Z',
          uploadedBy: 'John Doe',
          category: 'PLAN',
          projectId: 'proj-1',
          url: '#',
          version: 2
        },
        {
          id: '2',
          name: 'Site_Inspection_Photos.zip',
          type: 'application/zip',
          size: 15728640,
          uploadedAt: '2024-01-14T14:20:00Z',
          uploadedBy: 'Jane Smith',
          category: 'PHOTO',
          projectId: 'proj-1',
          url: '#',
          version: 1
        }
      ];
      setDocuments(mockDocuments);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...documents];

    if (filters.category !== 'ALL') {
      filtered = filtered.filter(doc => doc.category === filters.category);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchLower) ||
        doc.uploadedBy.toLowerCase().includes(searchLower)
      );
    }

    setFilteredDocuments(filtered);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileUpload = async (files) => {
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log('Uploading file:', file.name);
        // Mock upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      await loadDocuments(); // Refresh the list
    } catch (error) {
      console.error('Failed to upload files:', error);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getCategoryColor = (category) => {
    const colors = {
      'DRAWING': 'category-blue',
      'SPECIFICATION': 'category-green',
      'CONTRACT': 'category-purple',
      'PHOTO': 'category-pink',
      'REPORT': 'category-orange',
      'PLAN': 'category-indigo',
      'PERMIT': 'category-yellow'
    };
    return colors[category] || 'category-gray';
  };

  const getFileIcon = (type) => {
    if (type.includes('image')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('zip')) return '📦';
    if (type.includes('word')) return '📝';
    if (type.includes('excel')) return '📊';
    return '📄';
  };

  return (
    <div className="document-manager">
      <div className="document-header">
        <h1>Document Manager</h1>
        <p>Upload, organize, and manage project documents</p>
      </div>

      <div className="upload-section">
        <div
          className={`upload-area ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="upload-icon">📁</div>
          <p className="upload-text">Drag and drop files here, or click to select</p>
          <p className="upload-subtext">Supports PDF, images, Office documents, and compressed files</p>
          <input
            type="file"
            multiple
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="file-input"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="upload-button">
            Select Files
          </label>
          {uploading && (
            <div className="upload-progress">
              <div className="spinner"></div>
              <span>Uploading...</span>
            </div>
          )}
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search documents..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="search-input"
          />
        </div>

        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="filter-select"
        >
          <option value="ALL">All Categories</option>
          <option value="DRAWING">Drawings</option>
          <option value="SPECIFICATION">Specifications</option>
          <option value="CONTRACT">Contracts</option>
          <option value="PHOTO">Photos</option>
          <option value="REPORT">Reports</option>
          <option value="PLAN">Plans</option>
          <option value="PERMIT">Permits</option>
          <option value="OTHER">Other</option>
        </select>

        <div className="document-count">
          {filteredDocuments.length} of {documents.length} documents
        </div>
      </div>

      <div className="documents-section">
        <h2>Documents ({filteredDocuments.length})</h2>
        
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="documents-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Size</th>
                  <th>Uploaded By</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="file-info">
                        <span className="file-icon">{getFileIcon(doc.type)}</span>
                        <div>
                          <div className="file-name">{doc.name}</div>
                          <div className="file-version">v{doc.version}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`category-badge ${getCategoryColor(doc.category)}`}>
                        {doc.category}
                      </span>
                    </td>
                    <td>{formatFileSize(doc.size)}</td>
                    <td>{doc.uploadedBy}</td>
                    <td>{formatDate(doc.uploadedAt)}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view-btn">👁️</button>
                        <button className="action-btn download-btn">⬇️</button>
                        <button className="action-btn delete-btn">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {filteredDocuments.length === 0 && !loading && (
          <div className="no-documents">
            <div className="no-documents-icon">📁</div>
            <p>No documents found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentManager;
