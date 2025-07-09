import React, { useState } from 'react';

interface CreateNCRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ncrData: any) => void;
}

const CreateNCRModal: React.FC<CreateNCRModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    severity: '',
    location: '',
    dueDate: '',
    description: '',
    reportedBy: 'John Smith'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    if (!formData.severity) {
      newErrors.severity = 'Please select a severity level';
    }
    if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters long';
    }
    if (!formData.reportedBy) {
      newErrors.reportedBy = 'Please enter who is reporting this NCR';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateNCRNumber = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `NCR-${year}${month}${day}-${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const ncrData = {
        ...formData,
        ncrNumber: generateNCRNumber(),
        createdAt: new Date().toISOString(),
        status: 'OPEN'
      };
      
      onSubmit(ncrData);
      onClose();
      
      setFormData({
        title: '',
        category: '',
        severity: '',
        location: '',
        dueDate: '',
        description: '',
        reportedBy: 'John Smith'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold">Create New NCR</h2>
            <p className="text-blue-100 mt-1">Non-Conformance Report</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <label className="block text-sm font-medium text-blue-800 mb-2">NCR Number</label>
            <div className="text-lg font-bold text-blue-900">{generateNCRNumber()}</div>
            <p className="text-sm text-blue-600 mt-1">Auto-generated unique identifier</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Brief description of the non-conformance"
              />
              {errors.title && <div className="text-red-600 text-sm mt-1">{errors.title}</div>}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Category</option>
                <option value="Quality">Quality</option>
                <option value="Safety">Safety</option>
                <option value="Process">Process</option>
                <option value="Material">Material</option>
                <option value="Environmental">Environmental</option>
                <option value="Documentation">Documentation</option>
                <option value="Equipment">Equipment</option>
              </select>
              {errors.category && <div className="text-red-600 text-sm mt-1">{errors.category}</div>}
            </div>

            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-2">Severity *</label>
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.severity ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Severity</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
              {errors.severity && <div className="text-red-600 text-sm mt-1">{errors.severity}</div>}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="e.g., Building A, Floor 3, Room 305"
              />
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              required
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Detailed description of the non-conformance..."
            />
            {errors.description && <div className="text-red-600 text-sm mt-1">{errors.description}</div>}
          </div>

          <div className="mt-6">
            <label htmlFor="reportedBy" className="block text-sm font-medium text-gray-700 mb-2">Reported By *</label>
            <input
              type="text"
              id="reportedBy"
              name="reportedBy"
              value={formData.reportedBy}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                errors.reportedBy ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Your name"
            />
            {errors.reportedBy && <div className="text-red-600 text-sm mt-1">{errors.reportedBy}</div>}
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create NCR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNCRModal;