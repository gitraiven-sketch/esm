const DashboardCard = ({ title, value, detail, accent }) => (
  <div className={`card-glass p-6 shadow-sm border border-slate-200/80 ${accent}`}>
    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</h3>
    <div className="mt-4 text-4xl font-bold text-slate-900">{value}</div>
    <p className="mt-2 text-slate-500">{detail}</p>
  </div>
);

export default DashboardCard;
