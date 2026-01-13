import { useNavigate } from 'react-router-dom';
import { useKoasData } from '@/hooks/useKoasData';
import { DepartmentCard } from '@/components/DepartmentCard';
import { BottomNav } from '@/components/BottomNav';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const DepartmentList = () => {
  const navigate = useNavigate();
  const { data } = useKoasData();
  const [search, setSearch] = useState('');

  const filteredDepartments = data.departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.shortName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-6 py-4 max-w-lg mx-auto">
          <h1 className="text-xl font-bold mb-4">Departemen</h1>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari departemen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </div>
      </header>

      {/* Department List */}
      <div className="px-6 py-4">
        <div className="max-w-lg mx-auto space-y-3">
          {filteredDepartments.map((dept, i) => (
            <DepartmentCard
              key={dept.id}
              department={dept}
              departments={data.departments}
              onClick={() => navigate(`/department/${dept.id}`)}
              style={{ animationDelay: `${i * 30}ms` }}
            />
          ))}

          {filteredDepartments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Tidak ada departemen ditemukan</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default DepartmentList;
