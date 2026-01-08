import { PypiData } from "../types/pypi-data";
import { StarsData } from "../types/stars-data";
import { TrafficData } from "../types/traffic-data";

const HARDCODED_STARS_DATA: {[key: string]: StarsData[]} = {
  "agent-lifecycle-toolkit": [],
  "agent-analytics": [],
  "kaizen": [],
  "toolguard": []
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