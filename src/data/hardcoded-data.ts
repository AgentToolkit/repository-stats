// Hardcoded Star History Data (before archive data starts)
const HARDCODED_STARS_DATA: any = {
  "agent-lifecycle-toolkit": [
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
  ],
};

// --- Hardcoded Data (before Gap Bridge) ---
const HARDCODED_TRAFFIC_DATA: any = {
  "agent-lifecycle-toolkit": [
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
  ],
};

// PyPI Downloads by Date - Aggregated from version-specific download data
const PYPI_DATA: any = {
  "agent-lifecycle-toolkit": [
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
  ],
}

export { HARDCODED_STARS_DATA, HARDCODED_TRAFFIC_DATA, PYPI_DATA };