import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/useToast';
import { useCompanies } from '@/hooks/useCompanies';
import { Company } from '@/types/company';

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
}

const EditCompanyModal: React.FC<EditCompanyModalProps> = ({ 
  isOpen, 
  onClose, 
  company 
}) => {
  const toast = useToast();
  const { updateCompany } = useCompanies();
  
  // Form setup for editing company details
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<{
    name: string;
    description: string;
  }>({
    defaultValues: {
      name: company.name,
      description: company.description || ''
    }
  });

  // Update defaultValues when company changes
  useEffect(() => {
    reset({
      name: company.name,
      description: company.description || ''
    });
  }, [company, reset]);

  // Handle editing company
  const handleEditCompany = async (data: { name: string; description: string }) => {
    try {
      await updateCompany.mutateAsync({
        id: company._id,
        data: {
          name: data.name,
          description: data.description
        }
      });
      
      onClose();
      toast.success('Company details updated successfully');
    } catch (error: any) {
      console.error('Error updating company:', error);
      toast.error('Failed to update company details');
    }
  };

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Edit Company Details</h3>
          <button 
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleEditCompany)}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Company Name</span>
            </label>
            <input
              type="text"
              className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
              {...register('name', { required: "Company name is required" })}
            />
            {errors.name && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.name.message}</span>
              </label>
            )}
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className={`textarea textarea-bordered w-full h-24 ${errors.description ? 'textarea-error' : ''}`}
              placeholder="Enter company description (optional)"
              {...register('description')}
            />
            {errors.description && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.description.message}</span>
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
                  Updating...
                </>
              ) : (
                <>Save Changes</>
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

export default EditCompanyModal; 