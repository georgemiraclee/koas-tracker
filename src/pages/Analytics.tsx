import { useKoasData } from '@/hooks/useKoasData';
import { useProgress } from '@/hooks/useProgress';
import { ProgressRing } from '@/components/ProgressRing';
import { BottomNav } from '@/components/BottomNav';
import { getRequirementStatus } from '@/types/koas';
import { TrendingUp, Award, Clock, CheckCircle2 } from 'lucide-react';

const Analytics = () => {
  const { data } = useKoasData();
  const { globalProgress, getDepartmentProgress } = useProgress(data.departments);

  // Calculate some insights
  const allRequirements = data.departments.flatMap(d =>
    d.requirements.map(r => ({
      ...r,
      departmentId: d.id,
      departmentName: d.name,
      status: getRequirementStatus(r),
    }))
  );

  const ongoingCount = allRequirements.filter(r => r.status === 'ON_GOING').length;
  const doneCount = allRequirements.filter(r => r.status === 'DONE' || r.status === 'NILAI').length;
  const nilaiCount = allRequirements.filter(r => r.status === 'NILAI').length;

  // Department with most progress
  const departmentProgress = data.departments.map(d => ({
    ...d,
    progress: getDepartmentProgress(d.id),
  })).sort((a, b) => b.progress.percentage.completed - a.progress.percentage.completed);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-6 py-4 max-w-lg mx-auto">
          <h1 className="text-xl font-bold">Analitik Progress</h1>
        </div>
      </header>

      <div className="px-6 py-4">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Main Progress */}
          <div className="p-6 bg-card rounded-2xl border border-border animate-fade-in">
            <h2 className="text-lg font-semibold mb-4 text-center">Progress Keseluruhan</h2>
            <div className="flex justify-center mb-6">
              <ProgressRing
                progress={globalProgress.percentage.completed}
                size={160}
                strokeWidth={12}
                segments={{
                  notStarted: globalProgress.notStarted,
                  ongoing: globalProgress.ongoing,
                  done: globalProgress.done,
                  nilai: globalProgress.nilai,
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-status-not-started-light text-center">
                <div className="text-2xl font-bold text-status-not-started">{globalProgress.notStarted}</div>
                <div className="text-sm text-muted-foreground">Belum Mulai</div>
              </div>
              <div className="p-3 rounded-xl bg-status-ongoing-light text-center">
                <div className="text-2xl font-bold text-status-ongoing">{globalProgress.ongoing}</div>
                <div className="text-sm text-muted-foreground">Sedang Berjalan</div>
              </div>
              <div className="p-3 rounded-xl bg-status-done-light text-center">
                <div className="text-2xl font-bold text-status-done">{globalProgress.done}</div>
                <div className="text-sm text-muted-foreground">Selesai</div>
              </div>
              <div className="p-3 rounded-xl bg-status-nilai-light text-center">
                <div className="text-2xl font-bold text-status-nilai">{globalProgress.nilai}</div>
                <div className="text-sm text-muted-foreground">Sudah Dinilai</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 animate-fade-in" style={{ animationDelay: '50ms' }}>
            <div className="p-4 bg-card rounded-xl border border-border text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-status-ongoing" />
              <div className="text-xl font-bold">{ongoingCount}</div>
              <div className="text-xs text-muted-foreground">Ongoing</div>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border text-center">
              <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-status-done" />
              <div className="text-xl font-bold">{doneCount}</div>
              <div className="text-xs text-muted-foreground">Selesai</div>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border text-center">
              <Award className="w-6 h-6 mx-auto mb-2 text-status-nilai" />
              <div className="text-xl font-bold">{nilaiCount}</div>
              <div className="text-xs text-muted-foreground">Dinilai</div>
            </div>
          </div>

          {/* Department Progress */}
          <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Progress Per Departemen</h2>
            </div>

            <div className="space-y-3">
              {departmentProgress.map((dept, i) => (
                <div
                  key={dept.id}
                  className="p-4 bg-card rounded-xl border border-border animate-fade-in"
                  style={{ animationDelay: `${100 + i * 30}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{dept.icon}</span>
                      <span className="font-medium">{dept.shortName}</span>
                    </div>
                    <span className="text-sm font-semibold">
                      {Math.round(dept.progress.percentage.completed)}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full flex">
                      <div
                        className="status-nilai transition-all duration-500"
                        style={{ width: `${dept.progress.percentage.nilai}%` }}
                      />
                      <div
                        className="status-done transition-all duration-500"
                        style={{ width: `${dept.progress.percentage.done}%` }}
                      />
                      <div
                        className="status-ongoing transition-all duration-500"
                        style={{ width: `${dept.progress.percentage.ongoing}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{dept.progress.total} requirement</span>
                    <span>
                      {dept.progress.done + dept.progress.nilai}/{dept.progress.total} selesai
                    </span>
                  </div>
                </div>
              ))}

              {departmentProgress.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Belum ada data requirement</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Analytics;
