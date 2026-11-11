/* GitHub Pulse: Live GitHub API explorer (no build step, GitHub Pages ready) */
const API = "https://api.github.com";
const PER_PAGE = 30;
const AUTO_REFRESH_SECONDS = 300;

const CATEGORIES = [
  { id:"all", label:"All", topic:"" },
  { id:"ai", label:"AI / Machine Learning", topic:"machine-learning" },
  { id:"web", label:"Web Development", topic:"react" },
  { id:"mobile", label:"Mobile Development", topic:"flutter" },
  { id:"devops", label:"DevOps and Cloud", topic:"kubernetes" },
  { id:"security", label:"Security", topic:"security" },
  { id:"data", label:"Data Science", topic:"data-science" },
  { id:"game", label:"Game Development", topic:"game-development" },
  { id:"blockchain", label:"Blockchain and Web3", topic:"blockchain" },
  { id:"tools", label:"Developer Tools", topic:"cli" },
  { id:"backend", label:"Backend and APIs", topic:"rest-api" },
  { id:"opensource", label:"Open Source", topic:"open-source" }
];

const LANG_COLORS = {
  JavaScript:"#f1e05a", TypeScript:"#3178c6", Python:"#3572A5", Java:"#b07219",
  Go:"#00ADD8", Rust:"#dea584", "C++":"#f34b7d", C:"#555555", HTML:"#e34c26",
  CSS:"#563d7c", Dart:"#00B4AB", Kotlin:"#A97BFF", Swift:"#F05138", Ruby:"#701516",
  PHP:"#4F5D95", Shell:"#89e051", Vue:"#41b883", Lua:"#000080", R:"#198CE7",
  Scala:"#c22d40", Haskell:"#5e5086", Elixir:"#6e4a7e", Zig:"#ec915c", Unknown:"#999"
};

const I = {
  star: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  fork: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>',
  bookmark: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
  bookmarkFill: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
  clock: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  external: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  copy: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  users: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  box: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
  search: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  share: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>'
};

const state = {
  tab: "trending", range: "today", lang: "", category: "all",
  sort: "stars", query: "", page: 1, repos: [], total: 0,
  bookmarks: new Set(JSON.parse(localStorage.getItem("gp_bookmarks") || "[]")),
  recent: JSON.parse(localStorage.getItem("gp_recent") || "[]"),
  loading: false,
  autoLeft: AUTO_REFRESH_SECONDS
};

/* Helpers */
const $ = id => document.getElementById(id);
const fmt = n => n >= 1000000 ? (n/1000000).toFixed(1)+"M" : n >= 1000 ? (n/1000).toFixed(1)+"k" : String(n);
const esc = s => (s||"").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const timeAgo = d => {
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 3600) return Math.max(1, Math.floor(s/60)) + "m ago";
  if (s < 86400) return Math.floor(s/3600) + "h ago";
  if (s < 2592000) return Math.floor(s/86400) + "d ago";
  if (s < 31536000) return Math.floor(s/2592000) + "mo ago";
  return Math.floor(s/31536000) + "y ago";
};
const isNew = d => (Date.now() - new Date(d)) < 86400000;
const isActive = d => (Date.now() - new Date(d)) < 3600000;
function getToken(){ return localStorage.getItem("gp_token") || ""; }
function headers(){
  const h = { "Accept": "application/vnd.github+json" };
  const t = getToken(); if (t) h["Authorization"] = "Bearer " + t;
  return h;
}
function toast(msg){
  const t = $("toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(t._h); t._h = setTimeout(()=>t.classList.remove("show"), 2600);
}
function setStatus(msg, type, retry){
  const el = $("statusBar");
  el.innerHTML = "";
  if (msg){
    const span = document.createElement("span"); span.textContent = msg; el.appendChild(span);
    if (retry){
      const b = document.createElement("button");
      b.className = "btn btn-outline btn-sm"; b.textContent = "Retry";
      b.addEventListener("click", () => refreshCurrent());
      el.appendChild(b);
    }
  }
  el.className = "status-bar" + (type ? " " + type : "");
}
function dateForRange(r){
  const now = new Date();
  const days = { today:1, week:7, month:30, year:365 }[r] || 1;
  now.setDate(now.getDate() - days);
  return now.toISOString().slice(0,10);
}
function markUpdated(){
  $("statUpdated").textContent = new Date().toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });
}
function resetAutoTimer(){ state.autoLeft = AUTO_REFRESH_SECONDS; }

