import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Shield, Zap, Star, CheckCircle, TrendingUp, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-black dark:via-blue-950 dark:to-black">
      {/* Header */}
      <header className="relative bg-white/90 dark:bg-black/90 backdrop-blur-lg border-b border-gray-200 dark:border-blue-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <nav className="hidden md:flex space-x-8">
              <Link to="/marketplace" className="text-gray-700 dark:text-blue-100 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                Marketplace
              </Link>
              <Link to="/how-it-works" className="text-gray-700 dark:text-blue-100 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                How It Works
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                <span className="block dark:text-white">Connect.</span>
                <span className="block">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:text-white">
                    Earn.
                  </span>
                </span>
                <span className="block dark:text-white">Grow.</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed max-w-2xl">
                The ultimate platform for students to discover opportunities, earn tokens, and build their future through meaningful connections.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-3 shadow-lg">
                  <Link to="/auth">
                    Start Your Journey
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 border-2 hover:bg-gray-50">
                  <Link to="/marketplace">
                    Explore Marketplace
                  </Link>
                </Button>
              </div>
              <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Free to join
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Earn rewards
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Build network
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&crop=faces"
                alt="Students collaborating"
                className="relative rounded-3xl shadow-2xl w-full h-[300px] sm:h-[400px] object-cover ring-1 ring-white/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose StuFind */}
      <section className="py-16 sm:py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">Why choose StuFind?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative p-8 bg-white/80 dark:bg-blue-950/80 rounded-2xl shadow-lg border border-gray-100 dark:border-blue-900">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-400 dark:from-blue-700 dark:to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
                <p className="text-gray-600 dark:text-white leading-relaxed">
                  Meet and collaborate with students from your university and beyond.
                </p>
              </div>
            </div>
            <div className="group relative p-8 bg-white/80 dark:bg-blue-950/80 rounded-2xl shadow-lg border border-gray-100 dark:border-blue-900">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 dark:from-blue-900 dark:to-blue-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Coins className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Earn</h3>
                <p className="text-gray-600 dark:text-white leading-relaxed">
                  Get rewarded for your participation, engagement, and successful transactions on the platform.
                </p>
              </div>
            </div>
            <div className="group relative p-8 bg-white/80 dark:bg-blue-950/80 rounded-2xl shadow-lg border border-gray-100 dark:border-blue-900">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-700 dark:to-blue-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Grow</h3>
                <p className="text-gray-600 dark:text-white leading-relaxed">
                  Build your reputation, skills, and network for future success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-black dark:to-blue-950"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 dark:from-blue-900/40 dark:to-blue-700/40 rounded-3xl blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=400&fit=crop&crop=center"
                alt="Blockchain technology concept"
                className="relative rounded-3xl shadow-2xl w-full h-[300px] sm:h-[400px] object-cover ring-1 ring-white/20"
              />
            </div>
            
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Simple, Secure, Smart
              </h2>
              <p className="text-xl text-gray-600 dark:text-white mb-8 leading-relaxed">
                Our platform combines blockchain technology with intuitive design to create a seamless experience for students.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Sign Up & Verify</h3>
                    <p className="text-gray-600 dark:text-white">Create your account and verify your student status with your university credentials.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Explore & Connect</h3>
                    <p className="text-gray-600 dark:text-white">Browse opportunities, connect with peers, and discover new possibilities.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Earn & Grow</h3>
                    <p className="text-gray-600 dark:text-white">Complete transactions, earn tokens, and build your reputation in the community.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-20 bg-white/50 dark:bg-black/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 dark:from-blue-900/40 dark:via-blue-800/40 dark:to-blue-900/40 rounded-3xl blur-3xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=300&fit=crop&crop=center"
              alt="Technology and innovation concept"
              className="relative rounded-3xl shadow-2xl w-full h-[200px] sm:h-[300px] object-cover ring-1 ring-white/20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 dark:from-blue-900/60 dark:to-blue-700/60 rounded-3xl flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 dark:text-white">Join the Future of Student Networking</h2>
                <p className="text-xl opacity-90 max-w-2xl mx-auto">
                  Be part of a revolutionary platform that's changing how students connect and grow
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">10K+</div>
              <div className="text-gray-600 dark:text-white">Active Students</div>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">5K+</div>
              <div className="text-gray-600 dark:text-white">Opportunities</div>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">98%</div>
              <div className="text-gray-600 dark:text-white">Satisfaction</div>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">100%</div>
              <div className="text-gray-600 dark:text-white">Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 dark:from-blue-900 dark:via-blue-950 dark:to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-20 dark:bg-black dark:opacity-40"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already building their future with StuFind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3">
              <Link to="/auth">
                Create Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3">
              <Link to="/marketplace">
                Browse Opportunities
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 dark:from-black dark:via-blue-900 dark:to-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Logo className="text-white mb-4" />
              <p className="text-gray-400 max-w-md">
                Empowering students to connect, earn, and grow through meaningful opportunities and blockchain technology.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link to="/auth" className="hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 StuFind. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
