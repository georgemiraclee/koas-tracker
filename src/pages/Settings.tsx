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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Moon, Download, Upload, Trash2, Info, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react';
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

  const handleExportJSON = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `koas-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const convertToCSV = () => {
    const rows = [];
    
    // Header
    rows.push(['Departemen', 'Requirement', 'Status', 'Checklist Selesai', 'Total Checklist', 'Persentase', 'Catatan', 'Tanggal Mulai', 'Tanggal Selesai']);
    
    // Data
    data.departments.forEach(dept => {
      dept.requirements.forEach(req => {
        const completedChecklist = req.checklist.filter(c => c.done).length;
        const totalChecklist = req.checklist.length;
        const percentage = totalChecklist > 0 ? Math.round((completedChecklist / totalChecklist) * 100) : 0;
        
        let status = 'Belum Mulai';
        if (req.nilai) status = 'Sudah Dinilai';
        else if (req.completedDate) status = 'Selesai';
        else if (req.startDate) status = 'Sedang Berjalan';
        
        rows.push([
          dept.name,
          req.name,
          status,
          completedChecklist,
          totalChecklist,
          `${percentage}%`,
          req.notes || '-',
          req.startDate ? new Date(req.startDate).toLocaleDateString('id-ID') : '-',
          req.completedDate ? new Date(req.completedDate).toLocaleDateString('id-ID') : '-'
        ]);
      });
    });
    
    return rows.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  };

  const handleExportCSV = () => {
    const csv = convertToCSV();
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `koas-tracker-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    // Create HTML table for Excel
    let html = '<html><head><meta charset="utf-8"></head><body><table border="1">';
    
    // Header
    html += '<tr style="background-color: #4F46E5; color: white; font-weight: bold;">';
    html += '<th>Departemen</th><th>Requirement</th><th>Status</th><th>Checklist Selesai</th><th>Total Checklist</th><th>Persentase</th><th>Catatan</th><th>Tanggal Mulai</th><th>Tanggal Selesai</th>';
    html += '</tr>';
    
    // Data
    data.departments.forEach(dept => {
      dept.requirements.forEach(req => {
        const completedChecklist = req.checklist.filter(c => c.done).length;
        const totalChecklist = req.checklist.length;
        const percentage = totalChecklist > 0 ? Math.round((completedChecklist / totalChecklist) * 100) : 0;
        
        let status = 'Belum Mulai';
        let statusColor = '#94a3b8';
        if (req.nilai) {
          status = 'Sudah Dinilai';
          statusColor = '#f59e0b';
        } else if (req.completedDate) {
          status = 'Selesai';
          statusColor = '#10b981';
        } else if (req.startDate) {
          status = 'Sedang Berjalan';
          statusColor = '#eab308';
        }
        
        html += '<tr>';
        html += `<td>${dept.name}</td>`;
        html += `<td>${req.name}</td>`;
        html += `<td style="color: ${statusColor}; font-weight: bold;">${status}</td>`;
        html += `<td style="text-align: center;">${completedChecklist}</td>`;
        html += `<td style="text-align: center;">${totalChecklist}</td>`;
        html += `<td style="text-align: center;">${percentage}%</td>`;
        html += `<td>${req.notes || '-'}</td>`;
        html += `<td>${req.startDate ? new Date(req.startDate).toLocaleDateString('id-ID') : '-'}</td>`;
        html += `<td>${req.completedDate ? new Date(req.completedDate).toLocaleDateString('id-ID') : '-'}</td>`;
        html += '</tr>';
      });
    });
    
    html += '</table></body></html>';
    
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `koas-tracker-${new Date().toISOString().split('T')[0]}.xls`;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="px-6 py-5 max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-slate-800">Pengaturan</h1>
          <p className="text-sm text-slate-500 mt-0.5">Kelola profil dan data Anda</p>
        </div>
      </header>

      <div className="px-6 py-6">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Profile Section */}
          <section className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-xl">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="font-bold text-slate-800">Profil</h2>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="mb-4">
                <p className="font-bold text-lg text-slate-800">{data.profile?.name || 'Belum diatur'}</p>
                <p className="text-sm text-slate-600 mt-1">{data.profile?.university || '-'}</p>
                <div className="flex gap-3 text-sm text-slate-500 mt-2">
                  {data.profile?.angkatan && <span className="px-2 py-1 bg-slate-100 rounded-lg">Angkatan {data.profile.angkatan}</span>}
                  {data.profile?.periode && <span className="px-2 py-1 bg-slate-100 rounded-lg">Periode {data.profile.periode}</span>}
                </div>
              </div>

              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">Edit Profil</Button>
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

          <Separator className="bg-slate-200" />

          {/* Appearance */}
          <section className="animate-fade-in" style={{ animationDelay: '50ms' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-xl">
                <Moon className="w-4 h-4 text-indigo-600" />
              </div>
              <h2 className="font-bold text-slate-800">Tampilan</h2>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">Mode Gelap</p>
                  <p className="text-sm text-slate-500 mt-0.5">Nyaman untuk digunakan di malam hari</p>
                </div>
                <Switch
                  checked={data.settings.darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
            </div>
          </section>

          <Separator className="bg-slate-200" />

          {/* Data Management */}
          <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-xl">
                <Download className="w-4 h-4 text-green-600" />
              </div>
              <h2 className="font-bold text-slate-800">Kelola Data</h2>
            </div>

            <div className="space-y-3">
              {/* Export Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-white hover:bg-slate-50 border-slate-200">
                    <div className="flex items-center gap-3">
                      <Download className="w-4 h-4" />
                      <span>Export Data</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[calc(100vw-3rem)] max-w-md">
                  <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer">
                    <FileText className="w-4 h-4 mr-3 text-green-600" />
                    <div>
                      <p className="font-medium">Export sebagai CSV</p>
                      <p className="text-xs text-slate-500">Format tabel untuk Excel/Sheets</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportExcel} className="cursor-pointer">
                    <FileSpreadsheet className="w-4 h-4 mr-3 text-green-600" />
                    <div>
                      <p className="font-medium">Export sebagai Excel</p>
                      <p className="text-xs text-slate-500">File XLS dengan formatting</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportJSON} className="cursor-pointer">
                    <FileText className="w-4 h-4 mr-3 text-blue-600" />
                    <div>
                      <p className="font-medium">Export sebagai JSON</p>
                      <p className="text-xs text-slate-500">Backup lengkap untuk import</p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <Button variant="outline" className="w-full justify-start gap-3 bg-white hover:bg-slate-50 border-slate-200">
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

          <Separator className="bg-slate-200" />

          {/* About */}
          <section className="animate-fade-in" style={{ animationDelay: '150ms' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-xl">
                <Info className="w-4 h-4 text-purple-600" />
              </div>
              <h2 className="font-bold text-slate-800">Tentang</h2>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-2">KOAS Tracker</h3>
              <p className="text-sm text-slate-600 mb-4">
                Personal progress tracker untuk dokter KOAS. Semua data disimpan secara lokal di perangkat kamu.
              </p>
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-slate-700">Status:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">⬜ Belum Mulai</span>
                  <span className="px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 text-xs font-medium">🟡 Sedang Berjalan</span>
                  <span className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-xs font-medium">🟢 Selesai</span>
                  <span className="px-3 py-1.5 rounded-lg bg-orange-100 text-orange-700 text-xs font-medium">⭐ Sudah Dinilai</span>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="pt-4 pb-2 text-center">
            <p className="text-sm text-slate-400 font-medium">© GMTECH</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Settings;