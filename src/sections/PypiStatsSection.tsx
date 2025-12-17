import StatCard from "../components/StatCard"

import { Package, Download } from 'lucide-react';

interface PypiStatsSectionProps {
  last7DaysPyPI: number;
}

const PypiStatsSection = ({ last7DaysPyPI }: PypiStatsSectionProps) => (
  <div>
    <h3 className="text-sm font-medium text-[#8b949e] mb-3 flex items-center gap-2">
      <Package className="w-4 h-4" />
      PyPI Package
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatCard
      title="Total Downloads"
      value="103k"
      subtext={`+${last7DaysPyPI.toLocaleString()} last 7 days · Large volume due to Langflow dependency`}
      trend="up"
      alert={true}
      icon={Download}
      />
    </div>
  </div>
);

export default PypiStatsSection;