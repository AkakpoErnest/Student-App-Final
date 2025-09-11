// API Test Page for Debugging
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { testClaudeAPI } from '@/integrations/ai/claude';

const APITest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');

  const handleTestAPI = async () => {
    setIsLoading(true);
    setTestResult('Testing...');
    
    try {
      const result = await testClaudeAPI();
      setTestResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setTestResult(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAPIKey = () => {
    const envKey = import.meta.env.VITE_CLAUDE_API_KEY;
    setApiKey(envKey || 'Not found');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Claude API Test
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>API Key Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={checkAPIKey} variant="outline">
                Check API Key
              </Button>
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                <code className="text-sm break-all">
                  {apiKey || 'Click "Check API Key" to see status'}
                </code>
              </div>
              <Badge variant={apiKey.startsWith('sk-ant-') ? 'default' : 'destructive'}>
                {apiKey.startsWith('sk-ant-') ? 'Valid Format' : 'Invalid/Not Found'}
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>API Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleTestAPI} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Testing...' : 'Test Claude API'}
              </Button>
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded max-h-64 overflow-auto">
                <pre className="text-sm whitespace-pre-wrap">
                  {testResult || 'Click "Test Claude API" to see results'}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>VITE_CLAUDE_API_KEY:</span>
                <Badge variant={import.meta.env.VITE_CLAUDE_API_KEY ? 'default' : 'destructive'}>
                  {import.meta.env.VITE_CLAUDE_API_KEY ? 'Set' : 'Not Set'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>NODE_ENV:</span>
                <Badge>{import.meta.env.NODE_ENV}</Badge>
              </div>
              <div className="flex justify-between">
                <span>MODE:</span>
                <Badge>{import.meta.env.MODE}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Debug Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Check if API key is loaded correctly</li>
              <li>Test the API connection</li>
              <li>Check browser console for errors</li>
              <li>Verify the .env file is in the project root</li>
              <li>Restart the development server after .env changes</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default APITest;
