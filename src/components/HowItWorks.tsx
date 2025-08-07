
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Search, MessageCircle, Coins, Shield, Zap } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      step: 1,
      title: "Sign Up & Verify",
      description: "Create your account with university email and verify your student status",
      icon: UserCheck,
      reward: "+100 StuFind Tokens"
    },
    {
      step: 2,
      title: "Browse & Search",
      description: "Find jobs, internships, and items from fellow students across Ghana",
      icon: Search,
      reward: "Daily +10 Tokens"
    },
    {
      step: 3,
      title: "Connect & Transact",
      description: "Message sellers/employers and complete secure transactions",
      icon: MessageCircle,
      reward: "Safe & Secure"
    },
    {
      step: 4,
      title: "Earn Tokens",
      description: "Get rewarded for activities and claim daily token bonuses",
      icon: Coins,
      reward: "Blockchain Rewards"
    }
  ];

  const features = [
    {
      title: "Blockchain Security",
      description: "All transactions secured by Base blockchain technology",
      icon: Shield
    },
    {
      title: "Instant Connections",
      description: "Connect with verified students from your university instantly",
      icon: Zap
    }
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How StuFind Works</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Get started in 4 simple steps and start earning <span className="font-semibold text-blue-600">StuFind Tokens</span>
          </p>
          <div className="flex items-center justify-center mt-4 text-blue-600 dark:text-blue-400">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">Powered by Base Blockchain</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <Card key={index} className="text-center relative border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
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
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
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
  );
};

export default HowItWorks;
