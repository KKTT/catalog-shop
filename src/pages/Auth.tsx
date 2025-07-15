import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ fullName: "", phoneNumber: "" });
  const [registerData, setRegisterData] = useState({ 
    fullName: "", 
    phoneNumber: "", 
    email: ""
  });
  
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // For now, we'll use phone number as login identifier
      // In a real app, you'd implement phone-based authentication
      alert('Phone-based login not implemented yet. Please use email registration first.');
    } catch (error: any) {
      console.error('Login error:', error.message);
      alert('Login failed: ' + error.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Generate a temporary password for email-based registration
      const tempPassword = Math.random().toString(36).slice(-8) + "A1!";
      
      const { error } = await supabase.auth.signUp({
        email: registerData.email,
        password: tempPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: registerData.fullName,
            phone_number: registerData.phoneNumber,
          }
        }
      });
      
      if (error) throw error;
      
      // Clear form and redirect to verification page
      setRegisterData({ fullName: "", phoneNumber: "", email: "" });
      window.location.href = '/verify-email';
    } catch (error: any) {
      console.error('Registration error:', error.message);
      alert('Registration failed: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="login-fullname">Full Name</Label>
                      <Input
                        id="login-fullname"
                        type="text"
                        value={loginData.fullName}
                        onChange={(e) => setLoginData(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="login-phone">Phone Number</Label>
                      <Input
                        id="login-phone"
                        type="tel"
                        value={loginData.phoneNumber}
                        onChange={(e) => setLoginData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-brand-gold text-brand-dark hover:bg-brand-gold/90">
                      Login
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label htmlFor="register-name">Full Name</Label>
                      <Input
                        id="register-name"
                        value={registerData.fullName}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-phone">Phone Number</Label>
                      <Input
                        id="register-phone"
                        type="tel"
                        value={registerData.phoneNumber}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-brand-gold text-brand-dark hover:bg-brand-gold/90">
                      Register
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Auth;