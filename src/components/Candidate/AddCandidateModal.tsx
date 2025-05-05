import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { CreateInterviewInput } from '@/types/interview';
import { useInterviews } from '@/hooks/useInterviews';
import { useToast } from '@/hooks/useToast';
import { getUserByEmail } from '@/services/getUserByEmail';
interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
}

const AddCandidateModal: React.FC<AddCandidateModalProps> = ({ 
  isOpen, 
  onClose, 
  jobId 
}) => {
  const toast = useToast();
  const { createInterview } = useInterviews();
  
  // Form setup for adding a new candidate
  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, setError } = useForm<{
    name: string;
    email: string;
  }>();

  const handleAddCandidate = async (data: { name: string; email: string; }) => {
    try {
      // First, get the user by email
      let userId;
      try {
        const user = await getUserByEmail(data.email);
        userId = user._id;
      } catch (error: any) {
        setError('email', { 
          type: 'manual', 
          message: error.message || 'Failed to find user with this email' 
        });
        return;
      }
      
      // Create interview with the found user ID
      const interviewData: CreateInterviewInput = {
        job_id: jobId,
        user_id: userId
      };
      
      await createInterview.mutateAsync(interviewData);
      onClose();
      reset();
      toast.success('Candidate added successfully!');
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error creating interview';
      toast.error(errorMessage);
      console.error('Error creating interview:', error);
    }
  };

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Add New Candidate</h3>
          <button 
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleAddCandidate)}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Candidate Name</span>
            </label>
            <input
              type="text"
              className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
              placeholder="Enter candidate name"
              {...register('name', { required: "Candidate name is required" })}
            />
            {errors.name && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.name.message}</span>
              </label>
            )}
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Email Address</span>
              <span className="label-text-alt">Must be a registered user</span>
            </label>
            <input
              type="email"
              className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
              placeholder="Enter email address"
              {...register('email', { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.email.message}</span>
              </label>
            )}
          </div>

          <div className="modal-action mt-6">
            <button 
              type="button" 
              className="btn" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Adding...
                </>
              ) : (
                <>Add Candidate</>
              )}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default AddCandidateModal; 