/* URL sync: shareable views */
function syncURL(){
  const p = new URLSearchParams();
  if (state.tab !== "trending") p.set("tab", state.tab);
  if (state.range !== "today") p.set("range", state.range);
  if (state.lang) p.set("lang", state.lang);
  if (state.sort !== "stars") p.set("sort", state.sort);
  if (state.category !== "all") p.set("cat", state.category);
  if (state.query) p.set("q", state.query);
  const qs = p.toString();
  history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
}
function readURL(){
  const p = new URLSearchParams(location.search);
  if (p.get("tab")) state.tab = p.get("tab");
  if (p.get("range")) state.range = p.get("range");
  if (p.get("lang")) state.lang = p.get("lang");
  if (p.get("sort")) state.sort = p.get("sort");
  if (p.get("cat")) state.category = p.get("cat");
  if (p.get("q")) state.query = p.get("q");
}
function applyStateToUI(){
  document.querySelectorAll(".nav-link").forEach(b => b.classList.toggle("active", b.dataset.tab === state.tab));
  document.querySelectorAll("#timePills .seg-btn").forEach(b => b.classList.toggle("active", b.dataset.range === state.range));
  $("langSelect").value = state.lang || "";
  $("sortSelect").value = state.sort || "stars";
  document.querySelectorAll("#categoryPills .chip").forEach(b => b.classList.toggle("active", b.dataset.cat === state.category));
  $("globalSearch").value = state.query || "";
  $("categoryRow").style.display = (state.tab === "categories") ? "flex" : "none";
  $("filtersBar").style.display = (state.tab === "bookmarks" || state.tab === "developers") ? "none" : "block";
  if (state.query){
    $("searchInfoRow").style.display = "flex";
    $("searchInfoText").textContent = '"' + state.query + '"';
  } else {
    $("searchInfoRow").style.display = "none";
  }
}

/* Rate limit */
async function checkRateLimit(){
  try{
    const r = await fetch(API + "/rate_limit", { headers: headers() });
    const j = await r.json();
    const s = j.resources && j.resources.search;
    if (s) $("rateLimit").textContent = "API: " + s.remaining + "/" + s.limit;
  }catch(e){ /* offline */ }
}

/* Query builder */
function buildQuery(){
  let q = "";
  const cat = CATEGORIES.find(c => c.id === state.category);
  if (state.query) {
    q = state.query;
  } else if (state.tab === "starred") {
    q = "stars:>1000";
  } else if (state.tab === "categories" && cat && cat.topic) {
    q = "topic:" + cat.topic + " stars:>500";
  } else {
    q = "created:>" + dateForRange(state.range) + " stars:>10";
  }
  if (state.lang) q += " language:" + state.lang;
  return q.trim();
}

/* Fetch repos: live from GitHub API */
async function fetchRepos(reset = true){
  if (state.loading) return;
  if (reset){ state.page = 1; state.repos = []; $("repoGrid").innerHTML = ""; }
  state.loading = true;
  if (reset) showSkeletons();
  setStatus("Loading live data from GitHub...");

  const q = encodeURIComponent(buildQuery());
  const url = `${API}/search/repositories?q=${q}&sort=${state.sort}&order=desc&per_page=${PER_PAGE}&page=${state.page}`;

  try{
    const res = await fetch(url, { headers: headers() });
    if (res.status === 403 || res.status === 429){
      throw new Error("GitHub API rate limit reached. Please wait a minute, or add a token using the Token button.");
    }
    if (!res.ok) throw new Error("GitHub API error (" + res.status + "). Please try again.");
    const data = await res.json();
    state.total = data.total_count || 0;
    state.repos = state.repos.concat(data.items || []);
    renderRepos();
    updateStats();
    markUpdated();
    resetAutoTimer();
    setStatus("");
    $("loadMoreBtn").style.display = (data.items && data.items.length === PER_PAGE) ? "inline-block" : "none";
    $("resultCount").textContent = state.total.toLocaleString("en-US") + " repositories";
    syncURL();
  }catch(err){
    setStatus(err.message, "error", true);
    if (state.repos.length === 0) $("repoGrid").innerHTML = "";
    $("loadMoreBtn").style.display = "none";
  }finally{
    state.loading = false;
    checkRateLimit();
  }
}

