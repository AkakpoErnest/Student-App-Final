import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle, Shield, Users, TrendingUp, ArrowLeft, Eye, EyeOff, Mail, Lock, User as UserIcon, BookOpen, Briefcase, ShoppingCart } from 'lucide-react';
import Logo from '@/components/Logo';
import { logSupabaseError, getUserFriendlyErrorMessage } from '@/lib/errorUtils';
import { Link } from 'react-router-dom';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        toast.success('Welcome to StuFind!');
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName.trim(),
          }
        }
      });

      if (error) {
        toast.error(error.message);
      } else if (data.user) {
        // Try to create profile
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: fullName.trim(),
        });
        
        if (profileError) {
          console.warn('Profile creation warning:', profileError);
        }
        
        toast.success('Account created! Check your email to verify your account.');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Incorrect email or password. Please try again.');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please check your email and click the confirmation link.');
        } else {
          toast.error(error.message);
        }
      }
    } catch (error: any) {
      console.error('Signin error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="geometric-bg absolute inset-0 opacity-40 dark:opacity-20"></div>
        <div className="absolute top-0 left-0 w-1/2 h-1/2 warm-gradient opacity-10 dark:opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 cool-gradient opacity-10 dark:opacity-5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
          <Logo />
        </div>
      </header>

      <div className="relative z-10 flex items-center justify-center px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl w-full">
          {/* Left Side - Welcome Content */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 animate-slide-in-left">
            <div>
              <h1 className="text-4xl xl:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
                Welcome to
                <span className="block text-warm text-gradient">StuFind</span>
                <span className="text-3xl xl:text-4xl text-gray-600 dark:text-gray-300">Ghana's Student Hub</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                Connect with fellow students, discover amazing opportunities, and trade safely in Ghana's premier student marketplace.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Connect & Network</h3>
                  <p className="text-gray-600 dark:text-gray-300">Meet verified students from UG, KNUST, UCC, Ashesi, and GIMPA</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Find Opportunities</h3>
                  <p className="text-gray-600 dark:text-gray-300">Discover jobs, internships, and side hustles perfect for students</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <ShoppingCart className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Buy & Sell</h3>
                  <p className="text-gray-600 dark:text-gray-300">Trade textbooks, electronics, and more with secure transactions</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Badge className="badge-warm px-4 py-2">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Student Verified
                </Badge>
                <Badge className="badge-cool px-4 py-2">
                  <Shield className="w-4 h-4 mr-2" />
                  Secure Trading
                </Badge>
                <Badge className="badge-nature px-4 py-2">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Earn Rewards
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="flex -space-x-2 mr-3">
                    <img className="w-8 h-8 rounded-full border-2 border-white shadow-sm" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" alt="Student" />
                    <img className="w-8 h-8 rounded-full border-2 border-white shadow-sm" src="https://images.unsplash.com/photo-1494790108755-2616b612b417?w=32&h=32&fit=crop&crop=face" alt="Student" />
                    <img className="w-8 h-8 rounded-full border-2 border-white shadow-sm" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" alt="Student" />
                    <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm bg-gradient-to-r from-orange-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                      2K+
                    </div>
                  </div>
                  <span>Students joined this week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="flex items-center justify-center animate-slide-in-right">
            <Card className="w-full max-w-md card-float">
              <CardHeader className="text-center pb-6">
                <div className="lg:hidden mb-4">
                  <Logo size="lg" />
                </div>
                <CardTitle className="text-2xl lg:text-3xl text-gray-900 dark:text-gray-100">Get Started</CardTitle>
                <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                  Join Ghana's largest student community
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-xl p-1 mb-6">
                    <TabsTrigger 
                      value="signin" 
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-orange-600 transition-all"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger 
                      value="signup" 
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-orange-600 transition-all"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin" className="space-y-0">
                    <form onSubmit={handleSignIn} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="Enter your student email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-modern pl-10"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="signin-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-modern pl-10 pr-10"
                            required
                            disabled={loading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="btn-premium w-full h-12 text-lg shadow-lg" 
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Signing in...
                          </div>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup" className="space-y-0">
                    <form onSubmit={handleSignUp} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name" className="text-sm font-medium text-gray-700">Full Name</Label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder="Enter your full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="input-modern pl-10"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">Student Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Use your university email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-modern pl-10"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password (min 6 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-modern pl-10 pr-10"
                            required
                            minLength={6}
                            disabled={loading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 leading-relaxed bg-gray-50 p-3 rounded-lg">
                        By creating an account, you agree to our Terms of Service and Privacy Policy. 
                        You must be a current student to join StuFind.
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="btn-premium w-full h-12 text-lg shadow-lg" 
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Creating account...
                          </div>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-4">Trusted by students from</p>
                    <div className="flex flex-wrap justify-center gap-2 text-xs">
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">UG</span>
                      <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full font-medium">KNUST</span>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">UCC</span>
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">Ashesi</span>
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">GIMPA</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
