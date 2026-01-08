#!/usr/bin/env python3
"""
Download GitHub repository traffic data using GitHub REST API.

This script downloads traffic data for the last 14 days and saves it in a
timestamped folder. Each retrieval captures the last 14 days of data, so
timestamping helps track when each snapshot was taken.
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import cast

try:
    import requests
except ImportError:
    print("❌ Error: requests library not found. Install with: pip install requests")
    sys.exit(1)


def get_github_token() -> str:
    """Get GitHub token from environment variable."""
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if not token:
        print("❌ Error: GitHub token not found.")
        print("   Set GITHUB_TOKEN or GH_TOKEN environment variable with a PAT.")
        print("\n   Required permissions:")
        print("   - Classic token: 'repo' scope (full control of private repositories)")
        print("   - Fine-grained token: 'Repository access' to target repo + 'Contents: Read' permission")
        print("\n   Note: Traffic data requires push access or admin/maintain role on the repository.")
        sys.exit(1)
    return token


def verify_token_permissions(token: str, owner: str, repo: str) -> bool:
    """Verify that the token has access to the repository."""
    base_url = "https://api.github.com"
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    
    try:
        response = requests.get(f"{base_url}/repos/{owner}/{repo}", headers=headers, timeout=30)
        if response.status_code == 200:
            repo_data = response.json()
            permissions = repo_data.get("permissions", {})
            has_push = permissions.get("push", False)
            has_admin = permissions.get("admin", False)
            
            print(f"🔑 Token permissions for {owner}/{repo}:")
            print(f"   - Push: {'✅' if has_push else '❌'}")
            print(f"   - Admin: {'✅' if has_admin else '❌'}")
            
            if not (has_push or has_admin):
                print(f"\n⚠️  Warning: Traffic data requires push or admin access.")
                print(f"   Your token only has read access to this repository.")
                return False
            return True
        elif response.status_code == 404:
            print(f"❌ Repository {owner}/{repo} not found or token has no access")
            return False
        else:
            print(f"⚠️  Could not verify token permissions: HTTP {response.status_code}")
            return True
    except requests.exceptions.RequestException as e:
        print(f"⚠️  Could not verify token permissions: {e}")
        return True


def download_traffic_data(owner: str, repo: str, output_dir: Path, token: str) -> dict:
    """Download all traffic data endpoints using GitHub REST API."""
    base_url = "https://api.github.com"
    
    endpoints = {
        "views": f"repos/{owner}/{repo}/traffic/views",
        "clones": f"repos/{owner}/{repo}/traffic/clones",
        "popular_paths": f"repos/{owner}/{repo}/traffic/popular/paths",
        "popular_referrers": f"repos/{owner}/{repo}/traffic/popular/referrers",
    }

    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    results = {}

    for key, endpoint in endpoints.items():
        output_file = output_dir / f"{repo.replace("-", "_")}_traffic_{key}.json"
        print(f"📥 Downloading {key}...")

        try:
            url = f"{base_url}/{endpoint}"
            response = requests.get(url, headers=headers, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                results[key] = data

                with open(output_file, "w") as f:
                    json.dump(data, f, indent=2)

                print(f"   ✅ Saved to {output_file.name}")
            elif response.status_code == 403:
                print(f"   ⚠️  Failed to download {key}: 403 Forbidden")
                print(f"      Traffic data requires push access or admin/maintain role on {owner}/{repo}")
                print(f"      If using fine-grained token: Add 'Administration: Read' permission")
                print(f"      If using classic token: Ensure 'repo' scope is enabled")
                results[key] = None
            elif response.status_code == 404:
                print(f"   ⚠️  Failed to download {key}: 404 Not Found")
                print(f"      Repository {owner}/{repo} not found or no access")
                results[key] = None
            else:
                print(f"   ⚠️  Failed to download {key}: HTTP {response.status_code}")
                print(f"      {response.text}")
                results[key] = None
                
        except requests.exceptions.RequestException as e:
            print(f"   ⚠️  Failed to download {key}: {e}")
            results[key] = None
        except json.JSONDecodeError as e:
            print(f"   ⚠️  Invalid JSON response for {key}: {e}")
            results[key] = None

    return results


def create_summary(data: dict, output_dir: Path) -> None:
    """Create a summary markdown file with traffic statistics."""
    repo_name = cast(str, data.get("repository")).replace("-", "_")

    summary_file = output_dir / f"{repo_name}_summary.md"
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")

    results: dict = cast(dict, data.get("results"))
    with open(summary_file, "w") as f:
        f.write(f"# GitHub Traffic Data Summary\n\n")
        f.write(f"**Retrieved:** {timestamp}\n")
        f.write(f"**Data Period:** Last 14 days (as of retrieval time)\n\n")
        f.write("---\n\n")

        if results.get("views"):
            views_data = results["views"]
            f.write("## Page Views\n\n")
            f.write(f"- **Total Views:** {views_data.get('count', 0):,}\n")
            f.write(f"- **Total Unique Visitors:** {views_data.get('uniques', 0):,}\n")
            if views_data.get("views"):
                daily_views = views_data["views"]
                f.write(f"- **Days Tracked:** {len(daily_views)}\n")
                if daily_views:
                    peak_day = max(daily_views, key=lambda x: x.get("count", 0))
                    f.write(f"- **Peak Day:** {peak_day.get('timestamp', 'N/A')} ({peak_day.get('count', 0):,} views)\n")
            f.write("\n")

        if results.get("clones"):
            clones_data = results["clones"]
            f.write("## Repository Clones\n\n")
            f.write(f"- **Total Clones:** {clones_data.get('count', 0):,}\n")
            f.write(f"- **Total Unique Cloners:** {clones_data.get('uniques', 0):,}\n")
            if clones_data.get("clones"):
                daily_clones = clones_data["clones"]
                f.write(f"- **Days Tracked:** {len(daily_clones)}\n")
                if daily_clones:
                    peak_day = max(daily_clones, key=lambda x: x.get("count", 0))
                    f.write(f"- **Peak Day:** {peak_day.get('timestamp', 'N/A')} ({peak_day.get('count', 0):,} clones)\n")
            f.write("\n")

        if results.get("popular_paths"):
            paths_data = results["popular_paths"]
            if isinstance(paths_data, list) and paths_data:
                f.write("## Popular Paths\n\n")
                for i, path in enumerate(paths_data[:10], 1):
                    f.write(f"{i}. `{path.get('path', 'N/A')}` - {path.get('title', 'N/A')}\n")
                    f.write(f"   - Views: {path.get('count', 0):,} | Uniques: {path.get('uniques', 0):,}\n")
                f.write("\n")

        if results.get("popular_referrers"):
            referrers_data = results["popular_referrers"]
            if isinstance(referrers_data, list) and referrers_data:
                f.write("## Popular Referrers\n\n")
                for i, ref in enumerate(referrers_data[:10], 1):
                    f.write(f"{i}. `{ref.get('referrer', 'N/A')}`\n")
                    f.write(f"   - Views: {ref.get('count', 0):,} | Uniques: {ref.get('uniques', 0):,}\n")
                f.write("\n")

    print(f"📄 Summary saved to {summary_file.name}")


def main():
    """Main function to download traffic data."""
    import argparse

    parser = argparse.ArgumentParser(
        description="Download GitHub repository traffic data using GitHub REST API"
    )
    parser.add_argument(
        "--repo",
        required=True,
        help="Repository in format 'owner/repo' (e.g., 'AgentToolkit/agent-lifecycle-toolkit')",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=None,
        help="Output directory (default: traffic_data_YYYYMMDD_HHMMSS)",
    )
    parser.add_argument(
        "--token",
        default=None,
        help="GitHub Personal Access Token (or use GITHUB_TOKEN/GH_TOKEN env var)",
    )
    args = parser.parse_args()

    print("🚀 GitHub Traffic Data Downloader\n")

    if "/" not in args.repo:
        print(f"❌ Error: --repo must be in format 'owner/repo'")
        sys.exit(1)
    
    owner, repo = args.repo.split("/", 1)
    print(f"📦 Repository: {owner}/{repo}")

    token = args.token or get_github_token()
    
    print()
    verify_token_permissions(token, owner, repo)
    print()

    if args.output_dir:
        output_dir = Path(args.output_dir)
    else:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_dir = Path.cwd() / f"traffic_data_{timestamp}"

    output_dir.mkdir(parents=True, exist_ok=True)
    print(f"📁 Output directory: {output_dir}\n")

    data = {
        "repository": repo,
        "results": download_traffic_data(owner, repo, output_dir, token)
    }

    create_summary(data, output_dir)

    print(f"\n✅ Traffic data downloaded successfully!")
    print(f"📂 All files saved to: {output_dir}")


if __name__ == "__main__":
    main()
