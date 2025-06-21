import React from 'react';
import { useForm } from 'react-hook-form';
import '../styles/projects.css';

interface ProjectFormData {
  name: string;
  description: string;
  clientName: string;
  clientContact: string;
  projectType: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  budget: string;
  startDate: string;
  endDate: string;
  location: string;
}

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void;
  initialData?: Partial<ProjectFormData>;
  isLoading?: boolean;
  submitText?: string;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
  submitText = 'Create Project'
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: initialData
  });

  return (
    <div className="project-form-container">
      <form onSubmit={handleSubmit(onSubmit)} className="project-form">
        <div className="form-grid">
          {/* Project Name */}
          <div className="form-group full-width">
            <label className="form-label" htmlFor="name">
              Project Name *
            </label>
            <input
              id="name"
              type="text"
              className={`form-input ${errors.name ? 'error' : ''}`}
              {...register('name', { required: 'Project name is required' })}
              placeholder="Enter project name"
            />
            {errors.name && (
              <div className="form-error">{errors.name.message}</div>
            )}
          </div>

          {/* Description */}
          <div className="form-group full-width">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="form-textarea"
              rows={3}
              {...register('description')}
              placeholder="Enter project description"
            />
          </div>

          {/* Client Information */}
          <div className="form-group">
            <label className="form-label" htmlFor="clientName">
              Client Name
            </label>
            <input
              id="clientName"
              type="text"
              className="form-input"
              {...register('clientName')}
              placeholder="Enter client name"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="clientContact">
              Client Contact
            </label>
            <input
              id="clientContact"
              type="email"
              className="form-input"
              {...register('clientContact')}
              placeholder="client@example.com"
            />
          </div>

          {/* Project Details */}
          <div className="form-group">
            <label className="form-label" htmlFor="projectType">
              Project Type
            </label>
            <select
              id="projectType"
              className="form-input"
              {...register('projectType')}
            >
              <option value="">Select project type</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Industrial">Industrial</option>
              <option value="Renovation">Renovation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="priority">
              Priority
            </label>
            <select
              id="priority"
              className="form-input"
              {...register('priority')}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          {/* Budget and Location */}
          <div className="form-group">
            <label className="form-label" htmlFor="budget">
              Budget ($)
            </label>
            <input
              id="budget"
              type="number"
              className="form-input"
              {...register('budget')}
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              type="text"
              className="form-input"
              {...register('location')}
              placeholder="Enter project location"
            />
          </div>

          {/* Dates */}
          <div className="form-group">
            <label className="form-label" htmlFor="startDate">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              className="form-input"
              {...register('startDate')}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="endDate">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              className="form-input"
              {...register('endDate')}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className={`btn-primary btn-large ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading && <div className="spinner"></div>}
            {isLoading ? 'Creating...' : submitText}
          </button>
        </div>
      </form>
    </div>
  );
};
