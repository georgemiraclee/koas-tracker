import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, CheckCircle, Clock, Star, Stethoscope } from 'lucide-react';

const slides = [
  {
    icon: Stethoscope,
    title: 'Selamat Datang di KOAS Tracker',
    description: 'Aplikasi personal untuk memantau progress KOAS kamu secara offline dan aman.',
    color: 'bg-primary',
  },
  {
    icon: CheckCircle,
    title: 'Checklist Per Requirement',
    description: 'Tandai setiap langkah yang sudah kamu selesaikan. Status akan update otomatis.',
    color: 'bg-status-done',
  },
  {
    icon: Clock,
    title: 'Pantau Status Otomatis',
    description: '⬜ Belum Mulai → 🟡 Sedang Berjalan → 🟢 Selesai → ⭐ Sudah Dinilai',
    color: 'bg-status-ongoing',
  },
  {
    icon: Star,
    title: 'Siap Untuk Mulai?',
    description: 'Data disimpan lokal di perangkat kamu. Tidak ada yang dikirim ke server.',
    color: 'bg-status-nilai',
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/profile-setup', { replace: true });
    }
  };

  const handleSkip = () => {
    navigate('/profile-setup', { replace: true });
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="animate-slide-up max-w-sm text-center">
          <div className={`w-24 h-24 rounded-3xl ${slide.color} mx-auto mb-8 flex items-center justify-center shadow-lg`}>
            <Icon className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold mb-4">{slide.title}</h1>
          <p className="text-muted-foreground leading-relaxed">{slide.description}</p>
        </div>
      </div>

      <div className="p-6 pb-8 space-y-4">
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>

        <Button onClick={handleNext} className="w-full h-12 text-base font-semibold gap-2">
          {currentSlide === slides.length - 1 ? 'Mulai Sekarang' : 'Lanjutkan'}
          <ChevronRight className="w-5 h-5" />
        </Button>

        {currentSlide < slides.length - 1 && (
          <Button variant="ghost" onClick={handleSkip} className="w-full text-muted-foreground">
            Lewati
          </Button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
