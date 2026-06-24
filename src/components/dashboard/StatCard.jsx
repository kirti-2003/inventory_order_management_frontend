function StatCard({ title, value, icon: Icon, color, bgColor }) {
  return (
    <div
      className="dashboard-stat-card flex w-full items-center gap-3 rounded-xl border border-gray-100 shadow-sm transition-shadow duration-200 hover:shadow-md"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-white"
        style={{ backgroundColor: color }}
      >
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="mb-0.5 truncate text-xs font-medium text-gray-500">
          {title}
        </p>
        <h2 className="text-xl font-bold leading-tight text-gray-900">
          {value}
        </h2>
      </div>
    </div>
  );
}

export default StatCard;