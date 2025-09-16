import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { claudeAPI, testClaudeAPI } from '@/integrations/ai/claude';

const APITest: React.FC = () => {
  const [testMessage, setTestMessage] = useState('Hello, this is a test message');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<string>('');

  const runTest = async () => {
    setIsLoading(true);
    setResult('');
    
    try {
      // Check API key
      const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
      setApiKeyStatus(apiKey ? `Loaded: ${apiKey.substring(0, 20)}...` : 'Not loaded');
      
      // Test API
      const response = await claudeAPI.getQuickResponse(testMessage);
      setResult(response);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const runGlobalTest = async () => {
    setIsLoading(true);
    setResult('');
    
    try {
      const response = await testClaudeAPI();
      setResult(typeof response === 'string' ? response : JSON.stringify(response));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Claude API Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Environment Info */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Environment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Badge variant="outline">API Key Status</Badge>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {apiKeyStatus || 'Not checked yet'}
                  </p>
                </div>
                <div>
                  <Badge variant="outline">Environment</Badge>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {import.meta.env.MODE}
                  </p>
                </div>
              </div>
            </div>

            {/* Test Input */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Test Message</h3>
              <div className="flex gap-2">
                <Input
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Enter test message..."
                  className="flex-1"
                />
                <Button onClick={runTest} disabled={isLoading}>
                  {isLoading ? 'Testing...' : 'Test API'}
                </Button>
              </div>
            </div>

            {/* Global Test */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Global Test Function</h3>
              <Button onClick={runGlobalTest} disabled={isLoading} variant="outline">
                {isLoading ? 'Testing...' : 'Run Global Test'}
              </Button>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Result</h3>
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                </div>
              </div>
            )}

            {/* Environment Variables Debug */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">All Environment Variables</h3>
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(import.meta.env, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default APITest;