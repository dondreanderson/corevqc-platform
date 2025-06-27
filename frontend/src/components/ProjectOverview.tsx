// src/components/ProjectOverview.tsx
import React from 'react';
import type { EnhancedProject } from '../types/project';

interface ProjectOverviewProps {
  project: EnhancedProject;
  onAction?: (action: string, data?: any) => void;
  isEditable?: boolean;
  showActions?: boolean;
}

export const ProjectOverview: React.FC = ({
  project,
  onAction,
  isEditable = false,
  showActions = true
}) => {
  const handleEdit = () => {
    if (onAction) {
      onAction('edit');
    }
  };

  const handleSave = () => {
    if (onAction) {
      onAction('save', project);
    }
  };

  const handleDelete = () => {
    if (onAction) {
      onAction('delete');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    
      {/* Header */}
      
        
          {project.title}
          {project.description}
        
        
        {showActions && (
          
            
              Edit
            
            
              Save
            
            
              Delete
            
          
        )}
      

      {/* Status and Priority */}
      
        
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        
        
          {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)} Priority
        
      

      {/* Progress Bar */}
      
        
          Progress
          {project.completion}%
        
        
          
        
      

      {/* Project Details Grid */}
      
        {/* Dates */}
        
          Timeline
          
            Start: {formatDate(project.startDate)}
            End: {formatDate(project.endDate)}
          
        

        {/* Budget */}
        
          Budget
          
            Total: {formatCurrency(project.budget)}
            Spent: {formatCurrency(project.spent)}
            Remaining: {formatCurrency(project.budget - project.spent)}
          
        

        {/* Team */}
        
          Team
          
            Team Size: {project.teamSize} members
            Owner: {project.owner}
          
        
      

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        
          Tags
          
            {project.tags.map((tag, index) => (
              
                {tag}
              
            ))}
          
        
      )}

      {/* Last Updated */}
      
        Last updated: {formatDate(project.lastUpdated)}
      
    
  );
};

export default ProjectOverview;