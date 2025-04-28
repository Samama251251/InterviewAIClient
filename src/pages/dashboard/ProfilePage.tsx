import React, { useState, useEffect } from 'react';
import { UserAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Save } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ProfilePage: React.FC = () => {
  const { session} = UserAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
    const success = true
    setLoading(false);

    if (success) {
      toast({ description: "Profile updated successfully!" });
    } else {
      toast({ variant: "destructive", title: "Update Failed", description: "Could not update profile." });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information and account details</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Details Section */}
        <Card className="md:col-span-2 border-border shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="border-b border-border bg-muted/30">
            <CardTitle className="text-xl font-semibold flex items-center gap-2 text-foreground">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription className="text-muted-foreground">Update your personal details</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-2.5">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                  Full Name
                </Label>
                <div className="relative">
                  <Input 
                    id="name" 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Your Name" 
                    required
                    className="pl-10 border-border focus:border-primary focus:ring-primary"
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              <Separator className="bg-border" />
              
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    disabled
                    className="pl-10 bg-muted/50 text-muted-foreground border-border"
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Your email address is associated with your account and cannot be changed here.
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end border-t border-border px-6 py-4 bg-muted/30">
              <Button 
                type="submit" 
                disabled={loading || !name}
                className="flex items-center gap-2 hover:bg-primary/90 transition-colors duration-300"
              >
                <Save className="h-4 w-4" />
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage; 