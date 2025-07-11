"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AdminLogin() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Basic validation
    const newErrors: {[key: string]: string} = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.user.full_name}!`,
        });
        router.push('/admin');
      } else {
        setErrors({ submit: data.error || 'Login failed' });
        toast({
          title: "Login Failed",
          description: data.error || 'Invalid credentials',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: 'Network error. Please try again.' });
      toast({
        title: "Connection Error",
        description: "Unable to connect to server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div>
            <Shield />
          </div>
          <div>
            <CardTitle>
              Admin Portal
            </CardTitle>
            <p>
              Sign in to access the admin dashboard
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@paintingapp.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
               
                disabled={isLoading}
              />
              {errors.email && (
                <p>
                  <AlertCircle />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password">Password</Label>
              <div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                 
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                 
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff />
                  ) : (
                    <Eye />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p>
                  <AlertCircle />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div>
                <p>
                  <AlertCircle />
                  {errors.submit}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div>
            <p>Demo Credentials:</p>
            <p>Email: admin@paintingapp.com</p>
            <p>Password: admin123</p>
          </div>

          {/* Security Notice */}
          <div>
            <p>
              This is a secure admin portal. All activity is logged and monitored.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}