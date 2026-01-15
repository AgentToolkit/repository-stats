# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Overview

This is a React-based analytics dashboard for the AgentToolkit organization that displays GitHub traffic statistics, star history, and PyPI download metrics for selected repositories. The application is built with:

- **Frontend**: React 19 + TypeScript + Vite
- **Visualization**: Recharts for interactive charts
- **Styling**: Tailwind CSS (utility-first approach)
- **Data Collection**: Python scripts using GitHub REST API
- **Deployment**: GitHub Pages (automated via GitHub Actions)

### Architecture

The application follows a component-based architecture:
- **Pages**: `RepositoryStatsPage` - main page displaying all statistics
- **Sections**: Modular sections for different stat types (views, clones, stars, PyPI downloads)
- **Components**: Reusable UI components (Navbar, StatCard, TooltipContent)
- **Data Layer**: TypeScript files that import merged JSON data from archive directories

Data flow:
1. Python scripts fetch data from GitHub API → JSON files in `gh_traffic_data_latest/` and `gh_stars_data_latest/`
2. GitHub Actions archive data periodically to `*_archive/` directories
3. Node.js merge scripts combine archives → TypeScript data files in `src/data/`
4. React components consume the merged data for visualization

## Building and Running

### Prerequisites
```bash
# Node.js 20+ and npm
node --version  # Should be 20.x or higher

# For data collection scripts
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### Development
```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Data Collection

**Important**: Traffic data collection requires a GitHub Personal Access Token with:
- Classic token: `repo` scope
- Fine-grained token: `Administration: Read` permission on target repositories
- User must have admin or maintain role on the repositories

```bash
# Set up environment
export GITHUB_TOKEN=your_personal_access_token

# Download traffic data for a repository
python scripts/download_gh_traffic_data.py --repo AgentToolkit/agent-lifecycle-toolkit --output-dir gh_traffic_data_latest

# Download stars data
python scripts/download_gh_stars_data.py --repo AgentToolkit/agent-lifecycle-toolkit --output-dir gh_stars_data_latest

# Merge archived data into TypeScript files
npm run merge-traffic-data
npm run merge-stars-data
```

### Deployment

The site automatically deploys to GitHub Pages when:
- Pushing to `main` branch
- Data collection workflows complete successfully
- Daily at 00:05 UTC (scheduled)

Live site: https://AgentToolkit.github.io/repository-stats/

## Development Conventions

### Code Style
- **TypeScript**: Strict mode enabled, use explicit types
- **React**: Functional components with hooks (React 19)
- **Naming**: PascalCase for components, camelCase for functions/variables
- **File Organization**: Group by feature (components/, sections/, pages/, data/, types/)

### Adding New Repositories

To track a new repository:

1. Add entry to `src/data/repositories.ts`:
```typescript
{
  "name": "repository-name",
  "shortname": "Display Name",
  "pypi_package_name": "package-name", // or "" if not on PyPI
  "github_organization": "AgentToolkit",
  "github_repository_url": "",
  "version": "0.0.0"
}
```

2. Collect data for the new repository:
```bash
python scripts/download_gh_traffic_data.py --repo AgentToolkit/repository-name --output-dir gh_traffic_data_latest
python scripts/download_gh_stars_data.py --repo AgentToolkit/repository-name --output-dir gh_stars_data_latest
```

3. Rebuild merged data:
```bash
npm run merge-traffic-data
npm run merge-stars-data
```

### Data Structure

- **Traffic Data**: 14-day rolling window (views, clones, popular paths/referrers)
- **Stars Data**: Historical star count with timestamps
- **Archive Pattern**: `gh_*_data_archive/gh_*_data_YYYYMMDD_HHMMSS/`
- **Latest Data**: `gh_*_data_latest/` (overwritten on each collection)
- **Merged Data**: `src/data/merged-gh-*-data.ts` (generated from archives)

### GitHub Actions Workflows

- **deploy.yml**: Builds and deploys to GitHub Pages
- **fetch-gh-traffic-data.yml**: Collects traffic data weekly (Sundays at midnight UTC)
- **fetch-gh-stars-data.yml**: Collects stars data weekly (Sundays at midnight UTC)

All workflows use `TRAFFIC_DATA_TOKEN` secret for API authentication.

## Important Notes

- **Base Path**: Vite is configured with `base: "/repository-stats/"` for GitHub Pages deployment
- **Token Permissions**: Default `GITHUB_TOKEN` in Actions cannot access traffic data from other repos; use a PAT stored as `TRAFFIC_DATA_TOKEN` secret
- **Data Retention**: GitHub traffic API only provides last 14 days; archiving is essential for historical analysis
- **Rate Limits**: GitHub API has rate limits; scripts include error handling for 403/404 responses
- **Environment Variables**: Never commit tokens; use environment variables or GitHub secrets

## Troubleshooting

**403 Forbidden errors**: Token lacks required permissions or user doesn't have admin/maintain role on repository

**404 Not Found errors**: Repository name incorrect or token has no access

**Build failures**: Check that merged data files exist in `src/data/` - run merge scripts if missing

**Chart rendering issues**: Verify data format matches TypeScript interfaces in `src/types/`
