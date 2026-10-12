export function getInitials(name: string | null | undefined): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return (parts[0] ?? '??').slice(0, 2).toUpperCase();
}

export function getStatusBadge(status: string | null | undefined): string {
  return status?.toLowerCase() === 'monitoring'
    ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
    : 'bg-emerald-50 text-emerald-700 border border-emerald-200';
}

export function getStatusDot(status: string | null | undefined): string {
  return status?.toLowerCase() === 'monitoring' ? 'bg-cyan-500' : 'bg-emerald-500';
}

export function getRiskBadge(risk: string | null | undefined): string {
  switch (risk?.toUpperCase()) {
    case 'HIGH':
      return 'bg-rose-100 text-rose-800 border border-rose-200';
    case 'LOW':
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    default:
      return 'bg-amber-100 text-amber-800 border border-amber-200';
  }
}

export function getLabStatusBadge(status: string | null | undefined): string {
  switch (status?.toLowerCase()) {
    case 'critical':
      return 'bg-rose-50 text-rose-700 border border-rose-200';
    case 'attention':
    case 'elevated':
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    default:
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  }
}

export function getPriorityBadge(priority: string | null | undefined): string {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'bg-rose-100 text-rose-800';
    case 'medium':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-slate-200 text-slate-700';
  }
}
