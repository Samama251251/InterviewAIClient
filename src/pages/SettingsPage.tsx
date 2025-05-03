import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Building, Save, AtSign, BriefcaseBusiness, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Link to="/employee" className="text-base-content/70 hover:text-primary transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          </div>
          <p className="text-base-content/70 mt-2">
            Manage your personal information and preferences
          </p>
        </div>
      </motion.div>

      {/* Profile Information Card */}
      <motion.div 
        className="card bg-base-100 shadow-sm border border-base-300"
        variants={itemVariants}
      >
        <div className="card-body p-0">
          <div className="p-4 md:p-6 border-b border-base-300 bg-base-200/50">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <h2 className="card-title text-lg">Profile Information</h2>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-sm font-medium text-base-content/70 uppercase tracking-wider mb-4">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="form-control w-full">
                  <label htmlFor="name" className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <div className="relative">
                    <input 
                      id="name" 
                      className="input input-bordered w-full pl-10" 
                      defaultValue="John Doe" 
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
                  </div>
                </div>
                
                <div className="form-control w-full">
                  <label htmlFor="email" className="label">
                    <span className="label-text font-medium">Email Address</span>
                  </label>
                  <div className="relative">
                    <input 
                      id="email" 
                      type="email" 
                      className="input input-bordered w-full pl-10 bg-base-200 cursor-not-allowed" 
                      defaultValue="john.doe@example.com" 
                      disabled
                      readOnly
                    />
                    <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
                  </div>
                  <label className="label">
                    <span className="label-text-alt text-base-content/60">Email address cannot be changed</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Form Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                type="submit" 
                className="btn btn-primary flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving Changes
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
              <button type="reset" className="btn btn-outline">
                Reset
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;