# GitHub Pulse

Trending, most-starred and category-wise public repositories on GitHub, in one clean interface. Data is fetched live from the GitHub API. No backend, no database, no login.

## Features

- Trending: Today, This week, This month, This year, All time
- Most Starred repositories
- Categories: AI/ML, Web, Mobile, DevOps, Security, Data, Games, Blockchain, Tools, Backend
- Search whole GitHub with recent search history
- Language filter and sort by stars, forks, updated, issues
- Repo details: stars, forks, languages, contributors, README, clone URL
- Top Developers
- Saved repositories (bookmarks)
- Dark mode, shareable view links, auto-refresh every 5 minutes

## Run locally

```bash
python -m http.server 8000
```

Open http://localhost:8000

## Deploy on GitHub Pages

1. Push this repo to GitHub (branch: `main`)
2. Settings > Pages
3. Source: `Deploy from a branch`, Branch: `main`, folder: `/ (root)`
4. Live at: `https://YOUR-USERNAME.github.io/REPO-NAME/`

## GitHub token (optional)

Without a token the API limit is 10 search requests per minute. Add a free token using the Token button in the app to increase it. The token stays in your browser only.

## Structure

```
github-pulse/
├── index.html
├── css/style.css
├── js/app.js
├── README.md
```
