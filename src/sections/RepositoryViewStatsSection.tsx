import StatCard from "../components/StatCard"

import { Eye, Users } from 'lucide-react';

const RepositoryViewStatsSection = ({ stats }) => (
  <div>
    <h3 className="text-sm font-medium text-[#8b949e] mb-3 flex items-center gap-2">
      <Eye className="w-4 h-4" />
      Repository Views
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatCard 
      title="Total Views" 
      value={stats.totalViews.toLocaleString()} 
      subtext={`+${stats.last7DaysViews} last 7 days`}
      trend="up"
      icon={Eye} 
      />
      <StatCard 
      title="Unique Visitors" 
      value={stats.totalUniqueVisitors} 
      subtext={`+${stats.last7DaysUniqueVisitors} last 7 days`}
      trend="up"
      icon={Users} 
      />
    </div>
  </div>
);

export default RepositoryViewStatsSection;