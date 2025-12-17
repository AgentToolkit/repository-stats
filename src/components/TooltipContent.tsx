interface TooltipContentProps {
  active: any;
  payload: any[];
  label: any;
}
const TooltipContent = ({ active, payload, label }: TooltipContentProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#161b22] border border-[#30363d] p-3 rounded shadow-xl text-xs z-50">
        <p className="text-[#c9d1d9] font-bold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-[#8b949e] capitalize">{entry.name}:</span>
            <span className="text-[#f0f6fc] font-mono">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default TooltipContent;