/* Fetch developers */
async function fetchDevelopers(){
  if (state.loading) return;
  state.loading = true;
  $("devGrid").style.display = "grid"; $("repoGrid").style.display = "none";
  $("devGrid").innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';
  setStatus("Loading top developers...");
  try{
    const q = encodeURIComponent("followers:>1000");
    const res = await fetch(`${API}/search/users?q=${q}&sort=followers&order=desc&per_page=${PER_PAGE}`, { headers: headers() });
    if (!res.ok) throw new Error("GitHub API error (" + res.status + ").");
    const data = await res.json();
    renderDevelopers(data.items || []);
    $("resultCount").textContent = (data.total_count||0).toLocaleString("en-US") + " developers";
    markUpdated();
    resetAutoTimer();
    setStatus("");
    syncURL();
  }catch(err){ setStatus(err.message, "error", true); $("devGrid").innerHTML = ""; }
  finally{ state.loading = false; checkRateLimit(); }
}

function refreshCurrent(){
  if (state.tab === "developers") fetchDevelopers();
  else if (state.tab !== "bookmarks") fetchRepos(true);
}

/* Render */
function showSkeletons(){
  $("repoGrid").innerHTML = Array.from({length:6}, ()=>'<div class="skeleton"></div>').join("");
}
function topicsHTML(topics){
  const list = topics || [];
  if (!list.length) return "";
  const shown = list.slice(0,3).map(t => `<span class="topic">${esc(t)}</span>`).join("");
  const extra = list.length > 3 ? `<span class="topic-more">+${list.length - 3} more</span>` : "";
  return `<div class="topics">${shown}${extra}</div>`;
}
function renderRepos(){
  const grid = $("repoGrid");
  grid.style.display = "grid"; $("devGrid").style.display = "none";
  grid.innerHTML = state.repos.map((r, i) => {
    const saved = state.bookmarks.has(r.full_name);
    const langColor = LANG_COLORS[r.language] || LANG_COLORS.Unknown;
    const badge = isNew(r.created_at)
      ? '<span class="pill-badge new">New</span>'
      : (isActive(r.updated_at) ? '<span class="pill-badge active-badge">Active</span>' : "");
    return `
    <article class="repo-card" onclick="openDetail('${esc(r.full_name)}')">
      <div class="card-top">
        <img class="avatar" src="${r.owner.avatar_url}" alt="${esc(r.owner.login)}" loading="lazy">
        <div class="card-title">
          <a href="${r.html_url}" target="_blank" rel="noopener" title="${esc(r.full_name)}" onclick="event.stopPropagation()">${esc(r.full_name)}</a>
          <div class="card-owner">${r.private ? "Private" : "Public"} · Updated ${timeAgo(r.updated_at)}</div>
        </div>
        <div class="card-badges">
          <span class="rank">#${i+1}</span>
          ${badge}
        </div>
        <button class="bookmark-btn ${saved ? "saved" : ""}" title="${saved ? "Remove from saved" : "Save for later"}" aria-label="Save repository" onclick="event.stopPropagation();toggleBookmark('${esc(r.full_name)}',this)">${saved ? I.bookmarkFill : I.bookmark}</button>
      </div>
      <p class="card-desc">${esc(r.description || "No description provided.")}</p>
      ${topicsHTML(r.topics)}
      <div class="card-meta">
        ${r.language ? `<span class="meta-item"><span class="lang-dot" style="background:${langColor}"></span>${esc(r.language)}</span>` : ""}
        <span class="meta-item">${I.star} ${fmt(r.stargazers_count)}</span>
        <span class="meta-item">${I.fork} ${fmt(r.forks_count)}</span>
        <span class="meta-item">${I.clock} ${timeAgo(r.updated_at)}</span>
      </div>
      <div class="card-actions">
        <a class="action-btn" href="${r.html_url}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${I.star} Star</a>
        <a class="action-btn" href="${r.html_url}/fork" target="_blank" rel="noopener" onclick="event.stopPropagation()">${I.fork} Fork</a>
        <span class="action-btn">Details ${I.external}</span>
      </div>
    </article>`;
  }).join("");
  $("emptyState").style.display = state.repos.length ? "none" : "block";
}
function renderDevelopers(users){
  $("devGrid").innerHTML = users.map((u, i) => `
    <article class="repo-card dev-card">
      <span class="rank">#${i+1}</span>
      <img class="avatar" src="${u.avatar_url}" alt="${esc(u.login)}" loading="lazy">
      <h3>${esc(u.login)}</h3>
      <span class="muted">${u.type || "User"}</span>
      <div class="card-meta" style="justify-content:center">
        <span class="meta-item">${I.users} ${fmt(u.followers || 0)} followers</span>
        <span class="meta-item">${I.box} ${fmt(u.public_repos || 0)} repositories</span>
      </div>
      <div class="card-actions">
        <a class="action-btn" href="${u.html_url}" target="_blank" rel="noopener">View profile ${I.external}</a>
      </div>
    </article>`).join("");
  $("emptyState").style.display = users.length ? "none" : "block";
}
function updateStats(){
  $("statRepos").textContent = state.total ? state.total.toLocaleString("en-US") : "-";
  const stars = state.repos.reduce((a,r)=>a+(r.stargazers_count||0),0);
  $("statStars").textContent = fmt(stars);
  const langs = new Set(state.repos.map(r=>r.language).filter(Boolean));
  $("statLangs").textContent = langs.size || "-";
}

