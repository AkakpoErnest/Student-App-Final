
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Search, MessageCircle, Coins, Shield, Zap, ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';

const HowItWorks = () => {
  const steps = [
    {
      step: 1,
      title: "Sign Up & Verify",
      description: "Create your account with university email and verify your student status",
      icon: UserCheck,
      reward: "+100 StuFind Tokens",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      step: 2,
      title: "Browse & Search",
      description: "Find jobs, internships, and items from fellow students across Ghana",
      icon: Search,
      reward: "Daily +10 Tokens",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      step: 3,
      title: "Connect & Transact",
      description: "Message sellers/employers and complete secure transactions",
      icon: MessageCircle,
      reward: "Safe & Secure",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      step: 4,
      title: "Earn Tokens",
      description: "Get rewarded for activities and claim daily token bonuses",
      icon: Coins,
      reward: "Blockchain Rewards",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  const features = [
    {
      title: "Blockchain Security",
      description: "All transactions secured by Base blockchain technology",
      icon: Shield,
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Instant Connections",
      description: "Connect with verified students from your university instantly",
      icon: Zap,
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                Home
              </Link>
              <Link to="/marketplace" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                Marketplace
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Join StuFind
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-50 dark:bg-blue-950 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            How StuFind Works
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Get started in 4 simple steps and start earning <span className="font-semibold text-blue-600">StuFind Tokens</span>
          </p>
          
          <div className="flex items-center justify-center text-blue-600 dark:text-blue-400">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">Powered by Base Blockchain</span>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {steps.map((step, index) => (
              <div key={index} className={`${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                {index % 2 === 0 ? (
                  <>
                    <Card className="text-center border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <CardHeader>
                        <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4 relative">
                          <step.icon className="w-8 h-8 text-blue-600" />
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {step.step}
                          </div>
                        </div>
                        <CardTitle className="text-lg dark:text-white">{step.title}</CardTitle>
                        <CardDescription className="dark:text-gray-300">
                          {step.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700">
                          {step.reward}
                        </Badge>
                      </CardContent>
                    </Card>
                    <div className={`mt-8 lg:mt-0 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                      <img 
                        src={step.image} 
                        alt={step.title}
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`mb-8 lg:mb-0 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                      <img 
                        src={step.image} 
                        alt={step.title}
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                      />
                    </div>
                    <Card className="text-center border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <CardHeader>
                        <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4 relative">
                          <step.icon className="w-8 h-8 text-blue-600" />
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {step.step}
                          </div>
                        </div>
                        <CardTitle className="text-lg dark:text-white">{step.title}</CardTitle>
                        <CardDescription className="dark:text-gray-300">
                          {step.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700">
                          {step.reward}
                        </Badge>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose StuFind?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Built specifically for Ghana's university students with <span className="font-semibold text-blue-600">Base blockchain technology</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="overflow-hidden border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="aspect-video">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg dark:text-white">{feature.title}</CardTitle>
                  <CardDescription className="dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 dark:bg-blue-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of Ghanaian university students and start earning StuFind Tokens today
          </p>
          <div className="flex items-center justify-center mb-6 text-blue-100">
            <div className="w-2 h-2 bg-blue-300 rounded-full mr-2"></div>
            <span className="text-sm">Powered by Base Blockchain</span>
          </div>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50">
              Join StuFind & Claim Tokens
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
