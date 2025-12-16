// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { GitPullRequest, Eye, Star, Package, Download, Users, Github, ExternalLink, ArrowUpRight, Activity, AlertCircle } from 'lucide-react';
import { MERGED_ARCHIVE_DATA, LAST_UPDATED_TIMESTAMP } from './merged-archive-data';
import { MERGED_STARS_DATA, LAST_UPDATED_STARS_TIMESTAMP } from './merged-stars-data';

/**
 * CUGA Agent Analytics Dashboard
 * * Data Sources:
 * 1. GitHub Traffic: Manually transcribed from provided screenshots (Oct 30 - Dec 09).
 * 2. Stars: Based on uploaded CSV 'star-history-20251211.csv' + current count (237).
 * 3. PyPI: Version-specific download data aggregated by date from provided CSV.
 */

// --- Configuration ---
const PROJECT_RELEASE_DATE = new Date('2024-09-11');

function getDateFromTrafficData(trafficData: Array<{ date: string }>, isLast: boolean = false): Date {
  if (trafficData.length === 0) {
    return isLast ? new Date() : new Date('2024-10-30');
  }
  
  const targetEntry = isLast ? trafficData[trafficData.length - 1] : trafficData[0];
  const [month, day] = targetEntry.date.split('/').map(Number);
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();
  
  if (isLast) {
    let year = currentYear;
    if (month > currentMonth || (month === currentMonth && day > currentDay)) {
      year = currentYear - 1;
    }
    return new Date(year, month - 1, day);
  } else {
    return new Date(2024, month - 1, day);
  }
}


// --- Hardcoded Data (before Gap Bridge) ---
const HARDCODED_TRAFFIC_DATA = [
  // Period 1: Oct 30 - Nov 11
  { date: '10/30', clones: 7, uniqueCloners: 7, views: 283, uniqueVisitors: 95 },
  { date: '10/31', clones: 14, uniqueCloners: 10, views: 200, uniqueVisitors: 80 }, // Interpolated
  { date: '11/01', clones: 3, uniqueCloners: 2, views: 79, uniqueVisitors: 32 },
  { date: '11/02', clones: 2, uniqueCloners: 2, views: 107, uniqueVisitors: 38 },
  { date: '11/03', clones: 4, uniqueCloners: 4, views: 301, uniqueVisitors: 81 },
  { date: '11/04', clones: 20, uniqueCloners: 10, views: 697, uniqueVisitors: 108 },
  { date: '11/05', clones: 30, uniqueCloners: 12, views: 610, uniqueVisitors: 131 },
  { date: '11/06', clones: 39, uniqueCloners: 11, views: 387, uniqueVisitors: 84 },
  { date: '11/07', clones: 10, uniqueCloners: 6, views: 280, uniqueVisitors: 61 },
  { date: '11/08', clones: 70, uniqueCloners: 3, views: 149, uniqueVisitors: 31 },
  { date: '11/09', clones: 38, uniqueCloners: 16, views: 137, uniqueVisitors: 29 },
  { date: '11/10', clones: 10, uniqueCloners: 8, views: 363, uniqueVisitors: 85 },
  { date: '11/11', clones: 50, uniqueCloners: 24, views: 481, uniqueVisitors: 55 },
  
  // Period 2: Nov 12 - Nov 24
  { date: '11/12', clones: 26, uniqueCloners: 16, views: 468, uniqueVisitors: 50 },
  { date: '11/13', clones: 48, uniqueCloners: 26, views: 280, uniqueVisitors: 45 },
  { date: '11/14', clones: 49, uniqueCloners: 23, views: 230, uniqueVisitors: 55 },
  { date: '11/15', clones: 13, uniqueCloners: 7, views: 117, uniqueVisitors: 15 },
  { date: '11/16', clones: 24, uniqueCloners: 11, views: 160, uniqueVisitors: 23 },
  { date: '11/17', clones: 13, uniqueCloners: 7, views: 370, uniqueVisitors: 55 },
  { date: '11/18', clones: 27, uniqueCloners: 14, views: 150, uniqueVisitors: 48 },
  { date: '11/19', clones: 17, uniqueCloners: 8, views: 260, uniqueVisitors: 63 },
  { date: '11/20', clones: 47, uniqueCloners: 30, views: 220, uniqueVisitors: 43 },
  { date: '11/21', clones: 10, uniqueCloners: 7, views: 230, uniqueVisitors: 50 },
  { date: '11/22', clones: 14, uniqueCloners: 7, views: 100, uniqueVisitors: 28 },
  { date: '11/23', clones: 6, uniqueCloners: 3, views: 280, uniqueVisitors: 48 },
  { date: '11/24', clones: 13, uniqueCloners: 6, views: 140, uniqueVisitors: 45 },

  // Gap Bridge
  { date: '11/25', clones: 8, uniqueCloners: 4, views: 120, uniqueVisitors: 40 },
  { date: '11/26', clones: 6, uniqueCloners: 4, views: 90, uniqueVisitors: 35 },

];

