import { useMemo } from 'react';
import { Department, getRequirementStatus, RequirementStatus } from '@/types/koas';

export interface ProgressStats {
  total: number;
  notStarted: number;
  ongoing: number;
  done: number;
  nilai: number;
  percentage: {
    notStarted: number;
    ongoing: number;
    done: number;
    nilai: number;
    completed: number;
  };
}

export const useProgress = (departments: Department[]) => {
  const globalProgress = useMemo((): ProgressStats => {
    const allRequirements = departments.flatMap(d => d.requirements);
    const total = allRequirements.length;
    
    if (total === 0) {
      return {
        total: 0,
        notStarted: 0,
        ongoing: 0,
        done: 0,
        nilai: 0,
        percentage: { notStarted: 0, ongoing: 0, done: 0, nilai: 0, completed: 0 },
      };
    }

    const statuses = allRequirements.map(r => getRequirementStatus(r));
    const notStarted = statuses.filter(s => s === 'NOT_STARTED').length;
    const ongoing = statuses.filter(s => s === 'ON_GOING').length;
    const done = statuses.filter(s => s === 'DONE').length;
    const nilai = statuses.filter(s => s === 'NILAI').length;

    return {
      total,
      notStarted,
      ongoing,
      done,
      nilai,
      percentage: {
        notStarted: (notStarted / total) * 100,
        ongoing: (ongoing / total) * 100,
        done: (done / total) * 100,
        nilai: (nilai / total) * 100,
        completed: ((done + nilai) / total) * 100,
      },
    };
  }, [departments]);

  const getDepartmentProgress = (departmentId: string): ProgressStats => {
    const department = departments.find(d => d.id === departmentId);
    if (!department) {
      return {
        total: 0,
        notStarted: 0,
        ongoing: 0,
        done: 0,
        nilai: 0,
        percentage: { notStarted: 0, ongoing: 0, done: 0, nilai: 0, completed: 0 },
      };
    }

    const total = department.requirements.length;
    if (total === 0) {
      return {
        total: 0,
        notStarted: 0,
        ongoing: 0,
        done: 0,
        nilai: 0,
        percentage: { notStarted: 0, ongoing: 0, done: 0, nilai: 0, completed: 0 },
      };
    }

    const statuses = department.requirements.map(r => getRequirementStatus(r));
    const notStarted = statuses.filter(s => s === 'NOT_STARTED').length;
    const ongoing = statuses.filter(s => s === 'ON_GOING').length;
    const done = statuses.filter(s => s === 'DONE').length;
    const nilai = statuses.filter(s => s === 'NILAI').length;

    return {
      total,
      notStarted,
      ongoing,
      done,
      nilai,
      percentage: {
        notStarted: (notStarted / total) * 100,
        ongoing: (ongoing / total) * 100,
        done: (done / total) * 100,
        nilai: (nilai / total) * 100,
        completed: ((done + nilai) / total) * 100,
      },
    };
  };

  return { globalProgress, getDepartmentProgress };
};