/* Bookmarks */
function toggleBookmark(fullName, btn){
  if (state.bookmarks.has(fullName)){ state.bookmarks.delete(fullName); toast("Removed from saved."); }
  else { state.bookmarks.add(fullName); toast("Saved. Find it in the Saved tab."); }
  localStorage.setItem("gp_bookmarks", JSON.stringify([...state.bookmarks]));
  $("bookmarkCount").textContent = state.bookmarks.size;
  if (btn && btn.classList.contains("bookmark-btn")){ btn.classList.toggle("saved"); btn.innerHTML = state.bookmarks.has(fullName) ? I.bookmarkFill : I.bookmark; }
  if (state.tab === "bookmarks") renderBookmarks();
}
function renderBookmarks(){
  $("repoGrid").style.display = "grid"; $("devGrid").style.display = "none";
  if (!state.bookmarks.size){
    $("repoGrid").innerHTML = "";
    $("emptyState").style.display = "block";
    $("emptyState").querySelector("h3").textContent = "No saved repositories yet";
    $("emptyState").querySelector("p").textContent = "Use the bookmark icon on any repository card to save it here.";
    $("resultCount").textContent = "";
    return;
  }
  $("emptyState").style.display = "none";
  $("resultCount").textContent = state.bookmarks.size + " saved";
  $("repoGrid").innerHTML = [...state.bookmarks].map(fn => {
    const [owner] = fn.split("/");
    return `
    <article class="repo-card" onclick="openDetail('${esc(fn)}')">
      <div class="card-top">
        <img class="avatar" src="https://github.com/${esc(owner)}.png" alt="${esc(owner)}" loading="lazy">
        <div class="card-title">
          <a href="https://github.com/${esc(fn)}" target="_blank" rel="noopener" title="${esc(fn)}" onclick="event.stopPropagation()">${esc(fn)}</a>
          <div class="card-owner">Saved repository</div>
        </div>
        <button class="bookmark-btn saved" aria-label="Remove from saved" onclick="event.stopPropagation();toggleBookmark('${esc(fn)}',this)">${I.bookmarkFill}</button>
      </div>
      <p class="card-desc">Click to view full details, languages, contributors and README.</p>
      <div class="card-actions"><span class="action-btn">Details ${I.external}</span></div>
    </article>`;
  }).join("");
}