// Hardcoded Star History Data (before archive data starts)
const HARDCODED_STARS_DATA = [
  { date: '09/10', stars: 0 },
  { date: '09/11', stars: 1 },
  { date: '10/06', stars: 16 },
  { date: '10/15', stars: 31 },
  { date: '10/16', stars: 46 },
  { date: '10/18', stars: 61 },
  { date: '10/22', stars: 76 },
  { date: '10/23', stars: 91 },
  { date: '10/24', stars: 106 },
  { date: '11/05', stars: 145 },
  { date: '11/15', stars: 180 },
  { date: '11/25', stars: 210 },
  { date: '12/04', stars: 211 },
  { date: '12/05', stars: 226 },
  { date: '12/11', stars: 237 },
];

// PyPI Downloads by Date - Aggregated from version-specific download data
const PYPI_DATA = [
  { date: '2025-09-07', downloads: 15 },
  { date: '2025-09-14', downloads: 108 },
  { date: '2025-09-21', downloads: 4 },
  { date: '2025-09-28', downloads: 21 },
  { date: '2025-10-05', downloads: 18 },
  { date: '2025-10-12', downloads: 3470 },
  { date: '2025-10-19', downloads: 8205 },
  { date: '2025-10-26', downloads: 10736 },
  { date: '2025-11-02', downloads: 8769 },
  { date: '2025-11-09', downloads: 15738 },
  { date: '2025-11-16', downloads: 14263 },
  { date: '2025-11-23', downloads: 16614 },
];

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

