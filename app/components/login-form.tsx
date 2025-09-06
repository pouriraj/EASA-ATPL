
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Lock, User, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { ATPLCredentials } from '@/lib/types';
import { toast } from 'sonner';

interface LoginFormProps {
  onLogin: (credentials: ATPLCredentials) => void;
  isAuthenticated: boolean;
  credentials: ATPLCredentials | null;
}

export function LoginForm({ onLogin, isAuthenticated, credentials }: LoginFormProps) {
  const [formData, setFormData] = useState<ATPLCredentials>({
    username: credentials?.username || '',
    password: credentials?.password || ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setValidationError('Please enter both username and password');
      return;
    }

    if (!formData.username.includes('@') && !formData.username.match(/^[a-zA-Z0-9._-]+$/)) {
      setValidationError('Please enter a valid username or email address');
      return;
    }

    setIsLoading(true);
    setValidationError('');

    try {
      // Simulate credential validation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, you would validate credentials with the ATPL system here
      onLogin(formData);
      
    } catch (error) {
      setValidationError('Authentication failed. Please check your credentials.');
      toast.error('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated && credentials) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <CheckCircle className="h-5 w-5 mr-2" />
              Authentication Successful
            </CardTitle>
            <CardDescription className="text-green-600">
              You are now connected to ATPL Questions system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">
                  <strong>Username:</strong> {credentials.username}
                </p>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Connected to EASA 2020 Database
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                Change Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            ATPL Questions Login
          </CardTitle>
          <CardDescription>
            Enter your atplquestions.com credentials to access the extraction system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your credentials are used only to authenticate with atplquestions.com and are not stored permanently. 
              You need an active subscription to extract questions.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username or Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username or email"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10 pr-10"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {validationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Login to ATPL Questions
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Security Information</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Your credentials are encrypted and used only for API authentication</li>
              <li>• No credentials are permanently stored on our servers</li>
              <li>• All communication with atplquestions.com is secured via HTTPS</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
