import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateJobInput, RoundType } from '@/types/job';
import { useJobs } from '@/hooks/useJobs';
import { useToast } from '@/hooks/useToast';
import { Company } from '@/types/company';

// Form validation schema that matches CreateJobInput structure
const jobFormSchema = z.object({
  name: z.string().min(3, { message: "Job title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  role: z.string().min(2, { message: "Role is required" }),
  framework: z.string().min(2, { message: "Framework is required" }),
  deadline: z.string().min(2, { message: "Deadline is required" }),
  roundTypes: z.array(z.string()).min(1, { message: "At least one round type is required" }),
  company_id: z.string().optional() // Will be filled in during submission
});

// Form type that matches the schema
type JobFormData = z.infer<typeof jobFormSchema>;

const roundTypeOptions: RoundType[] = [
  'Coding', 
  'FrameworkSpecific', 
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

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    reset, 
    setValue 
  } = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      name: '',
      description: '',
      role: '',
      framework: '',
      deadline: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
      roundTypes: []
    }
  });

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

  // Handle form submission and convert to CreateJobInput
  const onSubmit = async (data: JobFormData) => {
    if (!selectedCompany) {
      toast.error('Please select a company first');
      return;
    }

    // Create a properly typed CreateJobInput
    const jobInput: CreateJobInput = {
      name: data.name,
      description: data.description,
      role: data.role,
      framework: data.framework,
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
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <input
                type="text"
                className={`input input-bordered w-full ${errors.role ? 'input-error' : ''}`}
                placeholder="e.g., Frontend Developer, UI Designer"
                {...register('role')}
              />
              {errors.role && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.role.message}</span>
                </label>
              )}
            </div>
            
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Framework</span>
              </label>
              <input
                type="text"
                className={`input input-bordered w-full ${errors.framework ? 'input-error' : ''}`}
                placeholder="e.g., React, Angular, Vue"
                {...register('framework')}
              />
              {errors.framework && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.framework.message}</span>
                </label>
              )}
            </div>
          </div>
          
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
              {roundTypeOptions.map(type => (
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