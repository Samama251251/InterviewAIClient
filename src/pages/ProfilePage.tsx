import React, { useState, useEffect } from 'react';
import { UserAuth } from '@/contexts/AuthContext';
import { User, Mail, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage: React.FC = () => {
  const { session } = UserAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user?.name);
    }
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Need to make a function to update the user 
    const success = true; // Simulate success
    setLoading(false);

    if (success) {
      showToast('Profile updated successfully!', 'success');
    } else {
      showToast('Could not update profile.', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-base-content/70 mt-1">Manage your personal information and account details</p>
      </motion.div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Details Section */}
        <motion.div 
          className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300 md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="card-body p-0">
            <div className="p-6 border-b border-base-300 bg-base-200/50">
              <h2 className="card-title flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </h2>
              <p className="text-base-content/70 text-sm">Update your personal details</p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-5">
                <div className="space-y-2.5">
                  <label htmlFor="name" className="label text-sm font-medium">
                    Full Name
                  </label>
                  <div className="relative">
                    <input 
                      id="name" 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Your Name" 
                      required
                      className="input input-bordered w-full pl-10"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
                  </div>
                </div>
                
                <div className="divider"></div>
                
                <div className="space-y-2.5">
                  <label htmlFor="email" className="label text-sm font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <input 
                      id="email" 
                      type="email" 
                      value={email} 
                      disabled
                      className="input input-bordered w-full pl-10 bg-base-200/50 text-base-content/70"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
                  </div>
                  <p className="text-xs text-base-content/70">
                    Your email address is associated with your account and cannot be changed here.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end p-6 border-t border-base-300 bg-base-200/50">
                <button 
                  type="submit" 
                  disabled={loading || !name}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
        
        {/* Additional Profile Options */}
        <motion.div 
          className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="card-body">
            <h2 className="card-title">Account Details</h2>
            <div className="py-4">
              <div className="avatar placeholder mx-auto mb-4">
                {session?.user?.image ? (
                  <div className="w-24 rounded-full ring ring-primary ring-opacity-10">
                    <img src={session.user.image} alt={name || "User"} />
                  </div>
                ) : (
                  <div className="bg-primary text-primary-content rounded-full w-24">
                    <span className="text-3xl">{name?.charAt(0) || 'U'}</span>
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <h3 className="font-bold text-lg">{name || "User"}</h3>
                <p className="text-base-content/70">{email}</p>
              </div>
              
              <div className="divider mt-6"></div>
              
              <ul className="menu bg-base-200 rounded-box mt-4">
                <li><a>Security Settings</a></li>
                <li><a>Notification Preferences</a></li>
                <li><a>Connected Accounts</a></li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Toast notification */}
      {toastVisible && (
        <div className={`toast toast-top toast-end z-50`}>
          <div className={`alert ${toastType === 'success' ? 'alert-success' : 'alert-error'}`}>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage; 