const CustomTooltip = ({ active, payload, label }) => {
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

export default function App() {
  const [activeTab, setActiveTab] = useState('stars');

  const TRAFFIC_DATA = useMemo(() => {
    const gapBridgeEndDate = '11/26';
    const hardcodedEndIndex = HARDCODED_TRAFFIC_DATA.findIndex(d => d.date === gapBridgeEndDate);
    const hardcodedUpToGap = HARDCODED_TRAFFIC_DATA.slice(0, hardcodedEndIndex + 1);
    
    const archiveDataAfterGap = MERGED_ARCHIVE_DATA.filter(d => {
      const [month, day] = d.date.split('/').map(Number);
      const [gapMonth, gapDay] = gapBridgeEndDate.split('/').map(Number);
      return month > gapMonth || (month === gapMonth && day > gapDay);
    });

    return [...hardcodedUpToGap, ...archiveDataAfterGap];
  }, []);

  const STARS_DATA = useMemo(() => {
    const hardcodedEndDate = '12/11';
    const hardcodedEndIndex = HARDCODED_STARS_DATA.findIndex(d => d.date === hardcodedEndDate);
    const hardcodedUpToEnd = HARDCODED_STARS_DATA.slice(0, hardcodedEndIndex + 1);
    
    const archiveDataAfterEnd = MERGED_STARS_DATA.filter(d => {
      const [month, day] = d.date.split('/').map(Number);
      const [endMonth, endDay] = hardcodedEndDate.split('/').map(Number);
      return month > endMonth || (month === endMonth && day > endDay);
    });

    return [...hardcodedUpToEnd, ...archiveDataAfterEnd];
  }, []);

  const CURRENT_DATE = useMemo(() => getDateFromTrafficData(TRAFFIC_DATA, true), [TRAFFIC_DATA]);
  const DATA_START_DATE = useMemo(() => getDateFromTrafficData(TRAFFIC_DATA, false), [TRAFFIC_DATA]);
  
  const LAST_UPDATED = useMemo(() => {
    const trafficTimestamp = LAST_UPDATED_TIMESTAMP || null;
    const starsTimestamp = LAST_UPDATED_STARS_TIMESTAMP || null;
    
    if (trafficTimestamp && starsTimestamp) {
      return new Date(trafficTimestamp) > new Date(starsTimestamp) 
        ? new Date(trafficTimestamp) 
        : new Date(starsTimestamp);
    }
    if (trafficTimestamp) return new Date(trafficTimestamp);
    if (starsTimestamp) return new Date(starsTimestamp);
    return CURRENT_DATE;
  }, [CURRENT_DATE]);

  // Calculate days since data collection started
  const daysSinceDataStart = useMemo(() => {
    const diffTime = CURRENT_DATE.getTime() - DATA_START_DATE.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [CURRENT_DATE, DATA_START_DATE]);

  // Calculate totals for cards
  const totalClones = useMemo(() => TRAFFIC_DATA.reduce((acc, curr) => acc + curr.clones, 0), [TRAFFIC_DATA]);
  const totalUniqueCloners = useMemo(() => TRAFFIC_DATA.reduce((acc, curr) => acc + curr.uniqueCloners, 0), [TRAFFIC_DATA]);
  const totalViews = useMemo(() => TRAFFIC_DATA.reduce((acc, curr) => acc + curr.views, 0), [TRAFFIC_DATA]);
  const totalUniqueVisitors = useMemo(() => TRAFFIC_DATA.reduce((acc, curr) => acc + curr.uniqueVisitors, 0), [TRAFFIC_DATA]);

  // Calculate last 7 days metrics
  const last7Days = useMemo(() => TRAFFIC_DATA.slice(-7), []);
  const last7DaysClones = useMemo(() => last7Days.reduce((acc, curr) => acc + curr.clones, 0), [last7Days]);
  const last7DaysUniqueCloners = useMemo(() => last7Days.reduce((acc, curr) => acc + curr.uniqueCloners, 0), [last7Days]);
  const last7DaysViews = useMemo(() => last7Days.reduce((acc, curr) => acc + curr.views, 0), [last7Days]);
  const last7DaysUniqueVisitors = useMemo(() => last7Days.reduce((acc, curr) => acc + curr.uniqueVisitors, 0), [last7Days]);
  const last7DaysStars = useMemo(() => {
    if (STARS_DATA.length === 0) return 0;
    const currentStars = STARS_DATA[STARS_DATA.length - 1]?.stars || 237;
    const sevenDaysAgo = new Date(CURRENT_DATE);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoMonth = String(sevenDaysAgo.getMonth() + 1).padStart(2, '0');
    const sevenDaysAgoDay = String(sevenDaysAgo.getDate()).padStart(2, '0');
    const sevenDaysAgoDate = `${sevenDaysAgoMonth}/${sevenDaysAgoDay}`;
    
    const sevenDaysAgoEntry = STARS_DATA.find(d => d.date === sevenDaysAgoDate);
    if (!sevenDaysAgoEntry && STARS_DATA.length > 0) {
      const sortedData = [...STARS_DATA].sort((a, b) => {
        const [aMonth, aDay] = a.date.split('/').map(Number);
        const [bMonth, bDay] = b.date.split('/').map(Number);
        const [targetMonth, targetDay] = sevenDaysAgoDate.split('/').map(Number);
        const aDiff = Math.abs((aMonth * 100 + aDay) - (targetMonth * 100 + targetDay));
        const bDiff = Math.abs((bMonth * 100 + bDay) - (targetMonth * 100 + targetDay));
        return aDiff - bDiff;
      });
      const sevenDaysAgoStars = sortedData[0]?.stars || currentStars;
      return Math.max(0, currentStars - sevenDaysAgoStars);
    }
    const sevenDaysAgoStars = sevenDaysAgoEntry?.stars || currentStars;
    return Math.max(0, currentStars - sevenDaysAgoStars);
  }, [STARS_DATA, CURRENT_DATE]);
  const last7DaysPyPI = useMemo(() => {
    const sortedPyPI = [...PYPI_DATA].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sortedPyPI[0]?.downloads || 0;
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-[#58a6ff] selection:text-white pb-20">
      
      {/* Navbar */}
      <nav className="border-b border-[#30363d] bg-[#161b22]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#238636] to-[#2ea043] rounded-md flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <span className="font-bold text-xl tracking-tight text-[#f0f6fc]">CUGA <span className="text-[#8b949e] font-normal">Analytics</span></span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href="https://github.com/cuga-project/cuga-agent" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#58a6ff] transition-colors">
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a href="https://pypi.org/project/cuga/" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#58a6ff] transition-colors">
              <Package className="w-4 h-4" />
              <span>PyPI</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <h1 className="text-3xl font-bold text-[#f0f6fc]">Project Overview</h1>
            <div className="flex items-center gap-2 text-sm text-[#8b949e]">
              <Activity className="w-4 h-4" />
              <span>Last updated: <span className="text-[#f0f6fc] font-medium">{LAST_UPDATED.toLocaleString(undefined, { 
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

        {/* Key Metrics Grid */}
        <div className="space-y-6 mb-8">
          {/* Stars Section */}
          <div>
            <h3 className="text-sm font-medium text-[#8b949e] mb-3 flex items-center gap-2">
              <Star className="w-4 h-4" />
              GitHub Stars
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatCard 
                title="Total Stars" 
                value={STARS_DATA.length > 0 ? STARS_DATA[STARS_DATA.length - 1]?.stars?.toLocaleString() || "237" : "237"} 
                subtext={`+${last7DaysStars} last 7 days`}
                trend="up"
                icon={Star} 
              />
            </div>
          </div>

          {/* Clones Section */}
          <div>
            <h3 className="text-sm font-medium text-[#8b949e] mb-3 flex items-center gap-2">
              <GitPullRequest className="w-4 h-4" />
              Repository Clones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatCard 
                title="Total Clones" 
                value={totalClones.toLocaleString()} 
                subtext={`+${last7DaysClones} last 7 days`}
                trend="up"
                icon={GitPullRequest} 
              />
              <StatCard 
                title="Unique Cloners" 
                value={totalUniqueCloners} 
                subtext={`+${last7DaysUniqueCloners} last 7 days`}
                trend="up"
                icon={Users} 
              />
            </div>
          </div>

          {/* Views Section */}
          <div>
            <h3 className="text-sm font-medium text-[#8b949e] mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Repository Views
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatCard 
                title="Total Views" 
                value={totalViews.toLocaleString()} 
                subtext={`+${last7DaysViews} last 7 days`}
                trend="up"
                icon={Eye} 
              />
              <StatCard 
                title="Unique Visitors" 
                value={totalUniqueVisitors} 
                subtext={`+${last7DaysUniqueVisitors} last 7 days`}
                trend="up"
                icon={Users} 
              />
            </div>
          </div>

          {/* PyPI Section */}
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
        </div>

        {/* Tab Navigation */}
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
                Note: GitHub traffic data collected only from <span className="text-[#f0f6fc]">Oct 30</span> ({daysSinceDataStart} days), but CUGA was released on <span className="text-[#f0f6fc]">Sep 11</span>.
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
                  <AreaChart data={TRAFFIC_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                    <Tooltip content={<CustomTooltip />} />
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
                  <AreaChart data={TRAFFIC_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                    <Tooltip content={<CustomTooltip />} />
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
                    href="https://www.star-history.com/#cuga-project/cuga-agent&type=date&legend=top-left" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center text-xs text-[#58a6ff] hover:underline"
                  >
                    View on Star History <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-2xl font-bold text-[#f0f6fc]">{STARS_DATA.length > 0 ? STARS_DATA[STARS_DATA.length - 1]?.stars || 237 : 237}</div>
                  <div className="text-xs text-[#8b949e]">Current Stars</div>
                </div>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={STARS_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                    <Tooltip content={<CustomTooltip />} />
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
                    Daily downloads aggregated by Python version for <code className="bg-[#21262d] px-1 py-0.5 rounded text-[#f0f6fc]">cuga</code> package
                  </p>
                </div>
                <a 
                  href="https://clickpy.clickhouse.com/dashboard/cuga" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center text-xs text-[#58a6ff] hover:underline"
                >
                  View on ClickPy <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
              
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PYPI_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                    <Tooltip content={<CustomTooltip />} />
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
                 pip install cuga
               </code>
               <p className="text-xs text-[#8b949e] mt-4">
                  Latest version: <span className="text-[#f0f6fc]">0.1.11</span>
               </p>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center text-[#484f58] text-sm py-8 border-t border-[#30363d] mt-8">
        <p>Generated for CUGA Agent Open Source Repository</p>
      </footer>
    </div>
  );
}