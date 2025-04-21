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
  const { session, updateUser } = UserAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user?.user_metadata?.name) {
      setName(session.user.user_metadata.name);
    }
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { success, error } = await updateUser({ name });
    setLoading(false);

    if (success) {
      toast({ description: "Profile updated successfully!" });
    } else {
      toast({ variant: "destructive", title: "Update Failed", description: error || "Could not update profile." });
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your personal information and account details</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Details Section */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              Personal Information
            </CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              <div className="space-y-2.5">
                <Label htmlFor="name" className="text-sm font-medium">
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
                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    disabled
                    className="pl-10 bg-gray-50 text-gray-500 border-gray-200"
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  Your email address is associated with your account and cannot be changed here.
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end border-t px-6 py-4 bg-gray-50">
              <Button 
                type="submit" 
                disabled={loading || !name} 
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
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