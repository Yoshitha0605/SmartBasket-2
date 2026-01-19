import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, User, ArrowRight, ShoppingCart, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const phoneSchema = z.string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number is too long')
  .regex(/^[0-9+\-\s]+$/, 'Invalid phone number format');

const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name is too long')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [errors, setErrors] = useState<{ phone?: string; name?: string; otp?: string }>({});
  
  const { sendOtp, verifyOtp, user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/home');
    }
  }, [user, loading, navigate]);

  // Cooldown timer for resend OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const validatePhone = () => {
    const phoneResult = phoneSchema.safeParse(phone);
    if (!phoneResult.success) {
      setErrors(prev => ({ ...prev, phone: phoneResult.error.errors[0].message }));
      return false;
    }
    setErrors(prev => ({ ...prev, phone: undefined }));
    return true;
  };

  const validateName = () => {
    if (!isSignUp) return true;
    const nameResult = nameSchema.safeParse(name);
    if (!nameResult.success) {
      setErrors(prev => ({ ...prev, name: nameResult.error.errors[0].message }));
      return false;
    }
    setErrors(prev => ({ ...prev, name: undefined }));
    return true;
  };

  const handleSendOtp = async () => {
    if (!validatePhone() || !validateName()) return;

    setIsLoading(true);
    const { error } = await sendOtp(phone, isSignUp ? name : undefined);
    setIsLoading(false);

    if (error) {
      toast({
        title: "Failed to send OTP",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      return;
    }

    setShowOtp(true);
    setResendCooldown(60);
    toast({
      title: "OTP Sent",
      description: `A 6-digit verification code has been sent to ${phone}`,
    });
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    
    setIsLoading(true);
    const { error } = await sendOtp(phone, isSignUp ? name : undefined);
    setIsLoading(false);

    if (error) {
      toast({
        title: "Failed to resend OTP",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      return;
    }

    setResendCooldown(60);
    setOtp('');
    toast({
      title: "OTP Resent",
      description: "A new verification code has been sent",
    });
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setErrors(prev => ({ ...prev, otp: 'Please enter a 6-digit verification code' }));
      return;
    }

    setErrors(prev => ({ ...prev, otp: undefined }));
    setIsLoading(true);
    const { error } = await verifyOtp(phone, otp);
    setIsLoading(false);

    if (error) {
      let errorMessage = 'Invalid OTP';
      if (error.message.includes('expired')) {
        errorMessage = 'OTP expired, please request a new one';
      } else if (error.message.includes('invalid')) {
        errorMessage = 'Invalid OTP. Please check and try again';
      }
      
      setErrors(prev => ({ ...prev, otp: errorMessage }));
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: isSignUp ? "Account Created" : "Welcome Back",
      description: isSignUp ? "Welcome to SmartBasket!" : "You have successfully signed in!",
    });
    navigate('/home');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showOtp) {
      await handleVerifyOtp();
    } else {
      await handleSendOtp();
    }
  };

  const handleChangePhone = () => {
    setShowOtp(false);
    setOtp('');
    setErrors({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center gap-3">
        <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center shadow-glow">
          <ShoppingCart className="h-7 w-7 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">SmartBasket</h1>
          <p className="text-sm text-muted-foreground">Compare & Save</p>
        </div>
      </div>

      {/* Auth Form */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <Card className="w-full max-w-md border-border bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {showOtp ? 'Enter OTP' : (isSignUp ? 'Create Account' : 'Welcome Back')}
            </CardTitle>
            <CardDescription>
              {showOtp 
                ? `Enter the 6-digit code sent to ${phone}`
                : (isSignUp 
                    ? 'Sign up with your phone number' 
                    : 'Sign in to continue shopping')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!showOtp && (
                <>
                  {isSignUp && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Enter your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10 h-12 bg-background border-border"
                        />
                      </div>
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="tel"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 h-12 bg-background border-border"
                      />
                    </div>
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>
                </>
              )}

              {showOtp && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Verification Code</label>
                    <Input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="h-14 text-center text-2xl tracking-[0.5em] bg-background border-border font-mono"
                      maxLength={6}
                      autoFocus
                    />
                    {errors.otp && <p className="text-sm text-destructive text-center">{errors.otp}</p>}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={handleChangePhone}
                      className="text-primary hover:underline"
                    >
                      Change phone number
                    </button>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || isLoading}
                      className="text-primary hover:underline disabled:text-muted-foreground disabled:no-underline flex items-center gap-1"
                    >
                      <RefreshCw className="h-4 w-4" />
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                    </button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground" />
                ) : (
                  <>
                    {showOtp ? 'Verify & Continue' : 'Send OTP'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            {!showOtp && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrors({});
                  }}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  {isSignUp 
                    ? 'Already have an account? Sign In' 
                    : "Don't have an account? Sign Up"}
                </button>
              </div>
            )}

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => navigate('/home')}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Continue as guest
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
