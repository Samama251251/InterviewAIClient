import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and company details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="john.doe@example.com" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input id="company" defaultValue="Acme Inc." />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Position/Title</Label>
              <Input id="position" defaultValue="HR Manager" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Company Bio</Label>
            <Textarea 
              id="bio" 
              rows={4}
              defaultValue="Acme Inc. is a leading technology company focused on innovation and growth."
            />
          </div>
          
          <Button className="bg-interviewai-green hover:bg-interviewai-green/90">Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Configure how and when you receive notifications about interviews.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Email Notifications</div>
              <div className="text-sm text-muted-foreground">Receive notifications via email</div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">New Interview Alerts</div>
              <div className="text-sm text-muted-foreground">Get notified when new interviews are scheduled</div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Interview Results</div>
              <div className="text-sm text-muted-foreground">Get notified when interview results are ready</div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Weekly Reports</div>
              <div className="text-sm text-muted-foreground">Receive weekly summary reports</div>
            </div>
            <Switch />
          </div>
          
          <Button className="bg-interviewai-green hover:bg-interviewai-green/90">Save Preferences</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;