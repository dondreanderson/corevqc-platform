import React from 'react';
import { Project } from '../types/project';

interface ProjectDetailsProps {
  project: Project;
  onBack: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  return React.createElement('div', null, `Project Details - ${project.name}`);
};

export default ProjectDetails;
