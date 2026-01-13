import { useNavigate } from 'react-router-dom';
import { useKoasData } from '@/hooks/useKoasData';
import { useProgress } from '@/hooks/useProgress';
import { ProgressRing } from '@/components/ProgressRing';
import { DepartmentCard } from '@/components/DepartmentCard';
import { getRequirementStatus } from '@/types/koas';
import { BottomNav } from '@/components/BottomNav';
import { Clock, TrendingUp, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data } = useKoasData();
  const { globalProgress } = useProgress(data.departments);

  // Get ongoing requirements for reminder
  const ongoingRequirements = data.departments.flatMap(d =>
    d.requirements
      .filter(r => getRequirementStatus(r) === 'ON_GOING')
      .map(r => ({ ...r, departmentId: d.id, departmentName: d.name }))
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 pb-24">
      {/* Header - Enhanced */}
      <div className="relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative gradient-hero pt-16 pb-12 px-6">
          <div className="max-w-lg mx-auto">
            {/* Greeting */}
            <div className="mb-8">
              <p className="text-white/70 text-sm mb-1 font-medium">Selamat Datang Kembali</p>
              <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">
                {data.profile?.name || 'Dokter Koas'}
              </h1>
              <p className="text-white/60 text-sm">Mari lanjutkan progres KOAS Anda</p>
            </div>
            
            {/* Progress Card - Redesigned */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl shadow-blue-900/10 border border-white/50">
              <div className="flex items-start gap-6">
                {/* Progress Ring */}
                <div className="relative">
                  <ProgressRing
                    progress={globalProgress.percentage.completed}
                    size={110}
                    strokeWidth={10}
                    segments={{
                      notStarted: globalProgress.notStarted,
                      ongoing: globalProgress.ongoing,
                      done: globalProgress.done,
                      nilai: globalProgress.nilai,
                    }}
                    className="drop-shadow-md"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-blue-500/40" />
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-bold text-slate-800">Progress KOAS</h2>
                    <div className="px-2 py-0.5 bg-blue-500/10 rounded-full text-xs font-semibold text-blue-600">
                      {Math.round(globalProgress.percentage.completed)}%
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full status-not-started shadow-sm" />
                      <div>
                        <span className="block text-xs text-slate-500 font-medium">Belum</span>
                        <span className="block text-sm font-bold text-slate-800">{globalProgress.notStarted}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full status-ongoing shadow-sm" />
                      <div>
                        <span className="block text-xs text-slate-500 font-medium">Ongoing</span>
                        <span className="block text-sm font-bold text-slate-800">{globalProgress.ongoing}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full status-done shadow-sm" />
                      <div>
                        <span className="block text-xs text-slate-500 font-medium">Selesai</span>
                        <span className="block text-sm font-bold text-slate-800">{globalProgress.done}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full status-nilai shadow-sm" />
                      <div>
                        <span className="block text-xs text-slate-500 font-medium">Dinilai</span>
                        <span className="block text-sm font-bold text-slate-800">{globalProgress.nilai}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-4">
        <div className="max-w-lg mx-auto space-y-8">
          {/* Ongoing Reminders - Enhanced */}
          {ongoingRequirements.length > 0 && (
            <section className="animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-orange-100 rounded-xl">
                  <Clock className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-800">Sedang Dikerjakan</h2>
                  <p className="text-xs text-slate-500">Lanjutkan progress Anda</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {ongoingRequirements.map((req, index) => (
                  <button
                    key={req.id}
                    onClick={() => navigate(`/department/${req.departmentId}/requirement/${req.id}`)}
                    className="group w-full p-4 bg-white rounded-2xl flex items-center gap-4 text-left hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 border border-slate-100 hover:border-orange-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate mb-0.5">{req.name}</p>
                      <p className="text-sm text-slate-500">{req.departmentName}</p>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-bold text-orange-600 mb-0.5">
                        {req.checklist.filter(c => c.done).length}/{req.checklist.length}
                      </div>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all"
                          style={{ width: `${(req.checklist.filter(c => c.done).length / req.checklist.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Departments - Enhanced */}
          <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-2 mb-5">
       
           
            </div>
            
            <div className="space-y-3">
              {data.departments.slice(0, 5).map((dept, i) => (
                <div
                  key={dept.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${150 + i * 50}ms` }}
                >
                  <DepartmentCard
                    department={dept}
                    departments={data.departments}
                    onClick={() => navigate(`/department/${dept.id}`)}
                  />
                </div>
              ))}
            </div>
            
            {data.departments.length > 5 && (
              <button
                onClick={() => navigate('/departments')}
                className="w-full mt-4 p-4 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-blue-600 font-semibold rounded-2xl transition-all duration-300 border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100 flex items-center justify-center gap-2 group"
              >
                <span>Lihat Semua Departemen</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            )}
          </section>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;