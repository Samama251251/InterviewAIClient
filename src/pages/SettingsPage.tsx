import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Save, AtSign, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { editUser } from '@/services/editUserService';

const SettingsPage: React.FC = () => {
  const { session } = UserAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  
  // When the session data loads, set the name field
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);
  
  // Validate form fields
  const validateForm = () => {
    let isValid = true;
    
    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      isValid = false;
    } else {
      setNameError('');
    }
    
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!validateForm()) {
      return;
    }

    // Don't submit if no changes were made
    if (session?.user?.name === name) {
      toast.info('No changes to save');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userId = session?.user?.id;
      
      if (!userId) {
        throw new Error('User ID is not available');
      }
      
      // Call the edit user service
      await editUser(userId, { name: name.trim() });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
    setNameError('');
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
                      className={`input input-bordered w-full pl-10 ${nameError ? 'input-error' : ''}`}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
                  </div>
                  {nameError && (
                    <label className="label">
                      <span className="label-text-alt text-error">{nameError}</span>
                    </label>
                  )}
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
                      value={session?.user?.email || ''}
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
                disabled={isLoading || !session?.user}
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
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={handleReset}
                disabled={isLoading}
              >
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