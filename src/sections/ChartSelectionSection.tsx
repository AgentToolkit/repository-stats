// @ts-nocheck
import { Activity, AlertCircle, Download, ExternalLink, Eye, Star, Users } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import TooltipContent from "../components/TooltipContent";
import Repository from "../types/repository";

interface ChartSelectionSectionProps {
  stats: any
  repository: Repository
};

const ChartSelectionSection = ({ repository, stats }: ChartSelectionSectionProps) => {

  const [activeTab, setActiveTab] = useState('stars');

  return (
    <div>
      <div className="flex border-b border-[#30363d] mb-8 overflow-x-auto">
        {['stars', 'traffic', 'package'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium capitalize border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab 
                ? 'border-[#f78166] text-[#f0f6fc]' 
                : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9] hover:border-[#8b949e]'
            }`}
          >
            {tab === 'package' ? 'Python Package' : `GitHub ${tab}`}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      {activeTab === 'traffic' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Data Collection Note */}
          <div className="flex items-center gap-3 px-4 py-3 bg-[#161b22] border border-[#30363d] rounded-lg text-sm text-[#8b949e]">
            <AlertCircle className="w-4 h-4 text-[#e3b341]" />
            <p>
              Note: GitHub traffic data collected only from <span className="text-[#f0f6fc]">Oct 30</span> ({stats.daysSinceDataStart} days), but <code className="bg-[#21262d] px-1 py-0.5 rounded text-[#f0f6fc]">{ repository.name }</code> was released on <span className="text-[#f0f6fc]">Sep 11</span>.
            </p>
          </div>

          {/* Clones Section */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-[#f0f6fc] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#238636]" />
                  Clones & Unique Cloners
                </h2>
                <p className="text-xs text-[#8b949e] mt-1">Full window analysis (Oct 30 - Dec 09)</p>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <span className="flex items-center gap-1 text-xs text-[#8b949e]">
                  <div className="w-3 h-3 bg-[#238636] rounded-sm"></div> Unique
                </span>
                <span className="flex items-center gap-1 text-xs text-[#8b949e]">
                  <div className="w-3 h-3 bg-[#238636]/30 rounded-sm"></div> Total
                </span>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.TRAFFIC_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorClones" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#238636" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#238636" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#8b949e" 
                    fontSize={11} 
                    tickLine={false}
                    axisLine={false}
                    minTickGap={20}
                  />
                  <YAxis 
                    stroke="#8b949e" 
                    fontSize={11} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<TooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="clones" 
                    stroke="#238636" 
                    strokeOpacity={0.4}
                    fill="url(#colorClones)" 
                    strokeWidth={1}
                    name="Total Clones"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="uniqueCloners" 
                    stroke="#3fb950" 
                    fill="none" 
                    strokeWidth={3}
                    name="Unique Cloners"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Views Section */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-[#f0f6fc] flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#a371f7]" />
                  Views & Unique Visitors
                </h2>
                <p className="text-xs text-[#8b949e] mt-1">Full window analysis (Oct 30 - Dec 09)</p>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <span className="flex items-center gap-1 text-xs text-[#8b949e]">
                  <div className="w-3 h-3 bg-[#a371f7] rounded-sm"></div> Unique
                </span>
                <span className="flex items-center gap-1 text-xs text-[#8b949e]">
                  <div className="w-3 h-3 bg-[#a371f7]/30 rounded-sm"></div> Total
                </span>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.TRAFFIC_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a371f7" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#a371f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#8b949e" 
                    fontSize={11} 
                    tickLine={false}
                    axisLine={false}
                    minTickGap={20}
                  />
                  <YAxis 
                    stroke="#8b949e" 
                    fontSize={11} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<TooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#a371f7" 
                    strokeOpacity={0.4}
                    fill="url(#colorViews)" 
                    strokeWidth={1}
                    name="Total Views"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="uniqueVisitors" 
                    stroke="#d2a8ff" 
                    fill="none" 
                    strokeWidth={3}
                    name="Unique Visitors"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stars' && (
        <div className="animate-in fade-in duration-500">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[#f0f6fc] flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#e3b341]" />
                  Star History
                </h2>
                <p className="text-xs text-[#8b949e] mb-2">Cumulative growth (star-history.com style)</p>
                
                <a 
                  href={`https://www.star-history.com/#${repository.github_organization}/${repository.name}&type=date&legend=top-left`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center text-xs text-[#58a6ff] hover:underline"
                >
                  View on Star History <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
              <div className="text-left md:text-right">
                <div className="text-2xl font-bold text-[#f0f6fc]">{stats.STARS_DATA.length > 0 ? stats.STARS_DATA[stats.STARS_DATA.length - 1]?.stars || 237 : 237}</div>
                <div className="text-xs text-[#8b949e]">Current Stars</div>
              </div>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.STARS_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#8b949e" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#8b949e" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<TooltipContent />} />
                  <Line 
                    type="linear" 
                    dataKey="stars" 
                    stroke="#e3b341" 
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: '#e3b341', stroke: '#0d1117', strokeWidth: 2 }}
                    name="Stars"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'package' && (
        <div className="animate-in fade-in duration-500 grid gap-6">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-semibold text-[#f0f6fc] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#f78166]" />
                  PyPI Downloads
                </h2>
                <p className="text-xs text-[#8b949e] mt-1">
                  Daily downloads aggregated by Python version for <code className="bg-[#21262d] px-1 py-0.5 rounded text-[#f0f6fc]">{ repository.name }</code> package
                </p>
              </div>
              <a 
                href={`https://clickpy.clickhouse.com/dashboard/${repository.pypi_package_name}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center text-xs text-[#58a6ff] hover:underline"
              >
                View on ClickPy <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.PYPI_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#8b949e" 
                    fontSize={11} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#8b949e" 
                    fontSize={11} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<TooltipContent />} />
                  <Bar 
                    dataKey="downloads" 
                    fill="#f78166" 
                    radius={[4, 4, 0, 0]}
                    name="Downloads"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 flex flex-col justify-center items-center text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-[#21262d] rounded-full flex items-center justify-center mb-4">
                <Download className="w-8 h-8 text-[#f78166]" />
              </div>
              <h3 className="text-xl font-bold text-[#f0f6fc] mb-1">Installation</h3>
              <code className="bg-[#30363d] text-[#f0f6fc] px-4 py-2 rounded-md text-sm font-mono mt-2">
                pip install {repository.name}
              </code>
              {
                repository.version != "" && ( 
                  <p className="text-xs text-[#8b949e] mt-4">
                    Latest version: <span className="text-[#f0f6fc]">{repository.version}</span>
                  </p>
                )
              }
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartSelectionSection;