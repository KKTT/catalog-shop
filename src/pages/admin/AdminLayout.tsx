import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Crown, Shield } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/contexts/AuthContext";

export function AdminLayout() {
  const { user } = useAuth();
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Loading...</h2>
          <p className="text-muted-foreground">Checking admin privileges</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-semibold">Admin Access Required</h2>
          </div>
          <p className="text-muted-foreground mb-6">Please log in with admin credentials to continue</p>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <a href="/auth?admin=true">
              <Shield className="h-4 w-4 mr-2" />
              Admin Login
            </a>
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-destructive" />
            <h2 className="text-2xl font-semibold">Access Denied</h2>
          </div>
          <p className="text-muted-foreground mb-6">Admin privileges required for this area</p>
          <Button asChild variant="outline">
            <a href="/auth?admin=true">
              <Crown className="h-4 w-4 mr-2" />
              Admin Login
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b bg-background px-4">
            <SidebarTrigger className="mr-4" />
            <h1 className="font-semibold">Admin Panel</h1>
          </header>
          
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}