const statusConfig = {
  draft: { label: "Utkast", color: "bg-gray-100 text-gray-700" },
  new: { label: "Ny", color: "bg-blue-100 text-blue-700" },
  in_progress: { label: "Pågår", color: "bg-yellow-100 text-yellow-700" },
  pending_supplier: { label: "Venter leverandør", color: "bg-orange-100 text-orange-700" },
  resolved: { label: "Løst", color: "bg-green-100 text-green-700" },
  closed: { label: "Lukket", color: "bg-slate-100 text-slate-700" },
};

const priorityConfig = {
  low: { label: "Lav", color: "bg-gray-100 text-gray-700" },
  medium: { label: "Medium", color: "bg-blue-100 text-blue-700" },
  high: { label: "Høy", color: "bg-orange-100 text-orange-700" },
  urgent: { label: "Haster", color: "bg-red-100 text-red-700" },
};

export function ClaimStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

export function ClaimPriorityBadge({ priority }: { priority: string }) {
  const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}
