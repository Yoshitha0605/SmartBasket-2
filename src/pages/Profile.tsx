import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Phone, LogOut, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, profile, updateProfile, signOut, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [address, setAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setCity(profile.city || '');
      setPinCode(profile.pin_code || '');
      setAddress(profile.address || '');
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    
    const { error } = await updateProfile({
      name,
      city,
      pin_code: pinCode,
      address,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
    }

    setIsSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">My Profile</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-md">
        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-primary" />
          </div>
        </div>

        {/* Personal Info Card */}
        <Card className="mb-6 border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Name</label>
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 bg-background border-border"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="tel"
                  value={profile?.phone || ''}
                  disabled
                  className="pl-10 h-12 bg-muted border-border"
                />
              </div>
              <p className="text-xs text-muted-foreground">Phone number cannot be changed</p>
            </div>
          </CardContent>
        </Card>

        {/* Location Card */}
        <Card className="mb-6 border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-primary" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">City</label>
              <Input
                type="text"
                placeholder="Enter your city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-12 bg-background border-border"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">PIN Code</label>
              <Input
                type="text"
                placeholder="Enter PIN code"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="h-12 bg-background border-border"
                maxLength={6}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Full Address</label>
              <Input
                type="text"
                placeholder="Enter your full address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-12 bg-background border-border"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground" />
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Save Changes
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full h-12 rounded-xl font-semibold border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Profile;
