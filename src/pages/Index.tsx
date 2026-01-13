import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKoasData } from '@/hooks/useKoasData';
import Dashboard from './Dashboard';

const Index = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useKoasData();

  useEffect(() => {
    if (isLoading) return;
    
    if (!data.settings.hasOnboarded) {
      navigate('/splash', { replace: true });
    }
  }, [isLoading, data.settings.hasOnboarded, navigate]);

  // Show loading or nothing while checking
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Memuat...</div>
      </div>
    );
  }

  // If not onboarded, don't render dashboard (will redirect)
  if (!data.settings.hasOnboarded) {
    return null;
  }

  return <Dashboard />;
};

export default Index;