/* Detail modal */
async function openDetail(fullName){
  const modal = $("detailModal");
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
  $("detailContent").innerHTML = '<div class="skeleton"></div><div class="skeleton" style="height:120px;margin-top:12px"></div>';
  try{
    const [repoRes, langRes, contribRes, readmeRes] = await Promise.all([
      fetch(`${API}/repos/${fullName}`, { headers: headers() }),
      fetch(`${API}/repos/${fullName}/languages`, { headers: headers() }),
      fetch(`${API}/repos/${fullName}/contributors?per_page=10`, { headers: headers() }),
      fetch(`${API}/repos/${fullName}/readme`, { headers: { ...headers(), "Accept": "application/vnd.github.raw" } })
    ]);
    if (!repoRes.ok) throw new Error("Repository not found.");
    const r = await repoRes.json();
    const langs = langRes.ok ? await langRes.json() : {};
    const contribs = contribRes.ok ? await contribRes.json() : [];
    let readme = "";
    if (readmeRes.ok){ readme = (await readmeRes.text()).slice(0, 4000); }

    const totalLang = Object.values(langs).reduce((a,b)=>a+b,0) || 1;
    const langBar = Object.entries(langs).slice(0,5).map(([l,v]) =>
      `<div style="width:${(v/totalLang*100).toFixed(1)}%;background:${LANG_COLORS[l]||"#999"}" title="${esc(l)}"></div>`).join("");
    const langLegend = Object.entries(langs).slice(0,5).map(([l,v]) =>
      `<span><span class="lang-dot" style="background:${LANG_COLORS[l]||"#999"}"></span>${esc(l)} ${(v/totalLang*100).toFixed(1)}%</span>`).join("");

    const saved = state.bookmarks.has(r.full_name);
    $("detailContent").innerHTML = `
      <div class="detail-head">
        <img class="avatar" src="${r.owner.avatar_url}" alt="">
        <div>
          <h2><a href="${r.html_url}" target="_blank" rel="noopener">${esc(r.full_name)}</a></h2>
          <span class="detail-meta-line">${r.private ? "Private" : "Public"} · ${esc(r.license ? r.license.spdx_id : "No license")} · Created ${new Date(r.created_at).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}</span>
        </div>
      </div>
      <p>${esc(r.description || "No description provided.")}</p>
      <div class="detail-stats">
        <div class="dstat"><b>${fmt(r.stargazers_count)}</b><span>Stars</span></div>
        <div class="dstat"><b>${fmt(r.forks_count)}</b><span>Forks</span></div>
        <div class="dstat"><b>${fmt(r.open_issues_count)}</b><span>Open issues</span></div>
        <div class="dstat"><b>${fmt(r.subscribers_count || 0)}</b><span>Watchers</span></div>
      </div>
      ${Object.keys(langs).length ? `<span class="section-label">Languages</span><div class="lang-bar">${langBar}</div><div class="lang-legend">${langLegend}</div>` : ""}
      <div class="detail-actions">
        <a class="primary" href="${r.html_url}" target="_blank" rel="noopener">${I.star} Star on GitHub</a>
        <a href="${r.html_url}/fork" target="_blank" rel="noopener">${I.fork} Fork</a>
        ${r.homepage ? `<a href="${esc(r.homepage)}" target="_blank" rel="noopener">${I.external} Live demo</a>` : ""}
        <button onclick="copyClone('${esc(r.clone_url)}')">${I.copy} Copy clone URL</button>
        <button onclick="shareRepo('${esc(r.html_url)}')">${I.share} Share</button>
        <button onclick="toggleBookmark('${esc(r.full_name)}',this)">${saved ? I.bookmarkFill + " Saved" : I.bookmark + " Save"}</button>
      </div>
      <p class="clone-line">Clone: <code>${esc(r.clone_url)}</code></p>
      ${contribs.length ? `<span class="section-label">Top contributors</span><div class="contributors">${contribs.map(c=>`<a href="${c.html_url}" target="_blank" rel="noopener" title="${esc(c.login)} (${c.contributions} contributions)"><img src="${c.avatar_url}" alt="${esc(c.login)}"></a>`).join("")}</div>` : ""}
      ${readme ? `<span class="section-label">README preview</span><div class="readme-box">${esc(readme)}</div>` : `<p class="modal-text">No README available for this repository.</p>`}
    `;
  }catch(err){
    $("detailContent").innerHTML = `<p style="color:var(--danger)">${esc(err.message)}</p>`;
  }
}
function closeDetail(){ $("detailModal").style.display = "none"; document.body.style.overflow = ""; }
function copyText(text, msg){
  if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(()=>toast(msg)).catch(()=>toast("Copy failed. Please copy manually."));
  } else { toast("Copy not supported in this browser."); }
}
function copyClone(url){ copyText(url, "Clone URL copied to clipboard."); }
function shareRepo(url){ copyText(url, "Repository link copied."); }

