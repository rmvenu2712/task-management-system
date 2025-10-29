import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTaskStore } from '@/store/taskStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Briefcase, Edit2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { userProfile, updateUserProfile } = useTaskStore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [role, setRole] = useState(userProfile.role);

  const handleSave = () => {
    updateUserProfile({ name, email, role });
    setIsEditing(false);
    toast({
      title: 'Profile updated',
      description: 'Your profile information has been saved successfully.',
    });
  };

  const handleCancel = () => {
    setName(userProfile.name);
    setEmail(userProfile.email);
    setRole(userProfile.role);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your profile details</CardDescription>
              </div>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleCancel} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                  {name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{userProfile.name}</h3>
                <p className="text-muted-foreground">{userProfile.role}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Role
                </Label>
                <Input
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your workspace experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates about your tasks</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-muted-foreground">Customize your workspace appearance</p>
                </div>
                <Button variant="outline" size="sm">Change</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
