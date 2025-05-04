import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/useToast';

interface ScreenCandidatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (criteria: string) => Promise<string | void>;
}

const ScreenCandidatesModal: React.FC<ScreenCandidatesModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  const toast = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form setup for screening criteria
  const { register, handleSubmit, formState: { errors } } = useForm<{
    criteria: string;
  }>();

  // Handle confirmation
  const handleConfirmScreen = async (data: { criteria: string }) => {
    setIsProcessing(true);
    
    try {
      const result = await onConfirm(data.criteria);
      // If a success message is returned, use it
      toast.success(typeof result === 'string' ? result : 'Candidates screened successfully');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to screen candidates');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Screen Candidates</h3>
          <button 
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-warning/10 p-4 rounded-lg mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <p className="font-medium text-sm">Are you sure you want to screen candidates?</p>
              <p className="text-xs text-base-content/70 mt-1">
                This action will filter candidates based on the specified criteria. The screening process will be applied to all candidates.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleConfirmScreen)}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Screening Criteria</span>
              <span className="label-text-alt">Required</span>
            </label>
            <textarea
              className={`textarea textarea-bordered w-full h-24 ${errors.criteria ? 'textarea-error' : ''}`}
              placeholder="Specify criteria for screening candidates (e.g., technical skills, experience requirements, etc.)"
              {...register('criteria', { 
                required: "Please specify screening criteria" 
              })}
            />
            {errors.criteria && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.criteria.message}</span>
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
              className="btn btn-warning"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Processing...
                </>
              ) : (
                <>Confirm Screening</>
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

export default ScreenCandidatesModal; 