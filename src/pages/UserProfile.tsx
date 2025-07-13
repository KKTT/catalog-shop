import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/components/Profile';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const UserProfile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Profile />
      <Footer />
    </div>
  );
};

export default UserProfile;