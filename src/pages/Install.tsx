import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, CheckCircle, Share, Plus } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if on iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
        <div className="text-center max-w-sm animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-status-done/20 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-status-done" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Sudah Terinstal!</h1>
          <p className="text-muted-foreground mb-6">
            KOAS Tracker sudah terinstal di perangkat kamu. Buka dari home screen untuk pengalaman terbaik.
          </p>
          <Button onClick={() => window.location.href = '/'} className="w-full">
            Buka Aplikasi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-6 bg-background">
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto">
        <div className="text-center animate-slide-up">
          <div className="w-20 h-20 rounded-2xl gradient-primary mx-auto mb-6 flex items-center justify-center shadow-lg">
            <Smartphone className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Install KOAS Tracker</h1>
          <p className="text-muted-foreground mb-8">
            Install aplikasi ke home screen untuk akses cepat dan pengalaman seperti aplikasi native.
          </p>

          {isIOS ? (
            <div className="text-left space-y-4 p-4 bg-card rounded-xl border border-border">
              <h2 className="font-semibold text-center mb-4">Cara Install di iPhone/iPad:</h2>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Tap tombol Share</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    Tekan ikon <Share className="w-4 h-4" /> di Safari
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Add to Home Screen</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    Pilih <Plus className="w-4 h-4" /> "Add to Home Screen"
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Konfirmasi</p>
                  <p className="text-sm text-muted-foreground">Tap "Add" untuk menginstall</p>
                </div>
              </div>
            </div>
          ) : deferredPrompt ? (
            <Button onClick={handleInstall} className="w-full h-12 gap-2 text-base font-semibold">
              <Download className="w-5 h-5" />
              Install Sekarang
            </Button>
          ) : (
            <div className="text-left space-y-4 p-4 bg-card rounded-xl border border-border">
              <h2 className="font-semibold text-center mb-4">Cara Install:</h2>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Buka Menu Browser</p>
                  <p className="text-sm text-muted-foreground">Tap ikon ⋮ atau menu di browser</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Install App / Add to Home Screen</p>
                  <p className="text-sm text-muted-foreground">Pilih opsi untuk menginstall</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-center pt-6">
        <a href="/" className="text-primary font-medium">
          ← Kembali ke Aplikasi
        </a>
      </div>
    </div>
  );
};

export default Install;
