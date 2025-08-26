import { useState, useEffect } from "react";
import { Eye, EyeOff, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useSearchParams, useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ 
    fullName: "", 
    email: "",
    password: ""
  });
  
  const { user, loading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isAdminLogin = searchParams.get('admin') === 'true';

  useEffect(() => {
    if (user && !loading && !adminLoading) {
      if (isAdminLogin && isAdmin) {
        navigate('/admin', { replace: true });
      } else if (isAdminLogin && !isAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive"
        });
      } else if (!isAdminLogin) {
        navigate('/', { replace: true });
      }
    }
  }, [user, isAdmin, loading, adminLoading, isAdminLogin, navigate]);

  if (loading || adminLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (user && !isAdminLogin) {
    return <Navigate to="/" replace />;
  }

  if (user && isAdminLogin && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        if (error.message.includes('For security purposes')) {
          alert('Please wait a moment before trying again. Login requests are rate-limited for security.');
          return;
        }
        throw error;
      }

      // Clear form data
      setLoginData({ email: "", password: "" });
      
      toast({
        title: "Login successful!",
        description: isAdminLogin ? "Redirecting to admin panel..." : "Welcome back!",
      });
    } catch (error: any) {
      console.error('Login error:', error.message);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: registerData.fullName,
          }
        }
      });
      
      if (error) {
        // Handle rate limiting error specifically
        if (error.message.includes('For security purposes')) {
          alert('Please wait a moment before trying again. Registration requests are rate-limited for security.');
          return;
        }
        throw error;
      }
      
      // Clear form
      setRegisterData({ fullName: "", email: "", password: "" });
      
      toast({
        title: "Registration successful!",
        description: "Please check your email for confirmation.",
      });
    } catch (error: any) {
      console.error('Registration error:', error.message);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {isAdminLogin && (
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Admin Access</h1>
              </div>
              <Badge variant="outline" className="mb-4">
                <Shield className="h-3 w-3 mr-1" />
                Administrative Login Required
              </Badge>
              <p className="text-sm text-muted-foreground">
                This area requires administrator privileges
              </p>
            </div>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {isAdminLogin ? (
                      <>
                        <Crown className="h-5 w-5" />
                        Admin Login
                      </>
                    ) : (
                      "Welcome Back"
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="relative">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-6 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
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
                  <CardTitle className="flex items-center gap-2">
                    {isAdminLogin ? (
                      <>
                        <Crown className="h-5 w-5" />
                        Admin Registration
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </CardTitle>
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
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="relative">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        value={registerData.password}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-6 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
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