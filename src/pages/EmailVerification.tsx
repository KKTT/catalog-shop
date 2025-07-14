import { useState, useEffect } from "react";
import { CheckCircle, Mail, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const EmailVerification = () => {
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { user, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (user?.email_confirmed_at) {
    return <Navigate to="/" replace />;
  }

  const handleResendVerification = async () => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "No email found. Please try registering again.",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });

      if (error) throw error;

      toast({
        title: "Verification email sent",
        description: "Please check your email for the verification link.",
      });
      setResendCooldown(60); // 60 second cooldown
    } catch (error: any) {
      toast({
        title: "Error sending verification email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Verify your email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center text-muted-foreground">
                <p className="mb-2">
                  We've sent a verification link to:
                </p>
                <p className="font-medium text-foreground">
                  {user?.email}
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Check your email</p>
                    <p className="text-muted-foreground">
                      Click the verification link in your email to activate your account.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Didn't receive the email?</p>
                    <p className="text-muted-foreground mb-2">
                      Check your spam folder or request a new verification email.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleResendVerification}
                  disabled={isResending || resendCooldown > 0}
                  className="w-full"
                  variant="outline"
                >
                  {isResending ? (
                    "Sending..."
                  ) : resendCooldown > 0 ? (
                    `Resend in ${resendCooldown}s`
                  ) : (
                    "Resend verification email"
                  )}
                </Button>

                <div className="text-center">
                  <Link 
                    to="/auth" 
                    className="text-sm text-primary hover:text-primary/80 underline"
                  >
                    Back to login
                  </Link>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Still having trouble?
                    </p>
                    <p className="text-blue-700 dark:text-blue-300">
                      If you continue to have issues, please{" "}
                      <Link to="/contact" className="underline hover:no-underline">
                        contact our support team
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EmailVerification;