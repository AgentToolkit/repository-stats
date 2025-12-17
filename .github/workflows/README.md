# GitHub Workflows

This directory contains GitHub Actions workflows for the CUGA Stats dashboard.

## Workflows

### 1. `deploy.yml` - Deploy to GitHub Pages

**Trigger**: Push to `main` branch

**Purpose**: Builds and deploys the React dashboard to GitHub Pages.

**Steps**:
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Build the application
5. Deploy to GitHub Pages

### 2. `fetch-traffic-data.yml` - Fetch Traffic Data

**Trigger**: 
- Scheduled: Every Sunday at midnight UTC
- Manual: via workflow_dispatch

**Purpose**: Downloads GitHub traffic data from `AgentToolkit/agent-lifecycle-toolkit` and commits it to this repository.

**Requirements**:
- Repository secret `TRAFFIC_DATA_TOKEN` with a GitHub PAT
- PAT must have:
  - Classic: `repo` scope
  - Fine-grained: `Administration: Read` permission on target repository
- User must have admin/maintain role on target repository

**Steps**:
1. Checkout code
2. Setup Python 3.11
3. Install Python dependencies (requests)
4. Download traffic data using REST API
5. Create timestamped backup
6. Commit and push changes

## Setting Up Traffic Data Collection

### Prerequisites

You need admin or maintain access to `AgentToolkit/agent-lifecycle-toolkit` to access traffic data.

### Create a Personal Access Token

1. Go to [GitHub Settings > Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Configure:
   - Note: `Agent Lifecycle Repository Stats Traffic Data`
   - Expiration: 90 days or 1 year
   - Scopes: Select **`repo`**
4. Copy the token

### Add Token to Repository

1. Go to repository settings: [Secrets and variables > Actions](https://github.com/AgentToolkit/repository-stats/settings/secrets/actions)
2. Click "New repository secret"
3. Name: `TRAFFIC_DATA_TOKEN`
4. Value: Paste your PAT
5. Click "Add secret"

## Running Workflows Manually

### Deploy to GitHub Pages

```bash
# Automatically triggered on push to main
git push origin main
```

### Fetch Traffic Data

1. Go to [Actions](https://github.com/AgentToolkit/repository-stats/actions)
2. Select "Fetch Traffic Data" workflow
3. Click "Run workflow"
4. Select branch and click "Run workflow"

## Troubleshooting

### Traffic Data Fetch Fails with 403

**Cause**: Token doesn't have sufficient permissions or user doesn't have admin access.

**Solution**:
1. Verify you have admin/maintain role on `AgentToolkit/agent-lifecycle-toolkit`
2. Verify token has `repo` scope (classic) or `Administration: Read` (fine-grained)
3. Regenerate token if needed and update the repository secret

### Deploy Fails

**Cause**: Build errors or GitHub Pages not enabled.

**Solution**:
1. Check workflow logs for build errors
2. Verify GitHub Pages is enabled in repository settings
3. Ensure base path in `vite.config.ts` matches repository name
