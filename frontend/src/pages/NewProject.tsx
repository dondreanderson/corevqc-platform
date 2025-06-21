import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { createProject } from '../store/projectSlice';
import { ProjectForm } from '../components/ProjectForm';
import toast from 'react-hot-toast';
import '../styles/projects.css';

export const NewProject: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await dispatch(createProject(data)).unwrap();
      toast.success('🎉 Project created successfully!');
      navigate('/projects');
    } catch (error) {
      toast.error('Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="new-project-page">
      <div className="page-header">
        <div className="page-title">
          <button 
            className="back-button"
            onClick={() => navigate('/projects')}
          >
            ← Back to Projects
          </button>
          <h1>📋 Create New Project</h1>
          <p>Set up a new construction project for quality control management</p>
        </div>
      </div>

      <div className="page-content">
        <ProjectForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitText="Create Project"
        />
      </div>
    </div>
  );
};
