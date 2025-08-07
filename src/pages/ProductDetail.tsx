
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Heart, Share2, MessageCircle, MapPin, Calendar, Shield, Star, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const ProductDetail = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const product = {
    id: 1,
    title: "MacBook Air M1 - 13 inch, 256GB SSD, 8GB RAM - Perfect for Ghana University Students",
    price: 2800,
    originalPrice: 3200,
    images: [
      "/placeholder.svg",
      "/placeholder.svg", 
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    category: "Electronics",
    condition: "Excellent",
    description: "Selling my MacBook Air M1 as I'm upgrading to a new model. This laptop has been amazing for programming, design work, and everyday university tasks. Battery life is still excellent (8+ hours), no scratches or dents. Comes with original charger and box. Perfect for any Ghanaian university student - works great for research, coding, and presentations!",
    specifications: [
      "13-inch Retina display",
      "Apple M1 chip with 8-core CPU",
      "8GB unified memory",
      "256GB SSD storage", 
      "Up to 18 hours battery life",
      "macOS Monterey",
      "Includes original Ghanaian warranty papers"
    ],
    seller: {
      name: "Kwame Asante",
      avatar: "/placeholder.svg",
      rating: 4.9,
      reviews: 23,
      verified: true,
      university: "KNUST",
      program: "Computer Engineering",
      joinedDate: "March 2023",
      responseTime: "Usually responds within 1 hour",
      completedSales: 15
    },
    location: "KNUST Campus, Computer Science Building",
    university: "KNUST",
    postedDate: "2 days ago",
    views: 47,
    interested: 8,
    meetupOptions: [
      "KNUST Library",
      "KNUST Student Center", 
      "Engineering Building Lobby"
    ]
  };

  const relatedItems = [
    {
      id: 2,
      title: "iPad Pro 11-inch - Great for Note Taking",
      price: 1200,
      image: "/placeholder.svg",
      condition: "Like New",
      university: "UG"
    },
    {
      id: 3,
      title: "MacBook Pro 13-inch - CS Student Owned",
      price: 3500,
      image: "/placeholder.svg", 
      condition: "Excellent",
      university: "UCC"
    },
    {
      id: 4,
      title: "Magic Mouse 2 - Barely Used",
      price: 120,
      image: "/placeholder.svg",
      condition: "Good",
      university: "GIMPA"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/marketplace" className="mr-2 sm:mr-4">
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                  <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Back to Marketplace</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
              <Link to="/">
                <Logo size="sm" />
              </Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                Sign In
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm">
                Sell Item
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Product Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden mb-4 relative">
                  <img 
                    src={product.images[currentImage]} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-green-600 text-white">
                    {product.university}
                  </Badge>
                  {product.originalPrice && (
                    <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                      Save GH₵{product.originalPrice - product.price}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                        currentImage === index ? 'border-green-500' : 'border-gray-200'
                      }`}
                    >
                      <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Product Info */}
            <Card className="mb-6">
              <CardContent className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="secondary">
                        {product.category}
                      </Badge>
                      <Badge variant="outline" className="text-green-600">
                        {product.university}
                      </Badge>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Posted {product.postedDate}
                      </span>
                      <span>{product.views} views</span>
                      <span>{product.interested} interested</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsFavorited(!isFavorited)}
                    >
                      <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-3xl sm:text-4xl font-bold text-green-600">GH₵{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">GH₵{product.originalPrice}</span>
                    )}
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    Condition: {product.condition}
                  </Badge>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Specifications</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {product.specifications.map((spec, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{product.location}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Preferred meetup locations:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {product.meetupOptions.map((location, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Info */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold mb-4">Seller Information</h3>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={product.seller.avatar} />
                    <AvatarFallback>{product.seller.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{product.seller.name}</h4>
                      {product.seller.verified && (
                        <Shield className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{product.seller.rating}</span>
                      <span>({product.seller.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p><strong>University:</strong> {product.seller.university}</p>
                  <p><strong>Program:</strong> {product.seller.program}</p>
                  <p>Joined {product.seller.joinedDate}</p>
                  <p>{product.seller.completedSales} completed sales</p>
                  <p className="text-green-600">{product.seller.responseTime}</p>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message Seller
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact via WhatsApp
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Campus Safety Tips
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Meet in public campus locations</li>
                  <li>• Bring a friend for high-value items</li>
                  <li>• Verify seller's student status</li>
                  <li>• Use Mobile Money for secure payments</li>
                  <li>• Report suspicious activity to campus security</li>
                  <li>• Check item thoroughly before paying</li>
                </ul>
              </CardContent>
            </Card>

            {/* Related Items */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold mb-4">Similar Items from Other Universities</h3>
                <div className="space-y-4">
                  {relatedItems.map((item) => (
                    <Link key={item.id} to={`/product/${item.id}`}>
                      <div className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden relative">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          <Badge className="absolute top-1 left-1 bg-green-600 text-white text-xs">
                            {item.university}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                          <p className="text-xs text-gray-500">{item.condition}</p>
                          <p className="font-semibold text-green-600">GH₵{item.price}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
