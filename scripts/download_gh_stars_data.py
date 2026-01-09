#!/usr/bin/env python3
"""
Download GitHub repository stars data using GitHub REST API.

This script downloads the current star count and saves it in a
timestamped folder. Each retrieval captures the current star count,
so timestamping helps track when each snapshot was taken.
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
        print("   - Classic token: 'public_repo' scope (for public repos)")
        print("   - Fine-grained token: 'Repository access' to target repo + 'Metadata: Read' permission")
        sys.exit(1)
    return token


def download_stars_data(owner: str, repo: str, output_dir: Path, token: str) -> dict | None:
    """Download stars data using GitHub REST API."""
    base_url = "https://api.github.com"
    
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    output_file = output_dir / f"{repo}_stars.json"
    print(f"📥 Downloading stars data...")

    try:
        url = f"{base_url}/repos/{owner}/{repo}"
        response = requests.get(url, headers=headers, timeout=30)
        
        if response.status_code == 200:
            repo_data = response.json()
            stars_count = repo_data.get("stargazers_count", 0)
            
            stars_data = {
                "count": stars_count,
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "repo": f"{owner}/{repo}",
                "full_name": repo_data.get("full_name", ""),
                "description": repo_data.get("description", ""),
            }

            with open(output_file, "w") as f:
                json.dump(stars_data, f, indent=2)

            print(f"   ✅ Saved to {output_file.name}")
            print(f"   ⭐ Current stars: {stars_count:,}")
            return stars_data
        elif response.status_code == 403:
            print(f"   ⚠️  Failed to download stars: 403 Forbidden")
            print(f"      Check token permissions for {owner}/{repo}")
            return None
        elif response.status_code == 404:
            print(f"   ⚠️  Failed to download stars: 404 Not Found")
            print(f"      Repository {owner}/{repo} not found or no access")
            return None
        else:
            print(f"   ⚠️  Failed to download stars: HTTP {response.status_code}")
            print(f"      {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"   ⚠️  Failed to download stars: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"   ⚠️  Invalid JSON response: {e}")
        return None


def create_summary(data: dict, output_dir: Path) -> None:
    """Create a summary markdown file with stars statistics."""
    repo_name = cast(str, data.get("repository"))

    summary_file = output_dir / f"{repo_name}_summary.md"
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")

    result = data.get("result", None)
    if not result:
        print("❌ Error: No stars data found.")
        return None

    with open(summary_file, "w") as f:
        f.write(f"# GitHub Stars Data Summary\n\n")
        f.write(f"**Retrieved:** {timestamp}\n")
        f.write(f"**Repository:** {result.get('repo', 'N/A')}\n\n")
        f.write("---\n\n")

        if result:
            f.write("## Stars\n\n")
            f.write(f"- **Current Stars:** {result.get('count', 0):,}\n")
            f.write(f"- **Timestamp:** {result.get('timestamp', 'N/A')}\n")
            f.write("\n")

    print(f"📄 Summary saved to {summary_file.name}")


def main():
    """Main function to download stars data."""
    import argparse

    parser = argparse.ArgumentParser(
        description="Download GitHub repository stars data using GitHub REST API"
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
        help="Output directory (default: stars_data_YYYYMMDD_HHMMSS)",
    )
    parser.add_argument(
        "--token",
        default=None,
        help="GitHub Personal Access Token (or use GITHUB_TOKEN/GH_TOKEN env var)",
    )
    args = parser.parse_args()

    print("🚀 GitHub Stars Data Downloader\n")

    if "/" not in args.repo:
        print(f"❌ Error: --repo must be in format 'owner/repo'")
        sys.exit(1)
    
    owner, repo = args.repo.split("/", 1)
    print(f"📦 Repository: {owner}/{repo}")

    token = args.token or get_github_token()
    print()

    if args.output_dir:
        output_dir = Path(args.output_dir)
    else:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_dir = Path.cwd() / f"stars_data_{timestamp}"

    output_dir.mkdir(parents=True, exist_ok=True)
    print(f"📁 Output directory: {output_dir}\n")

    data = {
        "repository": repo,
        "result": download_stars_data(owner, repo, output_dir, token)
    }

    if data:
        create_summary(data, output_dir)
        print(f"\n✅ Stars data downloaded successfully!")
        print(f"📂 All files saved to: {output_dir}")
    else:
        print(f"\n⚠️  Failed to download stars data")
        sys.exit(1)


if __name__ == "__main__":
    main()

