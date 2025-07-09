import React from 'react';

const Projects: React.FC = () => {
  const mockProjects = [
    { id: '1', name: 'Downtown Office Complex', status: 'In Progress', progress: 65 },
    { id: '2', name: 'Residential Tower', status: 'Planning', progress: 15 },
    { id: '3', name: 'Healthcare Facility', status: 'Completed', progress: 100 }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Projects</h1>
      <div className="grid gap-4">
        {mockProjects.map(project => (
          <div key={project.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
            <p className="text-gray-600 mb-2">Status: {project.status}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">{project.progress}% Complete</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
