# AgentToolkit Repository Stats

Analytics dashboard for the AgentToolkit organization, displaying GitHub traffic, stars, and PyPI download statistics for selected repositories.

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Traffic Data Collection

### Setup

To collect GitHub traffic data, you need to set up authentication:

#### 1. Create a Personal Access Token (PAT)

**Important**: Traffic data requires push access or admin/maintain role on the repository.

**Option A: Classic Token (Recommended for simplicity)**

1. Go to [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Configure the token:
   - **Note**: Agent Toolkit Repository Stats Traffic Data
   - **Expiration**: Set according to your preference (recommended: 90 days or 1 year)
   - **Scopes**: Select **`repo`** (Full control of private repositories)
4. Click "Generate token" and copy the token (you won't see it again!)

**Option B: Fine-grained Token**

1. Go to [GitHub Settings > Developer settings > Personal access tokens > Fine-grained tokens](https://github.com/settings/tokens?type=beta)
2. Click "Generate new token"
3. Configure the token:
   - **Name**: Agent Toolkit Repository Stats Traffic Data
   - **Expiration**: Set according to your preference (recommended: 90 days or 1 year)
   - **Repository access**: Select "Only select repositories" and choose the repositories you would like to collect data for
   - **Permissions**:
     - Repository permissions:
       - **Administration**: Read-only (required for traffic data)
       - **Contents**: Read and write (if you want to commit data back)
       - **Metadata**: Read-only (automatically included)
     - Account permissions: None needed
4. Click "Generate token" and copy the token (you won't see it again!)

**Note**: You must have admin or maintain role on the selected repositories for the token to access traffic data.

#### 2. Configure the Token

**For Local Development:**

```bash
# Install dependencies
python -m venv .venv
source .venv/bin/activate
pip install requests

# Set your token as an environment variable
export GITHUB_TOKEN=your_personal_access_token_here
```

**For GitHub Actions:**

1. Go to your repository settings: `https://github.com/AgentToolkit/repository-stats/settings/secrets/actions`
2. Click "New repository secret"
3. Name: `TRAFFIC_DATA_TOKEN`
4. Value: Paste your PAT
5. Click "Add secret"

### Usage

**Manual Collection:**

For each selected repository run:

```bash
# Download traffic data for cuga-agent repository
python download_traffic.py --repo <repository_org>/<repository_name> --output-dir traffic_data_latest

# Or specify token directly (not recommended for scripts)
python download_traffic.py --repo <repository_org>/<repository_name> --output-dir traffic_data_latest --token <your_github_pat>
```

**Automated Collection:**

The workflow runs automatically every Sunday at midnight UTC via GitHub Actions. You can also trigger it manually:

1. Go to [Actions > Fetch Traffic Data](https://github.com/AgentToolkit/repository-stats/actions/workflows/fetch-traffic-data.yml)
2. Click "Run workflow"

### Troubleshooting

**Error: "403 Forbidden"**

This means the GitHub token doesn't have sufficient permissions. Traffic data requires special access:

1. **Check your repository role**: You need admin or maintain role on all of the selected repositories
2. **Check token permissions**:
   - Classic token: Must have **`repo`** scope
   - Fine-grained token: Must have **Administration: Read** permission
3. **Environment variable**: Make sure `GITHUB_TOKEN` or `GH_TOKEN` is set correctly
4. **For GitHub Actions**: Use a PAT as a repository secret named `TRAFFIC_DATA_TOKEN`

**Error: "404 Not Found"**

- Verify the repository name is correct (i.e. organization/repository_name)
- Make sure your token has access to the repository

**Why do I need admin access?**

GitHub's traffic endpoints are only accessible to repository administrators or maintainers. This is by design to protect repository analytics data. If you're getting 403 errors, ask a repository admin to:
- Add you as a collaborator with maintain or admin role, OR
- Generate a PAT with admin access and share it securely (e.g., via repository secrets)

**Note**: The default `GITHUB_TOKEN` provided by GitHub Actions doesn't have permission to access traffic data endpoints from other repositories. You must use a PAT.

## Deployment

This site is automatically deployed to GitHub Pages when pushing to the `main` branch.

Live site: https://AgentToolkit.github.io/cuga-stats/

