export default function Breadcrumb({ zone, formation, onNavigate }) {
  const steps = [
    { label: "National", level: "national", active: !zone },
  ];

  if (zone) {
    steps.push({ label: zone, level: "zone", active: zone && !formation });
  }
  if (formation) {
    steps.push({ label: formation, level: "formation", active: true });
  }

  return (
    <nav className="flex items-center gap-1 text-sm">
      {steps.map((step, i) => (
        <span key={step.level} className="flex items-center gap-1">
          {i > 0 && (
            <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          {step.active ? (
            <span className="font-semibold text-nis-primary">{step.label}</span>
          ) : (
            <button
              onClick={() => onNavigate(step.level)}
              className="text-gray-400 hover:text-nis-primary transition-colors cursor-pointer"
            >
              {step.label}
            </button>
          )}
        </span>
      ))}
    </nav>
  );
}