/* Tabs and filters */
const SECTION_INFO = {
  trending: ["Trending repositories", "Repositories created in the last 24 hours, ranked by stars. Updates automatically every day."],
  starred: ["Most starred repositories", "The most starred public repositories of all time on GitHub."],
  categories: ["Browse by category", "Explore repositories grouped by topic: AI, web, mobile, DevOps and more."],
  developers: ["Top developers", "The most followed developers on GitHub."],
  bookmarks: ["Saved repositories", "Repositories you bookmarked in this browser."]
};
function updateSectionHead(){
  if (state.query){
    $("sectionTitle").textContent = "Search results";
    $("sectionSub").textContent = 'Showing results for "' + state.query + '" across GitHub.';
    return;
  }
  const info = SECTION_INFO[state.tab] || SECTION_INFO.trending;
  $("sectionTitle").textContent = info[0];
  $("sectionSub").textContent = info[1];
}
function setTab(tab){
  state.tab = tab;
  applyStateToUI();
  updateSectionHead();
  if (tab === "developers") fetchDevelopers();
  else if (tab === "bookmarks") renderBookmarks();
  else fetchRepos(true);
}
function goHome(e){ e.preventDefault(); state.query = ""; setTab("trending"); window.scrollTo({top:0, behavior:"smooth"}); }
function resetFilters(){
  state.query = ""; state.lang = ""; state.category = "all"; state.range = "today"; state.sort = "stars";
  applyStateToUI();
  setTab(state.tab === "bookmarks" ? "trending" : state.tab);
}

/* Recent searches */
function saveRecent(q){
  if (!q) return;
  state.recent = [q, ...state.recent.filter(x => x !== q)].slice(0,5);
  localStorage.setItem("gp_recent", JSON.stringify(state.recent));
}
function renderRecent(){
  const box = $("recentBox");
  if (!state.recent.length){ box.style.display = "none"; return; }
  $("recentList").innerHTML = state.recent.map(q =>
    `<button class="recent-item" data-q="${esc(q)}">${I.search}<span>${esc(q)}</span></button>`).join("");
  box.style.display = "block";
}
function hideRecent(){ $("recentBox").style.display = "none"; }

/* Events */
document.querySelectorAll(".nav-link").forEach(b => b.addEventListener("click", () => { setTab(b.dataset.tab); $("mobileNav").classList.remove("open"); }));
$("menuBtn").addEventListener("click", () => $("mobileNav").classList.toggle("open"));
$("refreshBtn").addEventListener("click", () => { refreshCurrent(); toast("Refreshing live data..."); });
$("shareBtn").addEventListener("click", () => { syncURL(); copyText(location.href, "Link to this view copied."); });
$("timePills").addEventListener("click", e => {
  const p = e.target.closest(".seg-btn"); if (!p) return;
  state.range = p.dataset.range; applyStateToUI(); updateSectionHead(); fetchRepos(true);
});
$("langSelect").addEventListener("change", e => { state.lang = e.target.value; fetchRepos(true); });
$("sortSelect").addEventListener("change", e => { state.sort = e.target.value; fetchRepos(true); });
$("loadMoreBtn").addEventListener("click", () => { state.page++; fetchRepos(false); });

