import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './AnalyticsDashboard.css';

const ADMIN_PASSWORD = 'doiwannaknow';
const VISITS_PER_PAGE = 15;

// ── Password Gate ──────────────────────────────────────────

function PasswordGate({ onAuth }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('analytics_auth', 'true');
      onAuth();
    } else {
      setError('Incorrect password');
      setPw('');
    }
  };

  return (
    <div className="analytics-gate">
      <form className="analytics-gate-box" onSubmit={handleSubmit}>
        <h2>ANALYTICS</h2>
        <p>Enter password to continue</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setError(''); }}
          placeholder="Password"
          autoFocus
        />
        <button type="submit">UNLOCK</button>
        {error && <div className="analytics-gate-error">{error}</div>}
      </form>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────

function formatDate(visit) {
  if (visit.visitedAt?.toDate) {
    return visit.visitedAt.toDate().toLocaleString();
  }
  return visit.visitedAtLocal || 'Unknown';
}

function formatDuration(seconds) {
  if (!seconds || seconds < 1) return '< 1s';
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function getCountryFlag(code) {
  if (!code || code.length !== 2) return '🌍';
  const codePoints = code.toUpperCase().split('').map(c => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function CopyIP({ ip }) {
  const [copied, setCopied] = useState(false);
  if (!ip || ip === 'Unknown') return <span>—</span>;
  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
      {ip}
      <button
        onClick={handleCopy}
        title="Copy IP"
        style={{
          background: copied ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)',
          border: '1px solid',
          borderColor: copied ? '#4ade80' : '#333',
          borderRadius: '5px',
          padding: '0.15rem 0.35rem',
          cursor: 'pointer',
          color: copied ? '#4ade80' : '#888',
          fontSize: '0.65rem',
          lineHeight: 1,
          transition: 'all 0.2s',
          whiteSpace: 'nowrap'
        }}
      >
        {copied ? '✓' : '⧉'}
      </button>
    </span>
  );
}

function getVisitorColor(visitorId) {
  if (!visitorId) return '#888888';
  let hash = 0;
  for (let i = 0; i < visitorId.length; i++) {
    hash = visitorId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 70%, 65%)`;
}

function getVisitorShortId(visitorId) {
  if (!visitorId) return 'N/A';
  return visitorId.substring(0, 8).toUpperCase();
}

// ── Stats Computation ──────────────────────────────────────

function computeStats(visits) {
  const total = visits.length;
  const uniqueVisitors = new Set(visits.map(v => v.visitorId)).size;
  const avgTime = total > 0
    ? Math.round(visits.reduce((sum, v) => sum + (v.timeSpentSeconds || 0), 0) / total)
    : 0;
  const bounces = visits.filter(v => (v.timeSpentSeconds || 0) < 5).length;
  const bounceRate = total > 0 ? Math.round((bounces / total) * 100) : 0;
  const avgScroll = total > 0
    ? Math.round(visits.reduce((sum, v) => sum + (v.maxScrollDepth || 0), 0) / total)
    : 0;
  const newVisitors = visits.filter(v => !v.isReturning).length;
  const returningVisitors = visits.filter(v => v.isReturning).length;

  // Distribution helpers
  const countField = (field) => {
    const counts = {};
    visits.forEach(v => {
      const val = v[field] || 'Unknown';
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  };

  return {
    total,
    uniqueVisitors,
    avgTime,
    bounceRate,
    avgScroll,
    newVisitors,
    returningVisitors,
    browsers: countField('browser'),
    devices: countField('deviceType'),
    oses: countField('os'),
    referrers: countField('referrer'),
    countries: countField('country'),
    cities: countField('city'),
    languages: countField('language')
  };
}

// ── Stat Bar Component ─────────────────────────────────────

function StatList({ items, total }) {
  return items.map(([name, count]) => (
    <div className="stat-row" key={name}>
      <span className="stat-label">{name}</span>
      <div className="stat-bar-wrap">
        <div className="stat-bar" style={{ width: `${(count / total) * 100}%` }} />
      </div>
      <span className="stat-value">{count} ({Math.round((count / total) * 100)}%)</span>
    </div>
  ));
}

const OWNER_IPS = ['106.51.204.179', '2406:7400:10a:9f95:c4e2:5350:8125:557e'];

const isOwnerIp = (ip) => {
  if (!ip) return false;
  const cleanIp = ip.trim().toLowerCase();
  return OWNER_IPS.some(ownerIp => cleanIp.includes(ownerIp.toLowerCase()));
};

// ── Main Dashboard ─────────────────────────────────────────

export default function AnalyticsDashboard() {
  const [authed, setAuthed] = useState(sessionStorage.getItem('analytics_auth') === 'true');
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);
  const [page, setPage] = useState(0);

  const [dateFilter, setDateFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isGrouped, setIsGrouped] = useState(false);
  const [hideOwnVisits, setHideOwnVisits] = useState(true);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'visits'), orderBy('visitedAt', 'desc'), limit(500));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVisits(data);
    } catch (err) {
      console.error('Failed to fetch visits:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authed) fetchVisits();
  }, [authed]);

  const filteredVisits = useMemo(() => {
    if (!visits || visits.length === 0) return [];
    const now = new Date();

    return visits.filter(visit => {
      if (hideOwnVisits && isOwnerIp(visit.ip)) {
        return false;
      }

      let date;
      if (visit.visitedAt?.toDate) {
        date = visit.visitedAt.toDate();
      } else if (visit.visitedAtLocal) {
        date = new Date(visit.visitedAtLocal);
      } else {
        return dateFilter === 'all';
      }

      if (dateFilter === 'today') {
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return date >= todayStart;
      }
      
      if (dateFilter === 'yesterday') {
        const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return date >= yesterdayStart && date < todayStart;
      }

      if (dateFilter === '7days') {
        const limitDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return date >= limitDate;
      }

      if (dateFilter === '30days') {
        const limitDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return date >= limitDate;
      }

      if (dateFilter === 'custom') {
        if (customStartDate) {
          const start = new Date(customStartDate);
          start.setHours(0, 0, 0, 0);
          if (date < start) return false;
        }
        if (customEndDate) {
          const end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999);
          if (date > end) return false;
        }
        return true;
      }

      return true; // 'all'
    });
  }, [visits, dateFilter, customStartDate, customEndDate, hideOwnVisits]);

  const groupedVisitors = useMemo(() => {
    if (!isGrouped) return [];

    const groups = {};
    filteredVisits.forEach(visit => {
      const vid = visit.visitorId || 'unknown';
      if (!groups[vid]) {
        groups[vid] = {
          visitorId: vid,
          visits: [],
          totalTimeSpent: 0,
          totalClicks: 0,
          latestVisit: null,
        };
      }
      groups[vid].visits.push(visit);
      groups[vid].totalTimeSpent += (visit.timeSpentSeconds || 0);
      groups[vid].totalClicks += (visit.totalClicks || 0);
    });

    return Object.values(groups).map(group => {
      group.visits.sort((a, b) => {
        const dateA = a.visitedAt?.toDate ? a.visitedAt.toDate() : new Date(a.visitedAtLocal || 0);
        const dateB = b.visitedAt?.toDate ? b.visitedAt.toDate() : new Date(b.visitedAtLocal || 0);
        return dateB - dateA;
      });
      group.latestVisit = group.visits[0];
      return group;
    }).sort((a, b) => {
      const dateA = a.latestVisit.visitedAt?.toDate ? a.latestVisit.visitedAt.toDate() : new Date(a.latestVisit.visitedAtLocal || 0);
      const dateB = b.latestVisit.visitedAt?.toDate ? b.latestVisit.visitedAt.toDate() : new Date(b.latestVisit.visitedAtLocal || 0);
      return dateB - dateA;
    });
  }, [filteredVisits, isGrouped]);

  useEffect(() => {
    setExpandedId(null);
    setExpandedHistoryId(null);
    setPage(0);
  }, [isGrouped, dateFilter, customStartDate, customEndDate, hideOwnVisits]);

  const stats = useMemo(() => computeStats(filteredVisits), [filteredVisits]);

  const totalItems = isGrouped ? groupedVisitors.length : filteredVisits.length;
  const totalPages = Math.ceil(totalItems / VISITS_PER_PAGE);

  const paginatedItems = useMemo(() => {
    const items = isGrouped ? groupedVisitors : filteredVisits;
    return items.slice(page * VISITS_PER_PAGE, (page + 1) * VISITS_PER_PAGE);
  }, [filteredVisits, groupedVisitors, isGrouped, page]);

  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />;

  if (loading) {
    return (
      <div className="analytics-dashboard">
        <div className="analytics-loading">
          <div className="analytics-spinner" />
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      {/* Header */}
      <div className="analytics-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1>VISITOR ANALYTICS</h1>
          <span className="live-dot" title="Live" />
        </div>
        <div className="analytics-header-actions">
          <button className="btn-refresh" onClick={fetchVisits}>↻ REFRESH</button>
          <Link to="/" className="btn-back">← PORTFOLIO</Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="analytics-cards">
        <div className="analytics-card">
          <div className="analytics-card-label">Total Visits</div>
          <div className="analytics-card-value gold">{stats.total}</div>
          <div className="analytics-card-sub">All time page views</div>
        </div>
        <div className="analytics-card">
          <div className="analytics-card-label">Unique Visitors</div>
          <div className="analytics-card-value">{stats.uniqueVisitors}</div>
          <div className="analytics-card-sub">{stats.returningVisitors} returning</div>
        </div>
        <div className="analytics-card">
          <div className="analytics-card-label">Avg. Time on Page</div>
          <div className="analytics-card-value">{formatDuration(stats.avgTime)}</div>
          <div className="analytics-card-sub">Per session</div>
        </div>
        <div className="analytics-card">
          <div className="analytics-card-label">Bounce Rate</div>
          <div className="analytics-card-value">{stats.bounceRate}%</div>
          <div className="analytics-card-sub">&lt; 5 sec visits</div>
        </div>
        <div className="analytics-card">
          <div className="analytics-card-label">Avg. Scroll Depth</div>
          <div className="analytics-card-value">{stats.avgScroll}%</div>
          <div className="analytics-card-sub">Page scrolled</div>
        </div>
      </div>

      {/* Distributions Grid */}
      <div className="analytics-grid">
        <div className="analytics-section">
          <h3 className="analytics-section-title">Traffic Sources</h3>
          <StatList items={stats.referrers} total={stats.total} />
        </div>

        <div className="analytics-section">
          <h3 className="analytics-section-title">Countries</h3>
          {stats.countries.map(([name, count]) => (
            <div className="stat-row" key={name}>
              <span className="stat-label">
                {getCountryFlag(visits.find(v => v.country === name)?.countryCode)} {name}
              </span>
              <div className="stat-bar-wrap">
                <div className="stat-bar" style={{ width: `${(count / stats.total) * 100}%` }} />
              </div>
              <span className="stat-value">{count}</span>
            </div>
          ))}
        </div>

        <div className="analytics-section">
          <h3 className="analytics-section-title">Browsers</h3>
          <StatList items={stats.browsers} total={stats.total} />
        </div>

        <div className="analytics-section">
          <h3 className="analytics-section-title">Operating Systems</h3>
          <StatList items={stats.oses} total={stats.total} />
        </div>

        <div className="analytics-section">
          <h3 className="analytics-section-title">Device Types</h3>
          <StatList items={stats.devices} total={stats.total} />
        </div>

        <div className="analytics-section">
          <h3 className="analytics-section-title">Languages</h3>
          <StatList items={stats.languages} total={stats.total} />
        </div>
      </div>

      {/* Controls: Date Filtering & Compressed Toggle */}
      <div className="analytics-controls-bar">
        <div className="controls-left">
          <span className="control-label">Date Filter</span>
          <div className="filter-btn-group">
            {[
              { id: 'all', label: 'All Time' },
              { id: 'today', label: 'Today' },
              { id: 'yesterday', label: 'Yesterday' },
              { id: '7days', label: '7 Days' },
              { id: '30days', label: '30 Days' },
              { id: 'custom', label: 'Custom' }
            ].map(f => (
              <button
                key={f.id}
                className={`filter-btn ${dateFilter === f.id ? 'active' : ''}`}
                onClick={() => setDateFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {dateFilter === 'custom' && (
            <div className="custom-date-inputs">
              <input
                type="date"
                value={customStartDate}
                onChange={e => setCustomStartDate(e.target.value)}
                title="Start Date"
              />
              <span className="date-sep">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={e => setCustomEndDate(e.target.value)}
                title="End Date"
              />
            </div>
          )}
        </div>

        <div className="controls-right">
          <span className="control-label">Filters</span>
          <button
            className={`view-mode-toggle ${hideOwnVisits ? 'active' : ''}`}
            onClick={() => setHideOwnVisits(!hideOwnVisits)}
            style={{ marginRight: '0.8rem' }}
          >
            {hideOwnVisits ? '🛡️ EXCLUDING MY VISITS' : '👁️ SHOWING ALL (INCL. ME)'}
          </button>

          <span className="control-label">View Mode</span>
          <button
            className={`view-mode-toggle ${isGrouped ? 'active' : ''}`}
            onClick={() => setIsGrouped(!isGrouped)}
          >
            {isGrouped ? '👥 COMPRESSED (Group by Visitor)' : '📄 STANDARD (All Visits)'}
          </button>
        </div>
      </div>

      {/* Visitors Table */}
      <div className="analytics-section full-width">
        <h3 className="analytics-section-title">
          {isGrouped 
            ? `Visitors Grouped (${groupedVisitors.length} unique)` 
            : `Recent Visits (${filteredVisits.length} total)`
          }
        </h3>
        <div className="visitors-table-wrap">
          <table className="visitors-table">
            <thead>
              {isGrouped ? (
                <tr>
                  <th>Visitor Tag</th>
                  <th>Last Seen</th>
                  <th>IP</th>
                  <th>Location</th>
                  <th>Device</th>
                  <th>Resolution</th>
                  <th>Brand / Model</th>
                  <th>Visits</th>
                  <th>Total Time</th>
                  <th>Total Clicks</th>
                  <th>Type</th>
                </tr>
              ) : (
                <tr>
                  <th>Time</th>
                  <th>IP</th>
                  <th>Location</th>
                  <th>Device</th>
                  <th>Resolution</th>
                  <th>Brand / Model</th>
                  <th>OS</th>
                  <th>Browser</th>
                  <th>Referrer</th>
                  <th>Duration</th>
                  <th>Scroll</th>
                  <th>Type</th>
                </tr>
              )}
            </thead>
            <tbody>
              {isGrouped ? (
                paginatedItems.map((group) => {
                  const latest = group.latestVisit;
                  const vColor = getVisitorColor(group.visitorId);
                  const shortId = getVisitorShortId(group.visitorId);
                  const isExpanded = expandedId === group.visitorId;

                  return (
                    <React.Fragment key={group.visitorId}>
                      <tr onClick={() => setExpandedId(isExpanded ? null : group.visitorId)}>
                        <td>
                          <span className="visitor-tag-cell" style={{ '--tag-color': vColor }}>
                            <span className="visitor-color-dot" />
                            <span className="visitor-id-txt">{shortId}</span>
                          </span>
                        </td>
                        <td>{formatDate(latest)}</td>
                        <td><CopyIP ip={latest.ip} /></td>
                        <td>{getCountryFlag(latest.countryCode)} {latest.city || '—'}, {latest.country || '—'}</td>
                        <td><span className="badge badge-device">{latest.deviceType || '—'}</span></td>
                        <td>{latest.screenResolution || '—'}</td>
                        <td>{latest.deviceBrand ? `${latest.deviceBrand} ${latest.deviceModel || ''}`.trim() : '—'}</td>
                        <td>
                          <span className="badge badge-visits-count">
                            {group.visits.length}
                          </span>
                        </td>
                        <td>{formatDuration(group.totalTimeSpent)}</td>
                        <td>{group.totalClicks}</td>
                        <td>
                          <span className={`badge ${latest.isReturning ? 'badge-returning' : 'badge-new'}`}>
                            {latest.isReturning ? 'Returning' : 'New'}
                          </span>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan="11" style={{ padding: 0, border: 'none' }}>
                            <div className="visitor-detail grouped-detail">
                              <div className="visitor-detail-grid">
                                <div className="detail-item">
                                  <span className="detail-label">Full Visitor ID</span>
                                  <span className="detail-value">{group.visitorId}</span>
                                </div>
                                <div className="detail-item">
                                  <span className="detail-label">Latest IP</span>
                                  <span className="detail-value"><CopyIP ip={latest.ip} /></span>
                                </div>
                                <div className="detail-item">
                                  <span className="detail-label">ISP / Network</span>
                                  <span className="detail-value">{latest.isp || '—'}</span>
                                </div>
                                <div className="detail-item">
                                  <span className="detail-label">Device Brand</span>
                                  <span className="detail-value">{latest.deviceBrand || '—'}</span>
                                </div>
                                <div className="detail-item">
                                  <span className="detail-label">Device Model</span>
                                  <span className="detail-value">{latest.deviceModel || '—'}</span>
                                </div>
                                <div className="detail-item">
                                  <span className="detail-label">Region</span>
                                  <span className="detail-value">{latest.region}, {latest.country}</span>
                                </div>
                                <div className="detail-item">
                                  <span className="detail-label">Timezone</span>
                                  <span className="detail-value">{latest.timezone || '—'}</span>
                                </div>
                                <div className="detail-item">
                                  <span className="detail-label">Resolution</span>
                                  <span className="detail-value">{latest.screenResolution || '—'}</span>
                                </div>
                                <div className="detail-item">
                                  <span className="detail-label">RAM / CPU Cores</span>
                                  <span className="detail-value">{latest.deviceMemory ? `${latest.deviceMemory} GB` : 'N/A'} / {latest.cpuCores || 'N/A'}</span>
                                </div>
                                <div className="detail-item">
                                  <span className="detail-label">Network / Battery</span>
                                  <span className="detail-value">{latest.networkType || 'Unknown'} / {latest.batteryLevel !== null ? `${latest.batteryLevel}%` : 'N/A'}</span>
                                </div>
                              </div>

                              <div className="history-timeline-section">
                                <h4>Visit History Timeline ({group.visits.length} sessions)</h4>
                                <div className="timeline-list">
                                  {group.visits.map((hVisit, idx) => {
                                    const historyKey = `h-${group.visitorId}-${idx}`;
                                    const isHistoryExpanded = expandedHistoryId === historyKey;

                                    return (
                                      <div key={idx} className="timeline-item">
                                        <div 
                                          className="timeline-item-header"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setExpandedHistoryId(isHistoryExpanded ? null : historyKey);
                                          }}
                                        >
                                          <div className="timeline-time">
                                            <span className="timeline-index">#{group.visits.length - idx}</span>
                                            {formatDate(hVisit)}
                                          </div>
                                          <div className="timeline-summary">
                                            <span>Duration: <strong>{formatDuration(hVisit.timeSpentSeconds)}</strong></span>
                                            <span>Scroll: <strong>{hVisit.maxScrollDepth || 0}%</strong></span>
                                            <span>Clicks: <strong>{hVisit.totalClicks || 0}</strong></span>
                                            <span className="timeline-exp-indicator">
                                              {isHistoryExpanded ? '▲ hide' : '▼ details'}
                                            </span>
                                          </div>
                                        </div>

                                        {isHistoryExpanded && (
                                          <div className="timeline-item-details">
                                            <div className="timeline-details-grid">
                                              <div><strong>URL Path:</strong> {hVisit.pagePath || '—'}</div>
                                              <div><strong>Referrer:</strong> {hVisit.referrerUrl || 'Direct'}</div>
                                              <div><strong>Resolution:</strong> {hVisit.screenResolution || '—'}</div>
                                              <div><strong>Window Size:</strong> {hVisit.windowSize || '—'}</div>
                                              <div><strong>Browser/OS:</strong> {hVisit.browser} / {hVisit.os}</div>
                                              <div><strong>Device Memory:</strong> {hVisit.deviceMemory ? `${hVisit.deviceMemory} GB` : 'N/A'}</div>
                                              <div><strong>Battery:</strong> {hVisit.batteryLevel !== null ? `${hVisit.batteryLevel}%` : 'N/A'}</div>
                                              <div><strong>Network:</strong> {hVisit.networkType || 'Unknown'}</div>
                                            </div>
                                            {hVisit.clickedElements && hVisit.clickedElements.length > 0 && (
                                              <div className="timeline-clicks">
                                                <strong>Clicked Elements:</strong>
                                                <div className="timeline-clicks-list">
                                                  {hVisit.clickedElements.map((el, clickIdx) => (
                                                    <div key={clickIdx} className="timeline-click-row">
                                                      <span className="click-tag">{el.tag}</span>
                                                      {el.id && <span className="click-id">#{el.id}</span>}
                                                      {el.text && <span className="click-text">"{el.text}"</span>}
                                                      {el.href && <span className="click-href">→ {el.href}</span>}
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                paginatedItems.map((visit) => (
                  <React.Fragment key={visit.id}>
                    <tr onClick={() => setExpandedId(expandedId === visit.id ? null : visit.id)}>
                      <td>{formatDate(visit)}</td>
                      <td><CopyIP ip={visit.ip} /></td>
                      <td>{getCountryFlag(visit.countryCode)} {visit.city || '—'}, {visit.country || '—'}</td>
                      <td><span className="badge badge-device">{visit.deviceType || '—'}</span></td>
                      <td>{visit.screenResolution || '—'}</td>
                      <td>{visit.deviceBrand ? `${visit.deviceBrand} ${visit.deviceModel || ''}`.trim() : '—'}</td>
                      <td>{visit.os || '—'}</td>
                      <td>{visit.browser || '—'}</td>
                      <td>{visit.referrer || '—'}</td>
                      <td>{formatDuration(visit.timeSpentSeconds)}</td>
                      <td>{visit.maxScrollDepth || 0}%</td>
                      <td>
                        <span className={`badge ${visit.isReturning ? 'badge-returning' : 'badge-new'}`}>
                          {visit.isReturning ? 'Returning' : 'New'}
                        </span>
                      </td>
                    </tr>
                    {expandedId === visit.id && (
                      <tr>
                        <td colSpan="12" style={{ padding: 0, border: 'none' }}>
                          <div className="visitor-detail">
                            <div className="visitor-detail-grid">
                              <div className="detail-item">
                                <span className="detail-label">Full IP</span>
                                <span className="detail-value"><CopyIP ip={visit.ip} /></span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">ISP / Network</span>
                                <span className="detail-value">{visit.isp || '—'}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Device Brand</span>
                                <span className="detail-value">{visit.deviceBrand || '—'}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Device Model</span>
                                <span className="detail-value">{visit.deviceModel || '—'}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Region</span>
                                <span className="detail-value">{visit.region}, {visit.country}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Postal Code</span>
                                <span className="detail-value">{visit.postalCode || '—'}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Timezone</span>
                                <span className="detail-value">{visit.timezone || '—'}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Screen Resolution</span>
                                <span className="detail-value">{visit.screenResolution || '—'}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Window Size</span>
                                <span className="detail-value">{visit.windowSize || '—'}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Pixel Ratio</span>
                                <span className="detail-value">{visit.pixelRatio || '—'}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Device Memory</span>
                                <span className="detail-value">{visit.deviceMemory ? `${visit.deviceMemory} GB` : 'N/A'}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">CPU Cores</span>
                                <span className="detail-value">{visit.cpuCores || 'N/A'}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Network Type</span>
                                <span className="detail-value">{visit.networkType || 'Unknown'}{visit.networkActualType ? ` (${visit.networkActualType})` : ''}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Downlink / RTT</span>
                                <span className="detail-value">{visit.downlink ? `${visit.downlink} Mbps` : '—'} / {visit.rtt ? `${visit.rtt}ms` : '—'}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Battery</span>
                                <span className="detail-value">{visit.batteryLevel !== null && visit.batteryLevel !== undefined ? `${visit.batteryLevel}%${visit.batteryCharging ? ' ⚡ Charging' : ''}` : 'N/A'}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Referrer URL</span>
                                <span className="detail-value">{visit.referrerUrl || 'Direct'}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Page URL</span>
                                <span className="detail-value">{visit.pageUrl || '—'}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Visit #</span>
                                <span className="detail-value">{visit.visitNumber || 1}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Total Clicks</span>
                                <span className="detail-value">{visit.totalClicks || 0}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Visitor ID</span>
                                <span className="detail-value">{visit.visitorId || '—'}</span>
                              </div>
                              {visit.utmParams && (
                                <div className="detail-item">
                                  <span className="detail-label">UTM Params</span>
                                  <span className="detail-value">{JSON.stringify(visit.utmParams)}</span>
                                </div>
                              )}
                              <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                                <span className="detail-label">User Agent</span>
                                <span className="detail-value" style={{ fontSize: '0.7rem', color: '#888' }}>{visit.rawUserAgent || '—'}</span>
                              </div>
                              {visit.clickedElements && visit.clickedElements.length > 0 && (
                                <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                                  <span className="detail-label">Clicked Elements</span>
                                  <span className="detail-value" style={{ fontSize: '0.7rem', color: '#888' }}>
                                    {visit.clickedElements.map((el, i) => (
                                      <span key={i} style={{ display: 'block', marginBottom: '0.2rem' }}>
                                        {el.tag}{el.id ? `#${el.id}` : ''} {el.text ? `"${el.text}"` : ''} {el.href ? `→ ${el.href}` : ''}
                                      </span>
                                    ))}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => setPage(p => p - 1)} disabled={page === 0}>← Prev</button>
            <span>Page {page + 1} of {totalPages}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
