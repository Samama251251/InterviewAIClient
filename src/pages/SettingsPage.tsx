import React from 'react';
import { motion } from 'framer-motion';
import { User, Building, MessageSquare, Bell, Shield, Mail, Settings as SettingsIcon } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-base-content/70 mt-2">
          Manage your account settings and preferences.
        </p>
      </motion.div>

      <motion.div 
        className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="card-body p-0">
          <div className="p-6 border-b border-base-300 bg-base-200/50">
            <h2 className="card-title flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile Information
            </h2>
            <p className="text-base-content/70 text-sm">
              Update your personal information and company details.
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label htmlFor="name" className="label">Full Name</label>
                <input 
                  id="name" 
                  className="input input-bordered w-full" 
                  defaultValue="John Doe" 
                />
              </div>
              
              <div className="form-control w-full">
                <label htmlFor="email" className="label">Email Address</label>
                <input 
                  id="email" 
                  type="email" 
                  className="input input-bordered w-full" 
                  defaultValue="john.doe@example.com" 
                />
              </div>
              
              <div className="form-control w-full">
                <label htmlFor="company" className="label">Company Name</label>
                <div className="relative">
                  <input 
                    id="company" 
                    className="input input-bordered w-full pl-10" 
                    defaultValue="Acme Inc." 
                  />
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
                </div>
              </div>
              
              <div className="form-control w-full">
                <label htmlFor="position" className="label">Position/Title</label>
                <input 
                  id="position" 
                  className="input input-bordered w-full" 
                  defaultValue="HR Manager" 
                />
              </div>
            </div>
            
            <div className="form-control w-full">
              <label htmlFor="bio" className="label">Company Bio</label>
              <textarea 
                id="bio" 
                rows={4}
                className="textarea textarea-bordered w-full" 
                defaultValue="Acme Inc. is a leading technology company focused on innovation and growth."
              />
            </div>
            
            <button className="btn btn-primary">Save Changes</button>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="card-body p-0">
          <div className="p-6 border-b border-base-300 bg-base-200/50">
            <h2 className="card-title flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notification Preferences
            </h2>
            <p className="text-base-content/70 text-sm">
              Configure how and when you receive notifications about interviews.
            </p>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between hover:bg-base-200 p-3 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-base-content/70">Receive notifications via email</div>
                </div>
              </div>
              <input type="checkbox" className="toggle toggle-primary" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between hover:bg-base-200 p-3 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">New Interview Alerts</div>
                  <div className="text-sm text-base-content/70">Get notified when new interviews are scheduled</div>
                </div>
              </div>
              <input type="checkbox" className="toggle toggle-primary" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between hover:bg-base-200 p-3 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <SettingsIcon className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Interview Results</div>
                  <div className="text-sm text-base-content/70">Get notified when interview results are ready</div>
                </div>
              </div>
              <input type="checkbox" className="toggle toggle-primary" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between hover:bg-base-200 p-3 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Weekly Reports</div>
                  <div className="text-sm text-base-content/70">Receive weekly summary reports</div>
                </div>
              </div>
              <input type="checkbox" className="toggle toggle-primary" />
            </div>
            
            <button className="btn btn-primary mt-4">Save Preferences</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;