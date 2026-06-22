function StatCard({ title, value, icon: Icon, color, bgColor }) {
  return (
    <div
      className="rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 "
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0"
        style={{ backgroundColor: color }}
      >
        <Icon size={22} />
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-500">{title}</p>
        <h2 className="text-3xl font-bold text-gray-900 leading-tight">
          {value}
        </h2>
      </div>
    </div>
  );
}

export default StatCard;