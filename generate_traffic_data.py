#!/usr/bin/env python3
"""
Generate traffic data list from GitHub API clone and view JSON responses.

Usage:
    python generate_traffic_data.py clones.json views.json

The script will output TypeScript-formatted traffic data entries.
"""

import json
import sys
from datetime import datetime
from typing import Dict, List


def parse_timestamp(timestamp: str) -> tuple[str, datetime]:
    """Parse ISO timestamp and return formatted date and datetime object."""
    dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
    formatted = dt.strftime('%m/%d')
    return formatted, dt


def load_json_data(filepath: str) -> dict:
    """Load JSON data from file."""
    with open(filepath, 'r') as f:
        return json.load(f)


def merge_traffic_data(clones_json: dict, views_json: dict) -> List[Dict]:
    """Merge clone and view data by date."""
    clones_by_date = {}
    for entry in clones_json.get('clones', []):
        date_str, dt = parse_timestamp(entry['timestamp'])
        clones_by_date[date_str] = {
            'date': date_str,
            'datetime': dt,
            'clones': entry['count'],
            'uniqueCloners': entry['uniques']
        }
    
    views_by_date = {}
    for entry in views_json.get('views', []):
        date_str, dt = parse_timestamp(entry['timestamp'])
        views_by_date[date_str] = {
            'date': date_str,
            'datetime': dt,
            'views': entry['count'],
            'uniqueVisitors': entry['uniques']
        }
    
    all_dates = set(clones_by_date.keys()) | set(views_by_date.keys())
    
    merged = []
    for date in sorted(all_dates, key=lambda d: clones_by_date.get(d, views_by_date.get(d))['datetime']):
        entry = {
            'date': date,
            'clones': clones_by_date.get(date, {}).get('clones', 0),
            'uniqueCloners': clones_by_date.get(date, {}).get('uniqueCloners', 0),
            'views': views_by_date.get(date, {}).get('views', 0),
            'uniqueVisitors': views_by_date.get(date, {}).get('uniqueVisitors', 0)
        }
        merged.append(entry)
    
    return merged


def format_typescript_output(traffic_data: List[Dict]) -> str:
    """Format traffic data as TypeScript array entries."""
    lines = []
    for entry in traffic_data:
        line = f"  {{ date: '{entry['date']}', clones: {entry['clones']}, uniqueCloners: {entry['uniqueCloners']}, views: {entry['views']}, uniqueVisitors: {entry['uniqueVisitors']} }},"
        lines.append(line)
    return '\n'.join(lines)


def main():
    if len(sys.argv) != 3:
        print("Usage: python generate_traffic_data.py clones.json views.json")
        print("\nOr pipe JSON directly:")
        print("  python generate_traffic_data.py")
        print("  Then paste clones JSON, press Ctrl+D")
        print("  Then paste views JSON, press Ctrl+D")
        sys.exit(1)
    
    clones_file = sys.argv[1]
    views_file = sys.argv[2]
    
    try:
        clones_data = load_json_data(clones_file)
        views_data = load_json_data(views_file)
    except FileNotFoundError as e:
        print(f"Error: {e}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        sys.exit(1)
    
    traffic_data = merge_traffic_data(clones_data, views_data)
    
    print("// Generated Traffic Data")
    print(format_typescript_output(traffic_data))
    
    total_clones = sum(e['clones'] for e in traffic_data)
    total_views = sum(e['views'] for e in traffic_data)
    print(f"\n// Summary:")
    print(f"// Total entries: {len(traffic_data)}")
    print(f"// Total clones: {total_clones}")
    print(f"// Total views: {total_views}")


if __name__ == '__main__':
    main()



