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
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences.
        </p>
      </div>

      <Card className="border-border shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="bg-muted/30 border-b border-border">
          <CardTitle className="text-foreground">Profile Information</CardTitle>
          <CardDescription className="text-muted-foreground">
            Update your personal information and company details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Full Name</Label>
              <Input id="name" defaultValue="John Doe" className="border-border focus-visible:ring-primary" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email Address</Label>
              <Input id="email" type="email" defaultValue="john.doe@example.com" className="border-border focus-visible:ring-primary" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company" className="text-foreground">Company Name</Label>
              <Input id="company" defaultValue="Acme Inc." className="border-border focus-visible:ring-primary" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position" className="text-foreground">Position/Title</Label>
              <Input id="position" defaultValue="HR Manager" className="border-border focus-visible:ring-primary" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-foreground">Company Bio</Label>
            <Textarea 
              id="bio" 
              rows={4}
              defaultValue="Acme Inc. is a leading technology company focused on innovation and growth."
              className="border-border focus-visible:ring-primary"
            />
          </div>
          
          <Button className="hover:bg-primary/90 transition-colors duration-300">Save Changes</Button>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="bg-muted/30 border-b border-border">
          <CardTitle className="text-foreground">Notification Preferences</CardTitle>
          <CardDescription className="text-muted-foreground">
            Configure how and when you receive notifications about interviews.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between hover:bg-primary/5 p-2 rounded-md transition-colors">
            <div className="space-y-0.5">
              <div className="font-medium text-foreground">Email Notifications</div>
              <div className="text-sm text-muted-foreground">Receive notifications via email</div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between hover:bg-primary/5 p-2 rounded-md transition-colors">
            <div className="space-y-0.5">
              <div className="font-medium text-foreground">New Interview Alerts</div>
              <div className="text-sm text-muted-foreground">Get notified when new interviews are scheduled</div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between hover:bg-primary/5 p-2 rounded-md transition-colors">
            <div className="space-y-0.5">
              <div className="font-medium text-foreground">Interview Results</div>
              <div className="text-sm text-muted-foreground">Get notified when interview results are ready</div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between hover:bg-primary/5 p-2 rounded-md transition-colors">
            <div className="space-y-0.5">
              <div className="font-medium text-foreground">Weekly Reports</div>
              <div className="text-sm text-muted-foreground">Receive weekly summary reports</div>
            </div>
            <Switch />
          </div>
          
          <Button className="hover:bg-primary/90 transition-colors duration-300">Save Preferences</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;