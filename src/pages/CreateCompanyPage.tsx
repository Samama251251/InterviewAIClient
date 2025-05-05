import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCompanies } from '@/hooks/useCompanies';
import { X, Building2, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { CreateCompanyInput } from '@/types/company';

const CreateCompanyPage = () => {
  const navigate = useNavigate();
  const { createCompany } = useCompanies();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<CreateCompanyInput>({
    defaultValues: {
      name: '',
      description: '',
    }
  });

  // Handle form submission
  const onSubmit = async (data: CreateCompanyInput) => {
    setIsSubmitting(true);
    try {
      await createCompany.mutateAsync(data);
      navigate('/employee');
    } catch (error) {
      console.error('Error creating company:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-8">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-base-content"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Create New Company
          </motion.h1>
          <button 
            onClick={() => navigate('/employee')}
            className="btn btn-circle btn-ghost"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="card bg-base-200 shadow-xl rounded-box">
          <div className="card-body p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-medium flex items-center gap-2">
                    <Building2 size={18} className="text-primary" />
                    Company Name
                  </span>
                </label>
                <input
                  type="text"
                  {...register('name', { required: "Company name is required" })}
                  className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                  placeholder="Enter company name"
                />
                {errors.name && <span className="label-text-alt text-error mt-1">{errors.name.message}</span>}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-medium flex items-center gap-2">
                    <FileText size={18} className="text-primary" />
                    Description
                  </span>
                  <span className="label-text-alt opacity-70">Optional</span>
                </label>
                <div className="relative">
                  <textarea
                    {...register('description')}
                    className={`textarea textarea-bordered h-40 w-full bg-base-100 focus:bg-base-100 ${errors.description ? 'textarea-error' : ''}`}
                    placeholder="Briefly describe your company, its mission, and vision"
                  />
                  <div className="absolute bottom-3 right-3 opacity-50">
                    <Sparkles size={20} />
                  </div>
                </div>
                {errors.description && <span className="label-text-alt text-error mt-1">{errors.description.message}</span>}
                <p className="text-xs mt-2 text-base-content/70">
                  A good description helps team members and candidates understand your company better.
                </p>
              </div>

              <div className="divider"></div>

              <div className="form-control mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn btn-primary w-full h-14 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-md"></span>
                      Creating...
                    </>
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Company
                      <ArrowRight size={18} />
                    </span>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        {/* Additional info card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="card bg-base-200 shadow-md mt-8 rounded-box"
        >
          <div className="card-body p-6">
            <h3 className="card-title text-accent text-xl flex items-center gap-2">
              <span className="badge badge-accent badge-lg">Next</span>
              What happens after creating your company?
            </h3>
            <div className="space-y-4 mt-2">
              <div className="flex gap-3 items-start">
                <div className="badge badge-primary badge-outline mt-1">1</div>
                <p className="text-base-content/90">Add jobs and manage interviews tailored to your company's needs.</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="badge badge-primary badge-outline mt-1">2</div>
                <p className="text-base-content/90">Invite team members to help manage the hiring process collaboratively.</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="badge badge-primary badge-outline mt-1">3</div>
                <p className="text-base-content/90">Set up custom interview workflows based on your company's specific requirements.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CreateCompanyPage; 