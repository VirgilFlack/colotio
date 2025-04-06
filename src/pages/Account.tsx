
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { UserCircle, Save, LogOut, Trash2, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const Account = () => {
  const [userName, setUserName] = useState('');
  const [userInitial, setUserInitial] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Load user name from localStorage
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
      setUserInitial(storedName.charAt(0).toUpperCase());
    }
  }, []);

  const handleSaveProfile = () => {
    if (userName.trim()) {
      localStorage.setItem('userName', userName.trim());
      setUserInitial(userName.charAt(0).toUpperCase());
      toast.success('Profile updated successfully');
    } else {
      toast.error('Please enter a valid name');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleEraseAllData = () => {
    if (deleteConfirmation.trim() === 'Delete') {
      // Clear all color data from localStorage
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes('color') || key.includes('Color')) {
          localStorage.removeItem(key);
        }
      });
      
      // Remove main userData
      localStorage.removeItem('userData');
      
      toast.success('All color data has been erased');
      setShowDeleteDialog(false);
      setDeleteConfirmation('');
      
      // Dispatch custom events to notify all components about data deletion
      window.dispatchEvent(new Event('colorDataErased'));
      
      // Force refresh of all components that might be showing color data
      window.dispatchEvent(new StorageEvent('storage', { key: 'userData' }));
      
      // Redirect to dashboard to refresh the view
      navigate('/dashboard');
    } else {
      toast.error('Please type "Delete" to confirm');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20">
        <div className="flex flex-col gap-6 mt-8">
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account settings and manage your preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Display Name</Label>
                    <Input 
                      id="username" 
                      value={userName} 
                      onChange={(e) => setUserName(e.target.value)} 
                      placeholder="Enter your name" 
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveProfile} className="ml-auto flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {userInitial || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-xl font-medium">{userName || 'User'}</h3>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 border-destructive text-destructive hover:bg-destructive/10"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Erase All Color Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Erase All Color Data
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete all of your color data. This cannot be undone.
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
                <p className="font-medium">To confirm, type "Delete" in the field below:</p>
              </div>
              <div className="mt-4">
                <Input
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder='Type "Delete" here'
                  className="border-destructive/50 focus-visible:ring-destructive"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmation('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleEraseAllData}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteConfirmation !== 'Delete'}
            >
              Erase All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Account;
