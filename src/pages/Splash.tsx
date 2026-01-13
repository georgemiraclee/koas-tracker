import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKoasData } from '@/hooks/useKoasData';
import { Stethoscope } from 'lucide-react';

const Splash = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useKoasData();

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (!data.settings.hasOnboarded) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isLoading, data.settings.hasOnboarded, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-hero">
      <div className="animate-slide-up flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse-ring">
          <Stethoscope className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">KOAS Tracker</h1>
        <p className="text-white/80">Personal Progress Tracker</p>
        <p className="text-white/80">© 2026 GMTECH</p>
      </div>
      
      <div className="absolute bottom-12 flex flex-col items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="text-white/60 text-sm">Memuat data...</p>
      </div>
    </div>
  );
};

export default Splash;
