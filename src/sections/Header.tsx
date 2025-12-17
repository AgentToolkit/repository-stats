import { Activity } from 'lucide-react';

const Header = ({ stats }) => {
    return (
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <h1 className="text-3xl font-bold text-[#f0f6fc]">Project Overview</h1>
            <div className="flex items-center gap-2 text-sm text-[#8b949e]">
              <Activity className="w-4 h-4" />
              <span>Last updated: <span className="text-[#f0f6fc] font-medium">{stats.LAST_UPDATED.toLocaleString(undefined, { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                timeZoneName: 'short'
              })}</span></span>
            </div>
          </div>
          <p className="text-[#8b949e]">Real-time insights into community growth, traffic, and package adoption.</p>
        </div>
    )
}

export default Header;