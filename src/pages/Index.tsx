import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Shield, Zap, Star, CheckCircle, TrendingUp, Coins, Search, MapPin, Calendar, Clock, Briefcase, GraduationCap, BookOpen, Smartphone, Laptop, MonitorSpeaker } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  const featuredItems = [
    {
      id: 1,
      title: "Frontend Developer Internship",
      price: "GH₵ 1,200",
      type: "internship",
      university: "KNUST",
      location: "Kumasi",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
      urgent: true
    },
    {
      id: 2,
      title: "MacBook Pro M2 (Used)",
      price: "GH₵ 8,500",
      type: "item",
      university: "UG",
      location: "Accra",
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Data Science Project Assistant",
      price: "GH₵ 2,800",
      type: "job",
      university: "Ashesi",
      location: "Berekuso",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      title: "Engineering Textbooks Bundle",
      price: "GH₵ 450",
      type: "item",
      university: "KNUST",
      location: "Kumasi",
      category: "Textbooks",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      title: "Marketing Internship - Startup",
      price: "GH₵ 900",
      type: "internship",
      university: "UCC",
      location: "Cape Coast",
      category: "Marketing",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
    },
    {
      id: 6,
      title: "iPhone 14 Pro (Like New)",
      price: "GH₵ 6,200",
      type: "item",
      university: "GIMPA",
      location: "Accra",
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop"
    }
  ];

  const testimonials = [
    {
      name: "Kwame Asante",
      university: "KNUST",
      role: "Computer Science Student",
      text: "Found my dream internship through StuFind! The platform made it so easy to connect with companies looking for students.",
      rating: 5
    },
    {
      name: "Ama Mensah",
      university: "University of Ghana",
      role: "Business Student",
      text: "Sold my old laptop in just 2 days. The student verification feature gives buyers confidence.",
      rating: 5
    },
    {
      name: "Kofi Osei",
      university: "Ashesi",
      role: "Engineering Student",
      text: "The job opportunities here are actually relevant to students. Much better than generic job sites.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="relative bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-purple-50/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <nav className="hidden md:flex space-x-8">
              <Link to="/marketplace" className="nav-link">
                Marketplace
              </Link>
              <Link to="/how-it-works" className="nav-link">
                How It Works
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button asChild variant="ghost" className="hidden sm:inline-flex text-gray-700 hover:text-orange-600">
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild className="btn-premium shadow-lg">
                <Link to="/auth">Join StuFind</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Asymmetric Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-br from-blue-600/5 via-blue-400/10 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-purple-600/5 via-purple-400/10 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 xl:col-span-5">
              <div className="space-y-8">
                <div>
                  <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                    <span className="block">Ghana's</span>
                    <span className="block text-gradient">Student</span>
                    <span className="block">Marketplace</span>
                  </h1>
                  <div className="mt-6 space-y-4">
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                      Connect with fellow students, discover opportunities, and trade safely on Ghana's first blockchain-powered student platform.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Badge className="badge-nature px-3 py-1">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Student Verified
                      </Badge>
                      <Badge className="badge-warm px-3 py-1">
                        <Shield className="w-4 h-4 mr-1" />
                        Secure Payments
                      </Badge>
                      <Badge className="badge-cool px-3 py-1">
                        <Coins className="w-4 h-4 mr-1" />
                        Earn Tokens
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="btn-premium text-lg px-8 py-4 rounded-xl shadow-xl">
                    <Link to="/marketplace">
                      <span className="flex items-center">
                        Explore Marketplace
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 rounded-xl border-2 border-orange-200 hover:border-orange-500 hover:text-orange-600 relative overflow-hidden group">
                    <Link to="/auth">
                      <span className="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      <span className="relative">Start Selling</span>
                    </Link>
                  </Button>
                </div>

                <div className="flex items-center space-x-8 text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="flex -space-x-2 mr-3">
                      <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" alt="User" />
                      <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1494790108755-2616b612b417?w=32&h=32&fit=crop&crop=face" alt="User" />
                      <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" alt="User" />
                    </div>
                    <span>2,847+ students joined this week</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-6 xl:col-span-7">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl transform rotate-6"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Trending Now</h3>
                    <Badge className="bg-red-100 text-red-700">Live</Badge>
                  </div>
                  <div className="space-y-4">
                    {featuredItems.slice(0, 3).map((item, index) => (
                      <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                        <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{item.title}</h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{item.university}</span>
                            <span>•</span>
                            <span className="text-green-600 font-medium">{item.price}</span>
                          </div>
                        </div>
                        {item.urgent && <Badge className="bg-orange-100 text-orange-700 text-xs">Urgent</Badge>}
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-4 text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                    View All Items →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Students Are Buying & Selling
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From tech gadgets to job opportunities, discover what's popular among Ghana's student community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className={`${
                      item.type === 'job' ? 'bg-blue-600 text-white' :
                      item.type === 'internship' ? 'bg-purple-600 text-white' :
                      'bg-green-600 text-white'
                    }`}>
                      {item.type === 'job' ? 'Job' : item.type === 'internship' ? 'Internship' : 'For Sale'}
                    </Badge>
                    {item.urgent && (
                      <Badge className="bg-orange-500 text-white animate-pulse">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-700">
                      {item.university}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{item.location}</span>
                    <span className="mx-2">•</span>
                    <span>{item.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      {item.price}
                      {(item.type === 'job' || item.type === 'internship') && <span className="text-sm font-normal text-gray-500">/month</span>}
                    </span>
                    <Button size="sm" className="btn-warm text-white shadow-lg">
                      {item.type === 'item' ? 'View' : 'Apply'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white px-8 py-3 rounded-xl shadow-lg">
              <Link to="/marketplace">
                View All 2,847+ Items
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-xl text-gray-600">
              Find exactly what you need in these trending categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'Tech Jobs', icon: Laptop, count: '234', color: 'bg-blue-500' },
              { name: 'Internships', icon: Briefcase, count: '189', color: 'bg-purple-500' },
              { name: 'Electronics', icon: Smartphone, count: '567', color: 'bg-green-500' },
              { name: 'Textbooks', icon: BookOpen, count: '423', color: 'bg-orange-500' },
              { name: 'Tutoring', icon: GraduationCap, count: '156', color: 'bg-red-500' },
              { name: 'Equipment', icon: MonitorSpeaker, count: '298', color: 'bg-indigo-500' }
            ].map((category) => (
              <Link
                key={category.name}
                to={`/marketplace?category=${category.name}`}
                className="group text-center p-6 rounded-xl border border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-16 h-16 ${category.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">{category.count} items</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Students Say
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from real students across Ghana
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                      <p className="text-sm text-orange-600">{testimonial.university}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Students Across Ghana
            </h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '12,847', label: 'Active Students', icon: Users },
              { number: '3,456', label: 'Items Sold', icon: TrendingUp },
              { number: '1,289', label: 'Jobs Posted', icon: Briefcase },
              { number: '98.5%', label: 'Success Rate', icon: Shield }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 custom-gradient-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Join Ghana's Student Economy?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Whether you're looking for opportunities or have something to sell, StuFind connects you with the right people.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-orange-50 text-lg px-8 py-4 rounded-xl shadow-xl">
              <Link to="/auth">
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 text-lg px-8 py-4 rounded-xl">
              <Link to="/marketplace">
                Explore Marketplace
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Logo className="text-white mb-6" />
              <p className="text-gray-400 max-w-md mb-6">
                Empowering Ghana's students through secure trading, meaningful opportunities, and blockchain-powered rewards.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <span className="text-white font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <span className="text-white font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <span className="text-white font-bold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-lg">Platform</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link to="/auth" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-lg">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety Tips</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">&copy; 2024 StuFind. All rights reserved.</p>
            <div className="flex space-x-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
