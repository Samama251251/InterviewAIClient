import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/useToast';
import { useEmployees } from '@/hooks/useEmployees';
import { getUserByEmail } from '@/services/getUserByEmail';
import { Company } from '@/types/company';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
  onSuccess?: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ 
  isOpen, 
  onClose, 
  company,
  onSuccess
}) => {
  const toast = useToast();
  const { createEmployee } = useEmployees();
  
  // Form setup for adding a new employee
  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, setError } = useForm<{
    email: string;
    role: string;
  }>();

  // Handle adding a new employee
  const handleAddEmployee = async (data: { email: string; role: string }) => {
    if (!company) {
      toast.error('No company selected');
      onClose();
      return;
    }
    
    try {
      // First, convert email to user ID using getUserByEmail
      let userData;
      try {
        userData = await getUserByEmail(data.email);
      } catch (error: any) {
        setError('email', {
          type: 'manual',
          message: error.message || 'Failed to find user with this email'
        });
        return;
      }
      
      // Create employee with the found user ID and current selected company
      const newEmployeeData = {
        company_id: company._id,
        user_id: userData._id, // Now using the actual user ID
        role: data.role
      };
      
      await createEmployee.mutateAsync(newEmployeeData);
      reset();
      onClose();
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      console.error('Error adding employee:', error);
      // Set form error based on API response
      if (error.response?.data?.message?.includes('already exists')) {
        setError('email', {
          type: 'manual',
          message: 'This user is already an employee of this company'
        });
      } else {
        setError('email', {
          type: 'manual',
          message: 'Failed to add employee. Please try again.'
        });
      }
    }
  };

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Add New Employee to {company?.name}</h3>
          <button 
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleAddEmployee)}>
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

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Role</span>
            </label>
            <input
              type="text"
              className={`input input-bordered w-full ${errors.role ? 'input-error' : ''}`}
              placeholder="e.g. Developer, HR Manager, etc."
              {...register('role', { required: "Role is required" })}
            />
            {errors.role && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.role.message}</span>
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
                <>Add Employee</>
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

export default AddEmployeeModal; 