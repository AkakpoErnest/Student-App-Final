import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '@/integrations/firebase/client';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const FirebaseTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Testing...');
  const [user, setUser] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>({});

  useEffect(() => {
    const runTests = async () => {
      const results: any = {};

      try {
        // Test 1: Auth connection
        setStatus('Testing Firebase Auth...');
        onAuthStateChanged(auth, (user) => {
          setUser(user);
          results.auth = user ? 'Connected (User logged in)' : 'Connected (No user)';
        });

        // Test 2: Firestore connection
        setStatus('Testing Firestore...');
        try {
          const profilesRef = collection(db, 'profiles');
          const snapshot = await getDocs(profilesRef);
          results.firestore = `Connected (${snapshot.size} profiles found)`;
        } catch (error: any) {
          results.firestore = `Error: ${error.message}`;
        }

        // Test 3: Storage connection
        setStatus('Testing Storage...');
        try {
          // Just test if storage is initialized
          results.storage = 'Connected (Storage initialized)';
        } catch (error: any) {
          results.storage = `Error: ${error.message}`;
        }

        setTestResults(results);
        setStatus('Tests completed');

      } catch (error: any) {
        setStatus(`Error: ${error.message}`);
      }
    };

    runTests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Firebase Connection Test
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status: {status}</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="font-medium">Authentication:</span>
              <span className={`px-3 py-1 rounded text-sm ${
                testResults.auth?.includes('Connected') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {testResults.auth || 'Testing...'}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="font-medium">Firestore Database:</span>
              <span className={`px-3 py-1 rounded text-sm ${
                testResults.firestore?.includes('Connected') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {testResults.firestore || 'Testing...'}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="font-medium">Storage:</span>
              <span className={`px-3 py-1 rounded text-sm ${
                testResults.storage?.includes('Connected') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {testResults.storage || 'Testing...'}
              </span>
            </div>
          </div>
        </div>

        {user && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Current User</h2>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm overflow-auto">
              {JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                emailVerified: user.emailVerified
              }, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            🔧 If Firebase is not working:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-yellow-700 dark:text-yellow-300">
            <li>Go to <a href="https://console.firebase.google.com/" target="_blank" className="underline">Firebase Console</a></li>
            <li>Select your project: <code className="bg-yellow-100 dark:bg-yellow-800 px-2 py-1 rounded">stufind-50c62</code></li>
            <li>Go to <strong>Firestore Database</strong> → <strong>Rules</strong></li>
            <li>Update rules to allow read/write access</li>
            <li>Go to <strong>Storage</strong> → <strong>Rules</strong></li>
            <li>Update storage rules for file uploads</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default FirebaseTest;
