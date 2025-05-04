import React, { useState } from 'react';
import { Filter, Search, ChevronDown, X } from 'lucide-react';
import jobRolesData from '@/data/jobRolesData';

// Get all unique technologies across roles
const getAllTechnologies = (): string[] => {
  const allTechnologies = new Set<string>();
  
  Object.values(jobRolesData).forEach(technologies => {
    technologies.forEach(tech => allTechnologies.add(tech));
  });
  
  return Array.from(allTechnologies).sort();
};

interface JobFiltersProps {
  selectedRole: string | null;
  selectedTechnology: string | null;
  onRoleChange: (role: string | null) => void;
  onTechnologyChange: (technology: string | null) => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({ 
  selectedRole, 
  selectedTechnology, 
  onRoleChange, 
  onTechnologyChange 
}) => {
  const [techSearchTerm, setTechSearchTerm] = useState('');
  const technologies = getAllTechnologies();
  const roles = Object.keys(jobRolesData);
  
  // Filter technologies based on search term
  const filteredTechnologies = technologies.filter(tech => 
    tech.toLowerCase().includes(techSearchTerm.toLowerCase())
  );

  // Clear role filter with propagation prevented
  const handleClearRole = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRoleChange(null);
  };

  // Clear technology filter with propagation prevented
  const handleClearTech = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTechnologyChange(null);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {/* Role filter dropdown */}
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost">
          <Filter className="h-4 w-4 mr-2" />
          {selectedRole ? `Role: ${selectedRole}` : 'Filter by Role'}
          <ChevronDown className="h-4 w-4 ml-2" />
        </div>
        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-60 max-h-96 overflow-y-auto">
          {roles.map(role => (
            <li key={role} className={selectedRole === role ? 'bg-base-200 rounded-lg' : ''}>
              <a onClick={() => onRoleChange(role)}>{role}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* Technology filter dropdown */}
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost">
          <Filter className="h-4 w-4 mr-2" />
          {selectedTechnology ? `Tech: ${selectedTechnology}` : 'Filter by Technology'}
          {selectedTechnology && (
            <button 
              className="ml-2 rounded-full hover:bg-base-300 bg-base-200 w-5 h-5 flex items-center justify-center"
              onClick={handleClearTech}
              aria-label="Clear technology filter"
            >
              <X className="h-3.5 w-3.5 text-base-content" />
            </button>
          )}
          <ChevronDown className="h-4 w-4 ml-2" />
        </div>
        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-60 max-h-96 overflow-y-auto">
          <li className="sticky top-0 bg-base-100 p-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-base-content/50" />
              <input
                type="text"
                className="input input-sm input-bordered w-full pl-8"
                placeholder="Search technologies..."
                value={techSearchTerm}
                onChange={(e) => setTechSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </li>
          {filteredTechnologies.length === 0 ? (
            <li className="text-center py-2 text-base-content/70">No matching technologies</li>
          ) : (
            filteredTechnologies.map(tech => (
              <li key={tech} className={selectedTechnology === tech ? 'bg-base-200 rounded-lg' : ''}>
                <a onClick={() => onTechnologyChange(tech)}>{tech}</a>
              </li>
            ))
          )}
        </ul>
      </div>
      
      {/* Clear all filters button */}
      {(selectedRole || selectedTechnology) && (
        <button 
          className="btn btn-sm btn-outline"
          onClick={() => {
            onRoleChange(null);
            onTechnologyChange(null);
          }}
        >
          <X className="h-4 w-4 mr-1" />
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default JobFilters; 