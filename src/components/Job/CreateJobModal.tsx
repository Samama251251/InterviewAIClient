import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { CreateJobInput, RoundType } from '@/types/job';
import { useJobs } from '@/hooks/useJobs';
import { useToast } from '@/hooks/useToast';
import { Company } from '@/types/company';
import jobRolesData from '@/data/jobRolesData';
import { Search, X, Check, ChevronDown, ChevronUp } from 'lucide-react';


// Available roles from the data file
const roleOptions = Object.keys(jobRolesData);

// Define round types with conditional framework specific
const baseRoundTypes: RoundType[] = [
  'Coding',
  'SystemDesign',
  'Behavioural',
  'KnowledgeBased'
];

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCompany: Company | null;
}

const CreateJobModal: React.FC<CreateJobModalProps> = ({
  isOpen,
  onClose,
  selectedCompany
}) => {
  const toast = useToast();
  const { createJob } = useJobs();
  const [selectedRoundTypes, setSelectedRoundTypes] = useState<RoundType[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [frameworkSearch, setFrameworkSearch] = useState('');
  const [availableFrameworks, setAvailableFrameworks] = useState<string[]>([]);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isFrameworkDropdownOpen, setIsFrameworkDropdownOpen] = useState(false);
  
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const frameworkDropdownRef = useRef<HTMLDivElement>(null);

  // Define final round types based on framework selection
  const roundTypeOptions: RoundType[] = selectedFrameworks.length > 0 
    ? [...baseRoundTypes, 'FrameworkSpecific'] 
    : baseRoundTypes;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm<CreateJobInput>({
    defaultValues: {
      name: '',
      description: '',
      role: '',
      framework: [],
      deadline: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
      roundTypes: []
    }
  });
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
      if (frameworkDropdownRef.current && !frameworkDropdownRef.current.contains(event.target as Node)) {
        setIsFrameworkDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Update available frameworks when role changes
  useEffect(() => {
    if (selectedRole) {
      setAvailableFrameworks(jobRolesData[selectedRole] || []);
      // Clear selected frameworks when role changes
      setSelectedFrameworks([]);
      setValue('framework', []);
    } else {
      setAvailableFrameworks([]);
    }
  }, [selectedRole, setValue]);
  
  // Update form when selected frameworks change
  useEffect(() => {
    setValue('framework', selectedFrameworks);
    
    // Remove FrameworkSpecific from round types if no frameworks are selected
    if (selectedFrameworks.length === 0) {
      const updatedRoundTypes = selectedRoundTypes.filter(type => type !== 'FrameworkSpecific');
      setSelectedRoundTypes(updatedRoundTypes);
      setValue('roundTypes', updatedRoundTypes);
    }
  }, [selectedFrameworks, setValue]);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setValue('role', role);
    setIsRoleDropdownOpen(false);
  };

  const handleFrameworkToggle = (framework: string) => {
    let newSelectedFrameworks;
    if (selectedFrameworks.includes(framework)) {
      newSelectedFrameworks = selectedFrameworks.filter(f => f !== framework);
    } else {
      newSelectedFrameworks = [...selectedFrameworks, framework];
    }
    setSelectedFrameworks(newSelectedFrameworks);
  };

  const handleRoundTypeToggle = (type: RoundType) => {
    setSelectedRoundTypes(prev => {
      if (prev.includes(type)) {
        const newTypes = prev.filter(t => t !== type);
        setValue('roundTypes', newTypes);
        return newTypes;
      } else {
        const newTypes = [...prev, type];
        setValue('roundTypes', newTypes);
        return newTypes;
      }
    });
  };

  // Filter frameworks based on search
  const filteredFrameworks = availableFrameworks.filter(framework =>
    framework.toLowerCase().includes(frameworkSearch.toLowerCase())
  );

  // Handle form submission and convert to CreateJobInput
  const onSubmit = async (data: CreateJobInput) => {
    if (!selectedCompany) {
      toast.error('Please select a company first');
      return;
    }

    // Create a properly typed CreateJobInput
    const jobInput: CreateJobInput = {
      name: data.name,
      description: data.description,
      role: data.role,
      framework: data.framework, // No need to convert array to string
      deadline: data.deadline,
      roundTypes: data.roundTypes as RoundType[],
      company_id: selectedCompany._id
    };

    try {
      await createJob.mutateAsync(jobInput);
      handleClose();
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedRoundTypes([]);
    setSelectedRole('');
    setSelectedFrameworks([]);
    setFrameworkSearch('');
    setIsRoleDropdownOpen(false);
    setIsFrameworkDropdownOpen(false);
    onClose();
  };

  return (
    <dialog id="job_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3 className="font-bold text-lg mb-4">Create New Job Posting</h3>
          
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Job Title</span>
            </label>
            <input
              type="text"
              className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
              placeholder="e.g., Senior Frontend Developer"
              {...register('name')}
            />
            {errors.name && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.name.message}</span>
              </label>
            )}
          </div>
          
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Job Description</span>
            </label>
            <textarea
              className={`textarea textarea-bordered h-24 w-full ${errors.description ? 'textarea-error' : ''}`}
              placeholder="Describe the role, responsibilities, and company culture"
              {...register('description')}
            />
            {errors.description && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.description.message}</span>
              </label>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Role Dropdown */}
            <div className="form-control w-full" ref={roleDropdownRef}>
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  className={`input input-bordered w-full flex items-center justify-between ${errors.role ? 'input-error' : ''}`}
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                >
                  <span className={selectedRole ? '' : 'text-base-content/50'}>
                    {selectedRole || 'Select a role'}
                  </span>
                  {isRoleDropdownOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                
                {isRoleDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full rounded-md bg-base-100 shadow-lg border border-base-300 max-h-56 overflow-auto">
                    <ul className="py-1">
                      {roleOptions.map((role) => (
                        <li
                          key={role}
                          className={`px-3 py-2 cursor-pointer hover:bg-base-200 ${
                            selectedRole === role ? 'bg-primary/10' : ''
                          }`}
                          onClick={() => handleRoleSelect(role)}
                        >
                          <div className="flex items-center gap-2">
                            {selectedRole === role && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                            <span className={selectedRole === role ? 'ml-0' : 'ml-6'}>
                              {role}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <input
                  type="hidden"
                  {...register('role')}
                  value={selectedRole}
                />
              </div>
              {errors.role && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.role.message}</span>
                </label>
              )}
            </div>
            
            {/* Framework Multi-Select Dropdown */}
            <div className="form-control w-full" ref={frameworkDropdownRef}>
              <label className="label">
                <span className="label-text">Frameworks</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  className={`input input-bordered w-full flex items-center justify-between ${errors.framework ? 'input-error' : ''}`}
                  onClick={() => setIsFrameworkDropdownOpen(!isFrameworkDropdownOpen)}
                  disabled={!selectedRole}
                >
                  <div className="flex flex-wrap gap-1 max-w-[90%] overflow-hidden">
                    {selectedFrameworks.length === 0 ? (
                      <span className="text-base-content/50">
                        {!selectedRole 
                          ? 'Select a role first' 
                          : 'Select frameworks'}
                      </span>
                    ) : (
                      <span className="truncate">
                        {selectedFrameworks.length} framework{selectedFrameworks.length !== 1 ? 's' : ''} selected
                      </span>
                    )}
                  </div>
                  {isFrameworkDropdownOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                
                {isFrameworkDropdownOpen && selectedRole && (
                  <div className="absolute z-10 mt-1 w-full rounded-md bg-base-100 shadow-lg border border-base-300 max-h-56 overflow-auto">
                    <div className="sticky top-0 p-2 border-b border-base-300 bg-base-100 z-20">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-content/50" />
                        <input
                          type="text"
                          className="input input-sm input-bordered w-full pl-8 pr-2 py-1"
                          placeholder="Search frameworks"
                          value={frameworkSearch}
                          onChange={(e) => setFrameworkSearch(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    
                    <ul className="py-1">
                      {filteredFrameworks.length === 0 ? (
                        <li className="px-3 py-2 text-base-content/50 text-center">
                          No frameworks match your search
                        </li>
                      ) : (
                        filteredFrameworks.map((framework) => (
                          <li
                            key={framework}
                            className="px-3 py-2 cursor-pointer hover:bg-base-200 transition-colors"
                            onClick={() => handleFrameworkToggle(framework)}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`h-4 w-4 border rounded flex items-center justify-center transition-colors ${
                                selectedFrameworks.includes(framework) ? 'bg-primary border-primary' : 'border-base-300'
                              }`}>
                                {selectedFrameworks.includes(framework) && (
                                  <Check className="h-3 w-3 text-primary-content" />
                                )}
                              </div>
                              <span className={selectedFrameworks.includes(framework) ? 'font-medium' : ''}>
                                {framework}
                              </span>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                )}
              </div>
              {errors.framework && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.framework.message}</span>
                </label>
              )}
            </div>
          </div>
          
          {/* Display Selected Frameworks */}
          {selectedFrameworks.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Selected Frameworks:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedFrameworks.map(framework => (
                  <div 
                    key={framework} 
                    className="badge badge-secondary badge-outline flex items-center gap-2 p-3"
                  >
                    {framework}
                    <button 
                      type="button" 
                      className="btn btn-xs btn-circle btn-ghost" 
                      onClick={() => handleFrameworkToggle(framework)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Deadline</span>
            </label>
            <input
              type="date"
              className={`input input-bordered w-full ${errors.deadline ? 'input-error' : ''}`}
              {...register('deadline')}
            />
            {errors.deadline && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.deadline.message}</span>
              </label>
            )}
          </div>
          
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Round Types</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {roundTypeOptions.map((type: RoundType) => (
                <div
                  key={type}
                  onClick={() => handleRoundTypeToggle(type)}
                  className={`badge badge-lg cursor-pointer p-4 ${
                    selectedRoundTypes.includes(type)
                      ? 'badge-primary'
                      : 'badge-outline'
                  }`}
                >
                  {type}
                </div>
              ))}
            </div>
            {errors.roundTypes && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.roundTypes.message}</span>
              </label>
            )}
          </div>
          
          <div className="modal-action mt-6">
            <button 
              type="button" 
              className="btn" 
              onClick={handleClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating...
                </>
              ) : (
                'Create Job'
              )}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
};

export default CreateJobModal; 