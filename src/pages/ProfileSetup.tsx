import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useKoasData } from '@/hooks/useKoasData';
import { UserCircle } from 'lucide-react';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { updateProfile, completeOnboarding } = useKoasData();
  
  const [form, setForm] = useState({
    name: '',
    university: '',
    angkatan: '',
    periode: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateProfile({
      ...form,
      createdAt: new Date().toISOString(),
    });
    completeOnboarding();
    navigate('/', { replace: true });
  };

  const isValid = form.name.trim() && form.university.trim();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 p-6">
        <div className="max-w-sm mx-auto pt-8">
          <div className="text-center mb-8 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <UserCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Setup Profil</h1>
            <p className="text-muted-foreground">Lengkapi data diri kamu untuk memulai</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                placeholder="Dr. Andi Pratama"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="university">Universitas *</Label>
              <Input
                id="university"
                placeholder="Universitas Indonesia"
                value={form.university}
                onChange={(e) => setForm({ ...form, university: e.target.value })}
                className="h-12"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="angkatan">Angkatan</Label>
                <Input
                  id="angkatan"
                  placeholder="2020"
                  value={form.angkatan}
                  onChange={(e) => setForm({ ...form, angkatan: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="periode">Periode KOAS</Label>
                <Input
                  id="periode"
                  placeholder="2024-2025"
                  value={form.periode}
                  onChange={(e) => setForm({ ...form, periode: e.target.value })}
                  className="h-12"
                />
              </div>
            </div>

            <Button type="submit" disabled={!isValid} className="w-full h-12 text-base font-semibold mt-8">
              Simpan & Mulai
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
