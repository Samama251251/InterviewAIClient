import React, { useState, useEffect } from 'react';
import { MOCK_PROFILE, MOCK_NOTIFICATION_PREFERENCES } from './mockData';
import { Profile, NotificationPreferences } from '../../types';

const Settings: React.FC = () => {
  // Profile state
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    company_name: '',
    position: '',
    company_bio: '',
  });

  // Notification preferences state
  const [notificationPrefs, setNotificationPrefs] = useState({
    email_notifications: true,
    new_interview_alerts: true,
    interview_results: true,
    weekly_reports: false,
  });

  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isPrefsLoading, setIsPrefsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  useEffect(() => {
    // Simulate API call to get profile data
    const profileTimer = setTimeout(() => {
      setProfileData({
        full_name: MOCK_PROFILE.full_name,
        email: MOCK_PROFILE.email,
        company_name: MOCK_PROFILE.company_name,
        position: MOCK_PROFILE.position,
        company_bio: MOCK_PROFILE.company_bio,
      });
      setIsProfileLoading(false);
    }, 500);

    // Simulate API call to get notification preferences
    const prefsTimer = setTimeout(() => {
      setNotificationPrefs({
        email_notifications: MOCK_NOTIFICATION_PREFERENCES.email_notifications,
        new_interview_alerts: MOCK_NOTIFICATION_PREFERENCES.new_interview_alerts,
        interview_results: MOCK_NOTIFICATION_PREFERENCES.interview_results,
        weekly_reports: MOCK_NOTIFICATION_PREFERENCES.weekly_reports,
      });
      setIsPrefsLoading(false);
    }, 600);

    return () => {
      clearTimeout(profileTimer);
      clearTimeout(prefsTimer);
    };
  }, []);

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle notification preferences changes
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationPrefs((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Handle profile form submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would make an API call here
      setIsSavingProfile(false);
      alert('Profile updated successfully!');
    }, 800);
  };

  // Handle notification preferences form submission
  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPrefs(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would make an API call here
      setIsSavingPrefs(false);
      alert('Notification preferences updated successfully!');
    }, 800);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      <p className="mt-2 text-gray-600">Manage your account settings and preferences.</p>

      {/* Profile Information */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
          <p className="mt-1 text-sm text-gray-500">Update your personal information and company details.</p>

          {isProfileLoading ? (
            <div className="my-8 flex justify-center">
              <p>Loading profile information...</p>
            </div>
          ) : (
            <form onSubmit={handleProfileSubmit} className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={profileData.full_name}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white"
                    disabled
                  />
                </div>

                <div>
                  <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={profileData.company_name}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                    Position/Title
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={profileData.position}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company_bio" className="block text-sm font-medium text-gray-700">
                  Company Bio
                </label>
                <textarea
                  id="company_bio"
                  name="company_bio"
                  rows={4}
                  value={profileData.company_bio}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  disabled={isSavingProfile}
                >
                  {isSavingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800">Notification Preferences</h2>
          <p className="mt-1 text-sm text-gray-500">Configure how and when you receive notifications about interviews.</p>

          {isPrefsLoading ? (
            <div className="my-8 flex justify-center">
              <p>Loading notification preferences...</p>
            </div>
          ) : (
            <form onSubmit={handleNotificationSubmit} className="mt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="email_notifications"
                      name="email_notifications"
                      type="checkbox"
                      checked={notificationPrefs.email_notifications}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="email_notifications" className="font-medium text-gray-700">
                      Email Notifications
                    </label>
                    <p className="text-gray-500">Receive notifications via email</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="new_interview_alerts"
                      name="new_interview_alerts"
                      type="checkbox"
                      checked={notificationPrefs.new_interview_alerts}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="new_interview_alerts" className="font-medium text-gray-700">
                      New Interview Alerts
                    </label>
                    <p className="text-gray-500">Get notified when new interviews are scheduled</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="interview_results"
                      name="interview_results"
                      type="checkbox"
                      checked={notificationPrefs.interview_results}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="interview_results" className="font-medium text-gray-700">
                      Interview Results
                    </label>
                    <p className="text-gray-500">Get notified when interview results are ready</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="weekly_reports"
                      name="weekly_reports"
                      type="checkbox"
                      checked={notificationPrefs.weekly_reports}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="weekly_reports" className="font-medium text-gray-700">
                      Weekly Reports
                    </label>
                    <p className="text-gray-500">Receive weekly summary reports</p>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  disabled={isSavingPrefs}
                >
                  {isSavingPrefs ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;