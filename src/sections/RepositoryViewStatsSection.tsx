import StatCard from "../components/StatCard"

import { Eye, Users } from 'lucide-react';

interface RepositoryViewStatsSectionProps {
  totalViews: number;
  last7DaysViews: number;
  totalUniqueVisitors: number;
  last7DaysUniqueVisitors: number;
}

const RepositoryViewStatsSection = ({ totalViews, last7DaysViews, totalUniqueVisitors, last7DaysUniqueVisitors }: RepositoryViewStatsSectionProps) => (
  <div>
    <h3 className="text-sm font-medium text-[#8b949e] mb-3 flex items-center gap-2">
      <Eye className="w-4 h-4" />
      Repository Views
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatCard 
      title="Total Views" 
      value={totalViews.toLocaleString()} 
      subtext={`+${last7DaysViews.toLocaleString()} last 7 days`}
      trend="up"
      icon={Eye} 
      />
      <StatCard 
      title="Unique Visitors" 
      value={totalUniqueVisitors.toLocaleString()} 
      subtext={`+${last7DaysUniqueVisitors.toLocaleString()} last 7 days`}
      trend="up"
      icon={Users} 
      />
    </div>
  </div>
);

export default RepositoryViewStatsSection;