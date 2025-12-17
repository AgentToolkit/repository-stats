import { ArrowUpRight, AlertCircle } from 'lucide-react';

const StatCard = ({ title, value, subtext, icon: Icon, trend, alert }) => (
  <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 flex flex-col justify-between hover:border-[#58a6ff] transition-colors duration-200">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-[#8b949e] text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-[#f0f6fc]">{value}</h3>
      </div>
      <div className="p-2 bg-[#21262d] rounded-md">
        <Icon className="w-5 h-5 text-[#7ee787]" />
      </div>
    </div>
    {subtext && (
      <div className="flex items-start text-xs">
        {alert ? (
             <AlertCircle className="w-3 h-3 text-[#e3b341] mr-1 mt-0.5 shrink-0" />
        ) : (
            trend === 'up' && <ArrowUpRight className="w-3 h-3 text-[#3fb950] mr-1 mt-0.5" />
        )}
        <span className={alert ? "text-[#e3b341]" : (trend === 'up' ? "text-[#3fb950]" : "text-[#8b949e]")}>
            {subtext}
        </span>
      </div>
    )}
  </div>
);

export default StatCard;