$("categoryPills").innerHTML = CATEGORIES.map(c =>
  `<button class="chip ${c.id==="all"?"active":""}" data-cat="${c.id}">${c.label}</button>`).join("");
$("categoryPills").addEventListener("click", e => {
  const p = e.target.closest(".chip"); if (!p) return;
  state.category = p.dataset.cat; applyStateToUI(); fetchRepos(true);
});

/* Search */
let searchTimer;
function doSearch(){
  const v = $("globalSearch").value.trim();
  state.query = v;
  if (v) saveRecent(v);
  hideRecent();
  applyStateToUI();
  updateSectionHead();
  if (state.tab === "bookmarks" || state.tab === "developers") setTab("trending");
  else fetchRepos(true);
}
$("searchBtn").addEventListener("click", doSearch);
$("globalSearch").addEventListener("keydown", e => { if (e.key === "Enter") doSearch(); });
$("globalSearch").addEventListener("input", () => { clearTimeout(searchTimer); searchTimer = setTimeout(doSearch, 700); });
$("globalSearch").addEventListener("focus", renderRecent);
$("globalSearch").addEventListener("blur", () => setTimeout(hideRecent, 180));
$("recentList").addEventListener("click", e => {
  const b = e.target.closest(".recent-item"); if (!b) return;
  $("globalSearch").value = b.dataset.q; doSearch();
});
$("clearRecent").addEventListener("click", e => {
  e.stopPropagation();
  state.recent = []; localStorage.removeItem("gp_recent"); hideRecent();
});
$("clearSearch").addEventListener("click", () => { $("globalSearch").value = ""; doSearch(); });

/* Theme */
$("themeBtn").addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("gp_theme", next);
  toast(next === "dark" ? "Dark mode on." : "Light mode on.");
});

/* Token modal */
$("tokenBtn").addEventListener("click", () => { $("tokenInput").value = getToken(); $("tokenModal").style.display = "flex"; });
function closeToken(){ $("tokenModal").style.display = "none"; }
function saveToken(){
  const v = $("tokenInput").value.trim();
  if (v) localStorage.setItem("gp_token", v);
  closeToken(); toast("Token saved. Higher rate limit applied."); checkRateLimit(); fetchRepos(true);
}
function removeToken(){ localStorage.removeItem("gp_token"); closeToken(); toast("Token removed."); checkRateLimit(); }
$("detailModal").addEventListener("click", e => { if (e.target === $("detailModal")) closeDetail(); });
$("tokenModal").addEventListener("click", e => { if (e.target === $("tokenModal")) closeToken(); });
document.addEventListener("keydown", e => {
  if (e.key === "Escape"){ closeDetail(); closeToken(); hideRecent(); }
  if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "SELECT"){
    e.preventDefault(); $("globalSearch").focus();
  }
});

/* Back to top */
window.addEventListener("scroll", () => {
  $("backTop").classList.toggle("show", window.scrollY > 600);
}, { passive:true });
$("backTop").addEventListener("click", () => window.scrollTo({ top:0, behavior:"smooth" }));

/* Auto refresh countdown */
setInterval(() => {
  if (document.hidden || state.loading) return;
  state.autoLeft -= 1;
  if (state.autoLeft <= 0){
    refreshCurrent();
  } else {
    const m = Math.floor(state.autoLeft / 60);
    const s = String(state.autoLeft % 60).padStart(2, "0");
    $("autoRefresh").textContent = "Auto-refresh " + m + ":" + s;
  }
}, 1000);

/* Init: restore from URL, then load live data */
readURL();
$("bookmarkCount").textContent = state.bookmarks.size;
applyStateToUI();
updateSectionHead();
if (state.tab === "developers") fetchDevelopers();
else if (state.tab === "bookmarks") renderBookmarks();
else fetchRepos(true);
checkRateLimit();
setInterval(checkRateLimit, 60000);
