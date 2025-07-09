import React from 'react';

interface ProjectTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'documents', label: 'Documents', icon: '📄' },
    { id: 'itps', label: 'ITPs', icon: '✅' },
    { id: 'ncrs', label: 'NCRs', icon: '⚠️' },
    { id: 'team', label: 'Team', icon: '👥' },
    { id: 'timeline', label: 'Timeline', icon: '📅' }
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ProjectTabs;