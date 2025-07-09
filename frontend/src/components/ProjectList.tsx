import React from 'react';
import { Project } from '../types/project';

interface ProjectListProps {
  projects: Project[];
  onViewProject: (project: Project) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return React.createElement('div', null, `Project List - ${projects.length} projects`);
};

export default ProjectList;
