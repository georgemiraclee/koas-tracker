import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKoasData } from '@/hooks/useKoasData';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Moon, Download, Upload, Trash2, Info } from 'lucide-react';
import { useEffect } from 'react';

const Settings = () => {
  const navigate = useNavigate();
  const { data, updateProfile, toggleDarkMode, exportData, importData, resetData } = useKoasData();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: data.profile?.name || '',
    university: data.profile?.university || '',
    angkatan: data.profile?.angkatan || '',
    periode: data.profile?.periode || '',
  });

  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', data.settings.darkMode);
  }, [data.settings.darkMode]);

  const handleSaveProfile = () => {
    updateProfile({
      ...profileForm,
      createdAt: data.profile?.createdAt || new Date().toISOString(),
    });
    setIsEditOpen(false);
  };

  const handleExport = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `koas-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importData(content);
      if (success) {
        alert('Data berhasil diimport!');
      } else {
        alert('Gagal import data. Pastikan format file benar.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    resetData();
    navigate('/onboarding', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-6 py-4 max-w-lg mx-auto">
          <h1 className="text-xl font-bold">Pengaturan</h1>
        </div>
      </header>

      <div className="px-6 py-4">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Profile Section */}
          <section className="animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-primary" />
              <h2 className="font-semibold">Profil</h2>
            </div>

            <div className="p-4 bg-card rounded-xl border border-border">
              <div className="mb-4">
                <p className="font-semibold text-lg">{data.profile?.name || 'Belum diatur'}</p>
                <p className="text-sm text-muted-foreground">{data.profile?.university || '-'}</p>
                <div className="flex gap-3 text-sm text-muted-foreground mt-1">
                  {data.profile?.angkatan && <span>Angkatan {data.profile.angkatan}</span>}
                  {data.profile?.periode && <span>• Periode {data.profile.periode}</span>}
                </div>
              </div>

              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">Edit Profil</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profil</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Nama Lengkap</Label>
                      <Input
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Universitas</Label>
                      <Input
                        value={profileForm.university}
                        onChange={(e) => setProfileForm({ ...profileForm, university: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Angkatan</Label>
                        <Input
                          value={profileForm.angkatan}
                          onChange={(e) => setProfileForm({ ...profileForm, angkatan: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Periode</Label>
                        <Input
                          value={profileForm.periode}
                          onChange={(e) => setProfileForm({ ...profileForm, periode: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button onClick={handleSaveProfile} className="w-full">Simpan</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </section>

          <Separator />

          {/* Appearance */}
          <section className="animate-fade-in" style={{ animationDelay: '50ms' }}>
            <div className="flex items-center gap-2 mb-3">
              <Moon className="w-4 h-4 text-primary" />
              <h2 className="font-semibold">Tampilan</h2>
            </div>

            <div className="p-4 bg-card rounded-xl border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mode Gelap</p>
                  <p className="text-sm text-muted-foreground">Nyaman untuk digunakan di malam hari</p>
                </div>
                <Switch
                  checked={data.settings.darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* Data Management */}
          <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-2 mb-3">
              <Download className="w-4 h-4 text-primary" />
              <h2 className="font-semibold">Kelola Data</h2>
            </div>

            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3" onClick={handleExport}>
                <Download className="w-4 h-4" />
                Export Data (JSON)
              </Button>

              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Upload className="w-4 h-4" />
                  Import Data (JSON)
                </Button>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full justify-start gap-3">
                    <Trash2 className="w-4 h-4" />
                    Reset Semua Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset Semua Data?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Semua data termasuk profil, requirement, dan progress akan dihapus. Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </section>

          <Separator />

          {/* About */}
          <section className="animate-fade-in" style={{ animationDelay: '150ms' }}>
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-primary" />
              <h2 className="font-semibold">Tentang</h2>
            </div>

            <div className="p-4 bg-card rounded-xl border border-border">
              <h3 className="font-semibold mb-2">KOAS Tracker</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Personal progress tracker untuk dokter KOAS. Semua data disimpan secara lokal di perangkat kamu.
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Status:</strong></p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded bg-status-not-started-light text-status-not-started">⬜ Belum Mulai</span>
                  <span className="px-2 py-1 rounded bg-status-ongoing-light text-status-ongoing">🟡 Sedang Berjalan</span>
                  <span className="px-2 py-1 rounded bg-status-done-light text-status-done">🟢 Selesai</span>
                  <span className="px-2 py-1 rounded bg-status-nilai-light text-status-nilai">⭐ Sudah Dinilai</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Settings;
