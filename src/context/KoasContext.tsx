import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AppData, Department, UserProfile, DEPARTMENT_LIST, Requirement, ChecklistItem } from '@/types/koas';

const STORAGE_KEY = 'koas-tracker-data';

const getInitialData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      console.error('Failed to parse stored data');
    }
  }
  
  return {
    profile: null,
    departments: DEPARTMENT_LIST.map(d => ({ ...d, requirements: [] })),
    activityLog: [],
    settings: {
      darkMode: false,
      hasOnboarded: false,
    },
  };
};

interface KoasContextType {
  data: AppData;
  isLoading: boolean;
  updateProfile: (profile: UserProfile) => void;
  completeOnboarding: () => void;
  toggleDarkMode: () => void;
  addRequirement: (departmentId: string, requirement: Omit<Requirement, 'id' | 'createdAt' | 'updatedAt'>) => Requirement;
  updateRequirement: (departmentId: string, requirementId: string, updates: Partial<Requirement>) => void;
  toggleChecklist: (departmentId: string, requirementId: string, checklistId: string) => void;
  addChecklistItem: (departmentId: string, requirementId: string, text: string) => ChecklistItem;
  removeChecklistItem: (departmentId: string, requirementId: string, checklistId: string) => void;
  setNilai: (departmentId: string, requirementId: string, nilai: string) => void;
  deleteRequirement: (departmentId: string, requirementId: string) => void;
  exportData: () => string;
  importData: (jsonString: string) => boolean;
  resetData: () => void;
}

const KoasContext = createContext<KoasContextType | null>(null);

export const KoasProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AppData>(getInitialData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isLoading]);

  const updateProfile = useCallback((profile: UserProfile) => {
    setData(prev => ({ ...prev, profile }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, hasOnboarded: true },
    }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, darkMode: !prev.settings.darkMode },
    }));
  }, []);

  const addRequirement = useCallback((departmentId: string, requirement: Omit<Requirement, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newRequirement: Requirement = {
      ...requirement,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    
    setData(prev => ({
      ...prev,
      departments: prev.departments.map(d =>
        d.id === departmentId
          ? { ...d, requirements: [...d.requirements, newRequirement] }
          : d
      ),
      activityLog: [
        {
          id: crypto.randomUUID(),
          departmentId,
          requirementId: newRequirement.id,
          action: `Menambahkan requirement: ${requirement.name}`,
          timestamp: now,
        },
        ...prev.activityLog,
      ],
    }));

    return newRequirement;
  }, []);

  const updateRequirement = useCallback((departmentId: string, requirementId: string, updates: Partial<Requirement>) => {
    const now = new Date().toISOString();
    
    setData(prev => ({
      ...prev,
      departments: prev.departments.map(d =>
        d.id === departmentId
          ? {
              ...d,
              requirements: d.requirements.map(r =>
                r.id === requirementId
                  ? { ...r, ...updates, updatedAt: now }
                  : r
              ),
            }
          : d
      ),
    }));
  }, []);

  const toggleChecklist = useCallback((departmentId: string, requirementId: string, checklistId: string) => {
    const now = new Date().toISOString();
    
    setData(prev => {
      const department = prev.departments.find(d => d.id === departmentId);
      const requirement = department?.requirements.find(r => r.id === requirementId);
      const checklistItem = requirement?.checklist.find(c => c.id === checklistId);
      
      return {
        ...prev,
        departments: prev.departments.map(d =>
          d.id === departmentId
            ? {
                ...d,
                requirements: d.requirements.map(r =>
                  r.id === requirementId
                    ? {
                        ...r,
                        updatedAt: now,
                        checklist: r.checklist.map(c =>
                          c.id === checklistId
                            ? { ...c, done: !c.done, completedAt: !c.done ? now : undefined }
                            : c
                        ),
                      }
                    : r
                ),
              }
            : d
        ),
        activityLog: [
          {
            id: crypto.randomUUID(),
            departmentId,
            requirementId,
            action: `${checklistItem?.done ? 'Membatalkan' : 'Menyelesaikan'} checklist: ${checklistItem?.text}`,
            timestamp: now,
          },
          ...prev.activityLog,
        ],
      };
    });
  }, []);

  const addChecklistItem = useCallback((departmentId: string, requirementId: string, text: string) => {
    const now = new Date().toISOString();
    const newItem: ChecklistItem = {
      id: crypto.randomUUID(),
      text,
      done: false,
    };
    
    setData(prev => ({
      ...prev,
      departments: prev.departments.map(d =>
        d.id === departmentId
          ? {
              ...d,
              requirements: d.requirements.map(r =>
                r.id === requirementId
                  ? { ...r, checklist: [...r.checklist, newItem], updatedAt: now }
                  : r
              ),
            }
          : d
      ),
    }));

    return newItem;
  }, []);

  const removeChecklistItem = useCallback((departmentId: string, requirementId: string, checklistId: string) => {
    const now = new Date().toISOString();
    
    setData(prev => ({
      ...prev,
      departments: prev.departments.map(d =>
        d.id === departmentId
          ? {
              ...d,
              requirements: d.requirements.map(r =>
                r.id === requirementId
                  ? { ...r, checklist: r.checklist.filter(c => c.id !== checklistId), updatedAt: now }
                  : r
              ),
            }
          : d
      ),
    }));
  }, []);

  const setNilai = useCallback((departmentId: string, requirementId: string, nilai: string) => {
    const now = new Date().toISOString();
    
    setData(prev => ({
      ...prev,
      departments: prev.departments.map(d =>
        d.id === departmentId
          ? {
              ...d,
              requirements: d.requirements.map(r =>
                r.id === requirementId
                  ? { ...r, nilai, updatedAt: now }
                  : r
              ),
            }
          : d
      ),
      activityLog: [
        {
          id: crypto.randomUUID(),
          departmentId,
          requirementId,
          action: `Input nilai: ${nilai}`,
          timestamp: now,
        },
        ...prev.activityLog,
      ],
    }));
  }, []);

  const deleteRequirement = useCallback((departmentId: string, requirementId: string) => {
    setData(prev => ({
      ...prev,
      departments: prev.departments.map(d =>
        d.id === departmentId
          ? { ...d, requirements: d.requirements.filter(r => r.id !== requirementId) }
          : d
      ),
    }));
  }, []);

  const exportData = useCallback(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  const importData = useCallback((jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString) as AppData;
      setData(imported);
      return true;
    } catch {
      return false;
    }
  }, []);

  const resetData = useCallback(() => {
    setData({
      profile: null,
      departments: DEPARTMENT_LIST.map(d => ({ ...d, requirements: [] })),
      activityLog: [],
      settings: {
        darkMode: false,
        hasOnboarded: false,
      },
    });
  }, []);

  return (
    <KoasContext.Provider value={{
      data,
      isLoading,
      updateProfile,
      completeOnboarding,
      toggleDarkMode,
      addRequirement,
      updateRequirement,
      toggleChecklist,
      addChecklistItem,
      removeChecklistItem,
      setNilai,
      deleteRequirement,
      exportData,
      importData,
      resetData,
    }}>
      {children}
    </KoasContext.Provider>
  );
};

export const useKoasData = () => {
  const context = useContext(KoasContext);
  if (!context) {
    throw new Error('useKoasData must be used within a KoasProvider');
  }
  return context;
};
