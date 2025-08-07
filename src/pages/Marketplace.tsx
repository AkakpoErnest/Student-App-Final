import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Grid, List, Heart, MapPin, Briefcase, Clock, User, ShoppingCart, ArrowLeft, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import Logo from "@/components/Logo";

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
}

const Marketplace = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    fetchOpportunities();

    return () => subscription.unsubscribe();
  }, []);

  const fetchOpportunities = async () => {
    try {
      let query = supabase
        .from('opportunities')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      if (category !== 'all') {
        query = query.eq('category', category);
      }

      if (opportunityType !== 'all') {
        query = query.eq('opportunity_type', opportunityType);
      }

      if (university !== 'all') {
        query = query.eq('university', university);
      }

      const { data, error } = await query;

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [searchQuery, category, opportunityType, university, sortBy]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <Link to="/" className="flex items-center">
                <Logo size="sm" />
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/marketplace" className="text-gray-700 hover:text-blue-600 font-medium">
                Marketplace
              </Link>
              {user && (
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                  Dashboard
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {user ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm border-blue-600 text-blue-600">
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="text-xs sm:text-sm"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm border-blue-600 text-blue-600">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm">
                      Join StuFind
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Student Marketplace for Jobs & Items
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover opportunities, find what you need, and connect with students across Ghana
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8 border border-slate-200">
          <div className="flex flex-col gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search jobs, items, internships..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-slate-200 focus:border-blue-500"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <Select value={opportunityType} onValueChange={setOpportunityType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="job">Jobs</SelectItem>
                  <SelectItem value="internship">Internships</SelectItem>
                  <SelectItem value="item">Items</SelectItem>
                </SelectContent>
              </Select>

              <Select value={university} onValueChange={setUniversity}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="University" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Universities</SelectItem>
                  <SelectItem value="University of Ghana (UG)">University of Ghana</SelectItem>
                  <SelectItem value="Kwame Nkrumah University of Science and Technology (KNUST)">KNUST</SelectItem>
                  <SelectItem value="University of Cape Coast (UCC)">UCC</SelectItem>
                  <SelectItem value="Ghana Institute of Management and Public Administration (GIMPA)">GIMPA</SelectItem>
                  <SelectItem value="Ashesi University">Ashesi</SelectItem>
                </SelectContent>
              </Select>

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Arts & Creative">Arts & Creative</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Textbooks">Textbooks</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg border-slate-200">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Available Opportunities ({opportunities.length})
          </h2>
          {user && (
            <Link to="/dashboard?tab=post">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Post Opportunity
              </Button>
            </Link>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading opportunities...</p>
          </div>
        )}

        {/* Items Grid */}
        {!loading && opportunities.length > 0 && (
          <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" : "space-y-4"}>
            {opportunities.map((item) => (
              <Card key={item.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-slate-200">
                {viewMode === "grid" ? (
                  <>
                    <CardHeader className="p-0">
                      <div className="relative aspect-square bg-slate-100 rounded-t-lg overflow-hidden">
                        <img 
                          src={item.image_url || getDefaultImage(item.opportunity_type)} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Badge className="absolute top-2 left-2 bg-blue-600 text-white text-xs">
                          {item.university || 'All Universities'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                          {item.opportunity_type === 'job' ? 'Job' : item.opportunity_type === 'internship' ? 'Internship' : 'Item'}
                        </Badge>
                        {item.opportunity_type !== 'item' && (
                          <Briefcase className="w-3 h-3 text-gray-400" />
                        )}
                        {item.opportunity_type === 'item' && (
                          <ShoppingCart className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2 line-clamp-2 text-sm sm:text-base">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-500 mb-2 line-clamp-2">{item.description}</p>
                      <div className="flex items-center text-xs sm:text-sm text-slate-500 mb-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      <p className="text-xs text-slate-400">Posted {formatDate(item.created_at)}</p>
                    </CardContent>
                    <CardFooter className="p-3 sm:p-4 pt-0">
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <span className="text-lg sm:text-2xl font-bold text-green-600">
                            {item.currency} {item.price}
                            {item.opportunity_type === 'job' || item.opportunity_type === 'internship' ? '/mo' : ''}
                          </span>
                          <p className="text-xs sm:text-sm text-slate-500">
                            {item.category}
                          </p>
                        </div>
                        <Link to={`/product/${item.id}`}>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm">
                            {item.opportunity_type === 'job' || item.opportunity_type === 'internship' ? 'Apply' : 'View'}
                          </Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </>
                ) : (
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                        <img 
                          src={item.image_url || getDefaultImage(item.opportunity_type)} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-1 left-1 bg-blue-600 text-white text-xs">
                          {item.university || 'All'}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-slate-900 text-sm sm:text-base line-clamp-1">{item.title}</h4>
                          <Button size="sm" variant="ghost" className="flex-shrink-0">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                            {item.opportunity_type === 'job' ? 'Job' : item.opportunity_type === 'internship' ? 'Internship' : 'Item'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 mb-2 line-clamp-1">{item.description}</p>
                        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-slate-500 mb-2">
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {item.location}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDate(item.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-lg sm:text-2xl font-bold text-green-600">
                          {item.currency} {item.price}
                          {item.opportunity_type === 'job' || item.opportunity_type === 'internship' ? '/mo' : ''}
                        </span>
                        <div className="mt-2">
                          <Link to={`/product/${item.id}`}>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm">
                              {item.opportunity_type === 'job' || item.opportunity_type === 'internship' ? 'Apply Now' : 'View Details'}
                            </Button>
                          </Link>
                        </div>
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
          <div className="text-center py-12">
            <div className="mb-4">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No opportunities found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || category !== 'all' || opportunityType !== 'all' || university !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'Be the first to post an opportunity!'
                }
              </p>
              {user && (
                <Link to="/dashboard?tab=post">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Post First Opportunity
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Load More */}
        {!loading && opportunities.length > 0 && (
          <div className="text-center mt-8 sm:mt-12">
            <Button variant="outline" size="lg" className="border-slate-300 hover:bg-slate-50">
              Load More Opportunities
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
