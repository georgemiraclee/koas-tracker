import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useKoasData } from '@/hooks/useKoasData';
import { useProgress } from '@/hooks/useProgress';
import { RequirementCard } from '@/components/RequirementCard';
import { ProgressRing } from '@/components/ProgressRing';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, User, FileText, Search } from 'lucide-react';
import { RequirementType } from '@/types/koas';

const DepartmentDetail = () => {
  const navigate = useNavigate();
  const { departmentId } = useParams<{ departmentId: string }>();
  const { data, addRequirement } = useKoasData();
  const { getDepartmentProgress } = useProgress(data.departments);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newReq, setNewReq] = useState({ name: '', type: 'PASIEN' as RequirementType });
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'PASIEN' | 'NON_PASIEN'>('all');

  const department = data.departments.find(d => d.id === departmentId);
  const progress = department ? getDepartmentProgress(department.id) : null;

  if (!department || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Departemen tidak ditemukan</p>
      </div>
    );
  }

  const filteredRequirements = department.requirements.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesTab = tab === 'all' || r.type === tab;
    return matchesSearch && matchesTab;
  });

  const handleAdd = () => {
    if (!newReq.name.trim()) return;
    
    addRequirement(department.id, {
      name: newReq.name,
      type: newReq.type,
      checklist: [],
      notes: '',
    });
    
    setNewReq({ name: '', type: 'PASIEN' });
    setIsAddOpen(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-6 py-4 max-w-lg mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-muted rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">{department.icon}</span>
                <h1 className="text-xl font-bold">{department.name}</h1>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="flex items-center gap-4 p-4 bg-accent/50 rounded-xl mb-4">
            <ProgressRing
              progress={progress.percentage.completed}
              size={64}
              strokeWidth={6}
              showPercentage={false}
              segments={{
                notStarted: progress.notStarted,
                ongoing: progress.ongoing,
                done: progress.done,
                nilai: progress.nilai,
              }}
            />
            <div className="flex-1 grid grid-cols-4 gap-2 text-center text-sm">
              <div>
                <div className="font-bold text-status-not-started">{progress.notStarted}</div>
                <div className="text-xs text-muted-foreground">Belum</div>
              </div>
              <div>
                <div className="font-bold text-status-ongoing">{progress.ongoing}</div>
                <div className="text-xs text-muted-foreground">Ongoing</div>
              </div>
              <div>
                <div className="font-bold text-status-done">{progress.done}</div>
                <div className="text-xs text-muted-foreground">Selesai</div>
              </div>
              <div>
                <div className="font-bold text-status-nilai">{progress.nilai}</div>
                <div className="text-xs text-muted-foreground">Dinilai</div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari requirement..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </div>
      </header>

      {/* Tabs & Content */}
      <div className="px-6 py-4">
        <div className="max-w-lg mx-auto">
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <div className="flex items-center justify-between mb-4">
              <TabsList className="grid grid-cols-3 w-auto">
                <TabsTrigger value="all" className="px-4">Semua</TabsTrigger>
                <TabsTrigger value="PASIEN" className="px-4">
                  <User className="w-4 h-4 mr-1" />
                  Pasien
                </TabsTrigger>
                <TabsTrigger value="NON_PASIEN" className="px-4">
                  <FileText className="w-4 h-4 mr-1" />
                  Non Pasien
                </TabsTrigger>
              </TabsList>

              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1">
                    <Plus className="w-4 h-4" />
                    Tambah
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Requirement</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Nama Requirement</Label>
                      <Input
                        placeholder="Contoh: Scaling Manual"
                        value={newReq.name}
                        onChange={(e) => setNewReq({ ...newReq, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Jenis</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={newReq.type === 'PASIEN' ? 'default' : 'outline'}
                          onClick={() => setNewReq({ ...newReq, type: 'PASIEN' })}
                          className="flex-1"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Pasien
                        </Button>
                        <Button
                          type="button"
                          variant={newReq.type === 'NON_PASIEN' ? 'default' : 'outline'}
                          onClick={() => setNewReq({ ...newReq, type: 'NON_PASIEN' })}
                          className="flex-1"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Non Pasien
                        </Button>
                      </div>
                    </div>
                    <Button onClick={handleAdd} disabled={!newReq.name.trim()} className="w-full">
                      Tambah Requirement
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <TabsContent value={tab} className="mt-0">
              <div className="space-y-3">
                {filteredRequirements.map((req, i) => (
                  <RequirementCard
                    key={req.id}
                    requirement={req}
                    onClick={() => navigate(`/department/${department.id}/requirement/${req.id}`)}
                    style={{ animationDelay: `${i * 30}ms` }}
                  />
                ))}

                {filteredRequirements.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      {department.requirements.length === 0
                        ? 'Belum ada requirement. Mulai tambahkan!'
                        : 'Tidak ada requirement ditemukan'}
                    </p>
                    {department.requirements.length === 0 && (
                      <Button onClick={() => setIsAddOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Requirement
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default DepartmentDetail;
