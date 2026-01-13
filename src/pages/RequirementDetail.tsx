import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useKoasData } from '@/hooks/useKoasData';
import { getRequirementStatus } from '@/types/koas';
import { StatusBadge } from '@/components/StatusBadge';
import { ChecklistItem } from '@/components/ChecklistItem';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Star, Trash2, User, FileText } from 'lucide-react';
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

const RequirementDetail = () => {
  const navigate = useNavigate();
  const { departmentId, requirementId } = useParams<{ departmentId: string; requirementId: string }>();
  const { data, toggleChecklist, addChecklistItem, removeChecklistItem, updateRequirement, setNilai, deleteRequirement } = useKoasData();

  const [newChecklistText, setNewChecklistText] = useState('');
  const [isNilaiOpen, setIsNilaiOpen] = useState(false);
  const [nilaiInput, setNilaiInput] = useState('');

  const department = data.departments.find(d => d.id === departmentId);
  const requirement = department?.requirements.find(r => r.id === requirementId);

  if (!department || !requirement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Requirement tidak ditemukan</p>
      </div>
    );
  }

  const status = getRequirementStatus(requirement);
  const completedCount = requirement.checklist.filter(c => c.done).length;
  const totalCount = requirement.checklist.length;
  const canInputNilai = status === 'DONE';

  const handleAddChecklist = () => {
    if (!newChecklistText.trim()) return;
    addChecklistItem(department.id, requirement.id, newChecklistText);
    setNewChecklistText('');
  };

  const handleSaveNilai = () => {
    if (!nilaiInput.trim()) return;
    setNilai(department.id, requirement.id, nilaiInput);
    setIsNilaiOpen(false);
    setNilaiInput('');
  };

  const handleDelete = () => {
    deleteRequirement(department.id, requirement.id);
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-6 py-4 max-w-lg mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-muted rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {requirement.type === 'PASIEN' ? (
                  <User className="w-4 h-4 text-primary flex-shrink-0" />
                ) : (
                  <FileText className="w-4 h-4 text-accent-foreground flex-shrink-0" />
                )}
                <h1 className="text-lg font-bold truncate">{requirement.name}</h1>
              </div>
              <p className="text-sm text-muted-foreground">{department.name}</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive">
                  <Trash2 className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Requirement?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini tidak dapat dibatalkan. Semua data checklist akan terhapus.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      <div className="px-6 py-4">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Status & Progress Card */}
          <div className="p-4 bg-card rounded-xl border border-border animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <StatusBadge status={status} />
              {totalCount > 0 && (
                <span className="text-sm text-muted-foreground">
                  {completedCount}/{totalCount} selesai
                </span>
              )}
            </div>

            {totalCount > 0 && (
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${(completedCount / totalCount) * 100}%` }}
                />
              </div>
            )}

            {requirement.nilai && (
              <div className="mt-4 flex items-center gap-2 p-3 bg-status-nilai-light rounded-lg">
                <Star className="w-5 h-5 text-status-nilai" />
                <span className="font-semibold">Nilai: {requirement.nilai}</span>
              </div>
            )}
          </div>

          {/* Checklist Section */}
          <section className="animate-fade-in" style={{ animationDelay: '50ms' }}>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-semibold">Checklist</Label>
            </div>

            <div className="space-y-2 mb-4">
              {requirement.checklist.map((item) => (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  onToggle={() => toggleChecklist(department.id, requirement.id, item.id)}
                  onDelete={() => removeChecklistItem(department.id, requirement.id, item.id)}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Tambah item checklist..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddChecklist()}
              />
              <Button onClick={handleAddChecklist} size="icon" disabled={!newChecklistText.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </section>

          {/* Notes Section */}
          <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <Label className="text-base font-semibold">Catatan</Label>
            <Textarea
              placeholder="Tulis catatan klinis, reminder, atau progress pasien..."
              value={requirement.notes}
              onChange={(e) => updateRequirement(department.id, requirement.id, { notes: e.target.value })}
              className="mt-2 min-h-[120px]"
            />
          </section>

          {/* Patient Info (if applicable) */}
          {requirement.type === 'PASIEN' && (
            <section className="animate-fade-in" style={{ animationDelay: '150ms' }}>
              <Label className="text-base font-semibold">Info Pasien (Opsional)</Label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Kode RM</Label>
                  <Input
                    placeholder="RM-001"
                    value={requirement.patient?.rmCode || ''}
                    onChange={(e) => updateRequirement(department.id, requirement.id, {
                      patient: { ...requirement.patient, rmCode: e.target.value }
                    })}
                    className="h-10"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Umur</Label>
                  <Input
                    type="number"
                    placeholder="25"
                    value={requirement.patient?.age || ''}
                    onChange={(e) => updateRequirement(department.id, requirement.id, {
                      patient: { ...requirement.patient, age: parseInt(e.target.value) || undefined }
                    })}
                    className="h-10"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">JK</Label>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant={requirement.patient?.gender === 'L' ? 'default' : 'outline'}
                      onClick={() => updateRequirement(department.id, requirement.id, {
                        patient: { ...requirement.patient, gender: 'L' }
                      })}
                      className="flex-1 h-10"
                    >
                      L
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={requirement.patient?.gender === 'P' ? 'default' : 'outline'}
                      onClick={() => updateRequirement(department.id, requirement.id, {
                        patient: { ...requirement.patient, gender: 'P' }
                      })}
                      className="flex-1 h-10"
                    >
                      P
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Nilai Button */}
          {canInputNilai && !requirement.nilai && (
            <Dialog open={isNilaiOpen} onOpenChange={setIsNilaiOpen}>
              <DialogTrigger asChild>
                <Button className="w-full h-12 gap-2 bg-status-nilai hover:bg-status-nilai/90">
                  <Star className="w-5 h-5" />
                  Input Nilai
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Input Nilai</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Nilai (Angka atau Huruf)</Label>
                    <Input
                      placeholder="Contoh: A atau 85"
                      value={nilaiInput}
                      onChange={(e) => setNilaiInput(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSaveNilai} disabled={!nilaiInput.trim()} className="w-full">
                    Simpan Nilai
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default RequirementDetail;
