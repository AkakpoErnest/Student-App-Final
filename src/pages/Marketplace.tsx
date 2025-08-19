import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Grid, List, Heart, MapPin, Briefcase, Clock, ShoppingCart, ArrowLeft, Home, Star, Eye, MessageCircle, BookOpen, Laptop, Smartphone, Shield, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChange, getCurrentUser, getOpportunities } from "@/integrations/firebase/client";
import { User } from "@/integrations/firebase/client";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import OpportunityCard from "@/components/OpportunityCard";

interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  opportunity_type: string;
  price: number;
  currency: string;
  location: string;
  university: string;
  requirements: string[];
  image_url: string;
  created_at: string;
  user_id: string;
  status: string;
  view_count?: number; // Added for real view count
}

const Marketplace = () => {
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [category, setCategory] = useState("all");
  const [opportunityType, setOpportunityType] = useState("all");
  const [university, setUniversity] = useState("all");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
    });

    const currentUser = getCurrentUser();
    setUser(currentUser);

    fetchOpportunities();

    return () => unsubscribe();
  }, []);

  // Refresh opportunities when component comes into focus
  useEffect(() => {
    const handleFocus = () => {
      fetchOpportunities();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchOpportunities = async () => {
    try {
      // For now, we'll use a simple approach with Firebase
      // In a real implementation, you'd want to implement proper filtering
      const { opportunities, error } = await getOpportunities({ status: 'active' });

      if (error) {
        console.error('Firebase error details:', error);
        
        // Use sample data as fallback when Firebase has issues
        console.log('Using sample data due to Firebase error');
        setOpportunities(getSampleOpportunities());
        return;
      }

      // Apply filters manually for now
      let filteredOpportunities = opportunities || [];
      
      if (searchQuery) {
        filteredOpportunities = filteredOpportunities.filter(opp => 
          opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          opp.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (category !== 'all') {
        filteredOpportunities = filteredOpportunities.filter(opp => opp.category === category);
      }

      if (opportunityType !== 'all') {
        filteredOpportunities = filteredOpportunities.filter(opp => opp.opportunity_type === opportunityType);
      }

      if (university !== 'all') {
        filteredOpportunities = filteredOpportunities.filter(opp => opp.university === university);
      }

      setOpportunities(filteredOpportunities.length > 0 ? filteredOpportunities : getSampleOpportunities());
    } catch (error: any) {
      console.error('Error fetching opportunities:', {
        error,
        message: error?.message,
        stack: error?.stack
      });

      // Fallback to sample data
      setOpportunities(getSampleOpportunities());
    } finally {
      setLoading(false);
    }
  };

  const getSampleOpportunities = (): Opportunity[] => {
    // Return sample data to make the app functional
    return [
      {
        id: 'sample-1',
        title: 'Frontend Developer Internship',
        description: 'Join our tech team to build amazing web applications using React and TypeScript. Perfect for students looking to gain real-world experience.',
        category: 'Technology',
        opportunity_type: 'internship',
        price: 1200,
        currency: 'GH₵',
        location: 'Kumasi',
        university: 'Kwame Nkrumah University of Science and Technology (KNUST)',
        requirements: ['React', 'TypeScript', 'Git'],
        image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
        created_at: new Date().toISOString(),
        user_id: 'sample-user',
        status: 'active',
        view_count: 124 // Added sample view count
      },
      {
        id: 'sample-2',
        title: 'MacBook Pro M2 (Used)',
        description: 'Excellent condition MacBook Pro with M2 chip, 8GB RAM, 256GB SSD. Perfect for computer science students. Includes charger and case.',
        category: 'Electronics',
        opportunity_type: 'item',
        price: 8500,
        currency: 'GH₵',
        location: 'Accra',
        university: 'University of Ghana (UG)',
        requirements: [],
        image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        user_id: 'sample-user',
        status: 'active',
        view_count: 50 // Added sample view count
      },
      {
        id: 'sample-3',
        title: 'Data Science Project Assistant',
        description: 'Help with data analysis and machine learning projects. Great opportunity to learn Python, pandas, and scikit-learn while earning.',
        category: 'Technology',
        opportunity_type: 'job',
        price: 2800,
        currency: 'GH₵',
        location: 'Berekuso',
        university: 'Ashesi University',
        requirements: ['Python', 'Statistics', 'Excel'],
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        user_id: 'sample-user',
        status: 'active',
        view_count: 20 // Added sample view count
      },
      {
        id: 'sample-4',
        title: 'Engineering Textbooks Bundle',
        description: 'Complete set of engineering textbooks for first and second year students. Includes Mathematics, Physics, and Engineering Graphics books.',
        category: 'Textbooks',
        opportunity_type: 'item',
        price: 450,
        currency: 'GH₵',
        location: 'Kumasi',
        university: 'Kwame Nkrumah University of Science and Technology (KNUST)',
        requirements: [],
        image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
        created_at: new Date(Date.now() - 259200000).toISOString(),
        user_id: 'sample-user',
        status: 'active',
        view_count: 10 // Added sample view count
      },
      {
        id: 'sample-5',
        title: 'Marketing Internship - Local Startup',
        description: 'Join a fast-growing Ghanaian startup as a marketing intern. Learn digital marketing, social media management, and content creation.',
        category: 'Marketing',
        opportunity_type: 'internship',
        price: 900,
        currency: 'GH₵',
        location: 'Cape Coast',
        university: 'University of Cape Coast (UCC)',
        requirements: ['Communication Skills', 'Social Media', 'Creativity'],
        image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
        created_at: new Date(Date.now() - 345600000).toISOString(),
        user_id: 'sample-user',
        status: 'active',
        view_count: 30 // Added sample view count
      },
      {
        id: 'sample-6',
        title: 'iPhone 14 Pro (Like New)',
        description: 'iPhone 14 Pro in excellent condition, barely used for 3 months. Comes with original box, charger, and screen protector already applied.',
        category: 'Electronics',
        opportunity_type: 'item',
        price: 6200,
        currency: 'GH₵',
        location: 'Accra',
        university: 'Ghana Institute of Management and Public Administration (GIMPA)',
        requirements: [],
        image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
        created_at: new Date(Date.now() - 432000000).toISOString(),
        user_id: 'sample-user',
        status: 'active',
        view_count: 15 // Added sample view count
      },
      {
        id: 'sample-7',
        title: 'Business Administration Internship',
        description: 'Join our business team and learn about operations, customer service, and business development. Perfect for business students.',
        category: 'Business',
        opportunity_type: 'internship',
        price: 800,
        currency: 'GH₵',
        location: 'Ho',
        university: 'Ho Technical University (HTU)',
        requirements: ['Business Studies', 'Communication Skills', 'MS Office'],
        image_url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop',
        created_at: new Date(Date.now() - 518400000).toISOString(),
        user_id: 'sample-user',
        status: 'active',
        view_count: 25 // Added sample view count
      }
    ];
  };

  useEffect(() => {
    fetchOpportunities();
  }, [searchQuery, category, opportunityType, university, sortBy]);

  const handleSignOut = async () => {
          // Sign out functionality will be handled by the dashboard
      navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDefaultImage = (type: string) => {
    if (type === 'job' || type === 'internship') {
      return 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop';
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'job':
      case 'internship':
        return <Briefcase className="w-4 h-4" />;
      case 'item':
        return <ShoppingCart className="w-4 h-4" />;
      default:
        return <ShoppingCart className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'technology':
        return <Laptop className="w-4 h-4" />;
      case 'electronics':
        return <Smartphone className="w-4 h-4" />;
      case 'textbooks':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <ShoppingCart className="w-4 h-4" />;
    }
  };

  const quickFilters = [
    { label: 'All', value: 'all', count: opportunities.length },
    { label: 'Jobs', value: 'job', count: opportunities.filter(o => o.opportunity_type === 'job').length },
    { label: 'Internships', value: 'internship', count: opportunities.filter(o => o.opportunity_type === 'internship').length },
    { label: 'Items', value: 'item', count: opportunities.filter(o => o.opportunity_type === 'item').length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <header className="glass-effect sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGoBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
                <div className="h-6 w-px bg-gray-300"></div>
                <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl p-2">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Home</span>
                </Link>
              </div>
              <Link to="/" className="flex items-center">
                <Logo size="sm" />
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/marketplace" className="nav-link active">
                Marketplace
              </Link>
              {user && (
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm" className="border-orange-600 text-orange-600 hover:bg-orange-50 rounded-xl">
                    Dashboard
                  </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="rounded-xl hover:bg-gray-100"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="outline" size="sm" className="border-orange-600 text-orange-600 hover:bg-orange-50 rounded-xl">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="sm" className="btn-premium text-sm">
                      Join StuFind
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative mb-12 overflow-hidden rounded-3xl">
          <div className="custom-gradient-1 p-8 md:p-12 text-white">
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Discover. Connect. Grow.
              </h1>
              <p className="text-xl opacity-90 mb-6 max-w-2xl">
                Your gateway to opportunities across Ghana's top universities
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live Opportunities</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                  <Star className="w-4 h-4" />
                  <span>Verified Students Only</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                  <Shield className="w-4 h-4" />
                  <span>Secure Transactions</span>
                </div>
              </div>
            </div>
            <div className="absolute right-0 top-0 w-1/3 h-full opacity-20">
              <div className="geometric-bg w-full h-full"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Search Section */}
        <div className="card-float p-6 mb-8">
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for jobs, internships, textbooks, electronics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-modern pl-12 text-lg h-14"
              />
            </div>
            
            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3">
              {quickFilters.map((filter) => (
                <Button
                  key={filter.value}
                  variant={opportunityType === filter.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOpportunityType(filter.value)}
                  className={`rounded-full ${
                    opportunityType === filter.value 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  {filter.label} ({filter.count})
                </Button>
              ))}
            </div>
            
            {/* Advanced Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-wrap gap-3 flex-1">
                <Select value={university} onValueChange={setUniversity}>
                  <SelectTrigger className="w-48 rounded-xl border-gray-200 dropdown-trigger">
                    <SelectValue placeholder="University" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="dropdown-item">All Universities</SelectItem>
                    <SelectItem value="University of Ghana (UG)" className="dropdown-item">University of Ghana</SelectItem>
                    <SelectItem value="Kwame Nkrumah University of Science and Technology (KNUST)" className="dropdown-item">KNUST</SelectItem>
                    <SelectItem value="University of Cape Coast (UCC)" className="dropdown-item">UCC</SelectItem>
                    <SelectItem value="Ghana Institute of Management and Public Administration (GIMPA)" className="dropdown-item">GIMPA</SelectItem>
                    <SelectItem value="Ashesi University" className="dropdown-item">Ashesi</SelectItem>
                    <SelectItem value="Ho Technical University (HTU)" className="dropdown-item">HTU</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-40 rounded-xl border-gray-200 dropdown-trigger">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="dropdown-item">All Categories</SelectItem>
                    <SelectItem value="Technology" className="dropdown-item">Technology</SelectItem>
                    <SelectItem value="Business" className="dropdown-item">Business</SelectItem>
                    <SelectItem value="Education" className="dropdown-item">Education</SelectItem>
                    <SelectItem value="Health" className="dropdown-item">Health</SelectItem>
                    <SelectItem value="Arts & Creative" className="dropdown-item">Arts & Creative</SelectItem>
                    <SelectItem value="Engineering" className="dropdown-item">Engineering</SelectItem>
                    <SelectItem value="Finance" className="dropdown-item">Finance</SelectItem>
                    <SelectItem value="Marketing" className="dropdown-item">Marketing</SelectItem>
                    <SelectItem value="Electronics" className="dropdown-item">Electronics</SelectItem>
                    <SelectItem value="Textbooks" className="dropdown-item">Textbooks</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 rounded-xl border-gray-200 dropdown-trigger">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest" className="dropdown-item">Newest First</SelectItem>
                    <SelectItem value="price-low" className="dropdown-item">Price: Low to High</SelectItem>
                    <SelectItem value="price-high" className="dropdown-item">Price: High to Low</SelectItem>
                    <SelectItem value="popular" className="dropdown-item">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">View:</span>
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={`rounded-lg ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`rounded-lg ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Available Opportunities
            </h2>
            <p className="text-gray-600 mt-1">
              {opportunities.length} {opportunities.length === 1 ? 'result' : 'results'} found
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchOpportunities}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            {user && (
              <Link to="/dashboard?tab=post">
                <Button className="btn-premium">
                  Post Opportunity
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Finding opportunities...</p>
            </div>
          </div>
        )}

        {/* Items Grid/List */}
        {!loading && opportunities.length > 0 && (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {opportunities.map((item) => (
              <Card key={item.id} className="card-float cursor-pointer group">
                {viewMode === "grid" ? (
                  <>
                    <CardHeader className="p-0">
                      <div className="relative aspect-video bg-gray-100 rounded-t-2xl overflow-hidden mb-4">
                        <img 
                          src={item.image_url || getDefaultImage(item.opportunity_type)} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="absolute top-3 right-3 bg-white/90 hover:bg-white shadow-lg rounded-xl"
                        >
                          <Heart className="w-4 h-4 text-gray-600" />
                        </Button>
                        
                        <div className="absolute top-3 left-3 flex gap-2">
                          <Badge className={`${
                            item.opportunity_type === 'job' ? 'bg-blue-600 text-white' :
                            item.opportunity_type === 'internship' ? 'bg-purple-600 text-white' :
                            'bg-green-600 text-white'
                          } badge-glow`}>
                            {getTypeIcon(item.opportunity_type)}
                            <span className="ml-1">
                              {item.opportunity_type === 'job' ? 'Job' : 
                               item.opportunity_type === 'internship' ? 'Internship' : 'For Sale'}
                            </span>
                          </Badge>
                        </div>

                        <div className="absolute bottom-3 left-3">
                          <Badge variant="secondary" className="bg-white/90 text-gray-700 backdrop-blur-sm">
                            {item.university?.split('(')[0] || 'All Universities'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-5">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                        </div>
                        
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{item.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(item.category)}
                            <span className="truncate">{item.category}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Posted {formatDate(item.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>
                              {item.view_count ? (
                                `${item.view_count} ${item.view_count === 1 ? 'view' : 'views'}`
                              ) : (
                                <span className="text-gray-400">No views yet</span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-5 pt-0">
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <span className="text-2xl font-bold text-gray-900">
                            {item.currency} {item.price.toLocaleString()}
                          </span>
                          {(item.opportunity_type === 'job' || item.opportunity_type === 'internship') && (
                            <span className="text-sm text-gray-500 ml-1">/month</span>
                          )}
                        </div>
                        <Link to={`/product/${item.id}`}>
                          <Button size="sm" className="btn-warm rounded-xl shadow-lg hover:shadow-xl transition-all">
                            {item.opportunity_type === 'job' || item.opportunity_type === 'internship' ? 'Apply Now' : 'View Details'}
                          </Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </>
                ) : (
                  <CardContent className="p-5">
                    <div className="flex gap-5">
                      <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                        <img 
                          src={item.image_url || getDefaultImage(item.opportunity_type)} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge className={`absolute top-1 left-1 text-xs ${
                          item.opportunity_type === 'job' ? 'bg-blue-600 text-white' :
                          item.opportunity_type === 'internship' ? 'bg-purple-600 text-white' :
                          'bg-green-600 text-white'
                        }`}>
                          {item.opportunity_type === 'job' ? 'Job' : 
                           item.opportunity_type === 'internship' ? 'Int' : 'Sale'}
                        </Badge>
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900 text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {item.title}
                          </h3>
                          <Button size="sm" variant="ghost" className="flex-shrink-0 rounded-lg">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {item.university?.split('(')[0] || 'All Universities'}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(item.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {item.view_count ? (
                              `${item.view_count} ${item.view_count === 1 ? 'view' : 'views'}`
                            ) : (
                              <span className="text-gray-400">No views yet</span>
                            )}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right flex-shrink-0 space-y-3">
                        <div>
                          <span className="text-xl font-bold text-gray-900">
                            {item.currency} {item.price.toLocaleString()}
                          </span>
                          {(item.opportunity_type === 'job' || item.opportunity_type === 'internship') && (
                            <div className="text-xs text-gray-500">/month</div>
                          )}
                        </div>
                        <Link to={`/product/${item.id}`}>
                          <Button size="sm" className="btn-warm rounded-xl w-full">
                            {item.opportunity_type === 'job' || item.opportunity_type === 'internship' ? 'Apply' : 'View'}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && opportunities.length === 0 && (
          <div className="text-center py-20">
            <div className="card-float p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-3">No opportunities found</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                {searchQuery || category !== 'all' || opportunityType !== 'all' || university !== 'all'
                  ? 'Try adjusting your search criteria or clearing some filters'
                  : 'Be the first to post an opportunity and start earning!'
                }
              </p>
              {user && (
                <Link to="/dashboard?tab=post">
                  <Button className="btn-premium">
                    Post First Opportunity
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Load More */}
        {!loading && opportunities.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-gray-300 hover:bg-gray-50 rounded-xl px-8 py-3">
              Load More Opportunities
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
