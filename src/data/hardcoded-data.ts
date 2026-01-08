import { PypiData } from "../types/pypi-data";
import { StarsData } from "../types/stars-data";
import { TrafficData } from "../types/traffic-data";

const HARDCODED_STARS_DATA: {[key: string]: StarsData[]} = {
  "agent-lifecycle-toolkit": [
    { date: '09/10', stars: 0 },
    { date: '09/11', stars: 0 },
    { date: '10/06', stars: 0 },
    { date: '10/15', stars: 0 },
    { date: '10/16', stars: 0 },
    { date: '10/18', stars: 0 },
    { date: '10/22', stars: 0 },
    { date: '10/23', stars: 0 },
    { date: '10/24', stars: 0 },
    { date: '11/05', stars: 0 },
    { date: '11/15', stars: 0 },
    { date: '11/25', stars: 0 },
    { date: '12/04', stars: 0 },
    { date: '12/05', stars: 0 },
    { date: '12/11', stars: 0 },
    { date: '12/12', stars: 0 },
    { date: '12/13', stars: 0 },
    { date: '12/14', stars: 0 },
    { date: '12/15', stars: 0 },
    { date: '12/16', stars: 0 },
    { date: '12/17', stars: 90 },
  ],
  "agent-analytics": [
    { date: '12/23', stars: 10 }
  ]
};

// --- Hardcoded Data (before Gap Bridge) ---
const HARDCODED_TRAFFIC_DATA: {[key: string]: TrafficData[]} = {
  "agent-lifecycle-toolkit": [],
  "agent-analytics": [],
  "kaizen": [],
  "toolguard": []
};

const PYPI_DATA: {[key: string]: PypiData[]} = {
  "agent-lifecycle-toolkit": [],
  "agent-analytics": [],
  "kaizen": [],
  "toolguard": []
}

export { HARDCODED_STARS_DATA, HARDCODED_TRAFFIC_DATA, PYPI_DATA };