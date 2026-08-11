import React, { useState, useEffect } from 'react';
import { 
  getAdminAnalyticsDaily, 
  getAdminAnalyticsMonthly, 
  getAdminAnalyticsYearly, 
  getAdminAnalyticsOverall,
  getAdminAnalyticsDate
} from '../../services/admin/analyticsService';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' | 'monthly' | 'yearly'
  const [stats, setStats] = useState(null);
  
  // Data lists
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  
  // Filtering & loading
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected Date report states
  const [selectedDate, setSelectedDate] = useState('');
  const [dateStats, setDateStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState('');
  const [reportShown, setReportShown] = useState(false);

  const loadAllAnalytics = async () => {
    try {
      setLoading(true);
      const overallStats = await getAdminAnalyticsOverall();
      setStats(overallStats);

      const dData = await getAdminAnalyticsDaily();
      setDailyData(dData);

      const mData = await getAdminAnalyticsMonthly();
      setMonthlyData(mData);

      const yData = await getAdminAnalyticsYearly();
      setYearlyData(yData);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to query analytical dashboards.');
      setLoading(false);
    }
  };

  const handleShowReport = async (e) => {
    e.preventDefault();
    if (!selectedDate) return;
    
    try {
      setStatsLoading(true);
      setStatsError('');
      setReportShown(true);

      const statsData = await getAdminAnalyticsDate(selectedDate);
      setDateStats(statsData);
      
      const dData = await getAdminAnalyticsDaily(selectedDate);
      setDailyData(dData);

      const mData = await getAdminAnalyticsMonthly(selectedDate);
      setMonthlyData(mData);

      const yData = await getAdminAnalyticsYearly(selectedDate);
      setYearlyData(yData);
      
      setStatsLoading(false);
    } catch (err) {
      console.error(err);
      setStatsError('Failed to fetch report for the selected date.');
      setStatsLoading(false);
    }
  };

  const handleClearDateFilter = async () => {
    setSelectedDate('');
    setDateStats(null);
    setReportShown(false);
    setStatsError('');
    
    try {
      setLoading(true);
      const dData = await getAdminAnalyticsDaily();
      setDailyData(dData);

      const mData = await getAdminAnalyticsMonthly();
      setMonthlyData(mData);

      const yData = await getAdminAnalyticsYearly();
      setYearlyData(yData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to reload analytics.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAnalytics();
  }, []);

  const getFilteredData = () => {
    let sourceData = activeTab === 'daily' ? dailyData : activeTab === 'monthly' ? monthlyData : yearlyData;
    
    if (startDate) {
      sourceData = sourceData.filter(d => d.period >= startDate);
    }
    if (endDate) {
      sourceData = sourceData.filter(d => d.period <= endDate);
    }
    
    return sourceData;
  };

  const downloadReport = () => {
    const dataToExport = getFilteredData();
    if (dataToExport.length === 0) {
      alert('No data available to export.');
      return;
    }
    
    let csvContent = "\uFEFF"; // BOM for excel
    csvContent += "Period,Revenue (INR),Orders Count\n";
    
    dataToExport.forEach(row => {
      csvContent += `"${row.period}",${row.revenue},${row.ordersCount}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `salessavvy_revenue_${activeTab}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const chartData = getFilteredData();

  // Custom Chart calculations
  const svgWidth = 800;
  const svgHeight = 280;
  const padding = 40;
  const chartWidth = svgWidth - padding * 2;
  const chartHeight = svgHeight - padding * 2;

  let pointsStr = '';
  let fillStr = '';
  let gridLines = [];
  let xLabels = [];
  let maxVal = 1000;

  if (chartData.length > 0) {
    maxVal = Math.max(...chartData.map(d => d.revenue), 1000) * 1.1;
    chartData.forEach((d, idx) => {
      const x = padding + (chartData.length === 1 ? chartWidth / 2 : (idx / (chartData.length - 1)) * chartWidth);
      const y = padding + chartHeight - (d.revenue / maxVal) * chartHeight;
      pointsStr += `${x},${y} `;
      xLabels.push({ x, text: d.period });
    });

    if (chartData.length > 0) {
      const firstX = padding;
      const lastX = padding + chartWidth;
      const bottomY = padding + chartHeight;
      fillStr = `${firstX},${bottomY} ${pointsStr} ${lastX},${bottomY}`;
    }
  }

  for (let i = 0; i <= 4; i++) {
    const yVal = padding + (i / 4) * chartHeight;
    const revVal = (maxVal - (i / 4) * maxVal).toFixed(0);
    gridLines.push({ y: yVal, label: `₹${revVal}` });
  }

  // Calculate chart columns for bar representation
  const barWidth = chartData.length > 0 ? Math.max(10, (chartWidth / chartData.length) * 0.6) : 20;

  return (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="m-0 fw-bold tracking-wide" style={{ color: '#f8fafc' }}>Business Analytics</h2>
          <p className="text-secondary small m-0 mt-1">Export spreadsheets, analyze growth trends, and evaluate products volume.</p>
        </div>
        <button onClick={downloadReport} className="btn btn-warning border-0 text-dark fw-semibold py-2.5 px-4 d-flex align-items-center gap-2" style={{ backgroundColor: '#fbbf24', borderRadius: '10px' }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Download Report (CSV)</span>
        </button>
      </div>

      {error && (
        <div className="alert alert-danger border-0 mb-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
          {error}
        </div>
      )}

      {/* Mini overview banner */}
      <div className="row g-3 mb-4 text-start">
        <div className={reportShown ? "col-12 col-md-3" : "col-12 col-md-4"}>
          <div className="p-3 rounded text-center" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
            <span className="text-secondary small text-uppercase font-semibold">Total Net Sales</span>
            <h4 className="fw-bold mt-2 text-white">₹{stats?.totalRevenue?.toLocaleString('en-IN') || '0'}</h4>
          </div>
        </div>
        <div className={reportShown ? "col-12 col-md-3" : "col-12 col-md-4"}>
          <div className="p-3 rounded text-center" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
            <span className="text-secondary small text-uppercase font-semibold">Today's Revenue</span>
            <h4 className="fw-bold mt-2 text-white">₹{stats?.todayRevenue?.toLocaleString('en-IN') || '0'}</h4>
          </div>
        </div>
        <div className={reportShown ? "col-12 col-md-3" : "col-12 col-md-4"}>
          <div className="p-3 rounded text-center" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
            <span className="text-secondary small text-uppercase font-semibold">Current Month Sales</span>
            <h4 className="fw-bold mt-2 text-white">₹{stats?.monthlyRevenue?.toLocaleString('en-IN') || '0'}</h4>
          </div>
        </div>
        {reportShown && dateStats && (
          <div className="col-12 col-md-3">
            <div className="p-3 rounded text-center border border-warning" style={{ backgroundColor: '#111827' }}>
              <span className="text-warning small text-uppercase font-semibold">Selected Date Revenue</span>
              <h4 className="fw-bold mt-2 text-warning">₹{dateStats.revenue?.toLocaleString('en-IN') || '0'}</h4>
            </div>
          </div>
        )}
      </div>
      {/* Professional Date Filter Section */}
      <div className="card border-0 p-4 mb-4 shadow-sm" style={{ borderRadius: '16px', backgroundColor: '#111827', border: '1px solid #1f2937' }}>
        <form onSubmit={handleShowReport} className="row g-3 align-items-center justify-content-between text-start">
          <div className="col-auto">
            <h5 className="text-white fw-bold mb-0 font-sans tracking-wide">
              <svg className="w-5 h-5 text-warning me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle', width: '1.25rem', height: '1.25rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Select Report Date
            </h5>
          </div>
          <div className="col-auto d-flex align-items-center gap-3 flex-wrap">
            <div className="position-relative">
              <input 
                type="date" 
                className="form-control admin-input py-2 px-3 ps-5 text-white" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ width: '220px', borderRadius: '10px' }}
                required
              />
              <span className="position-absolute" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '1.125rem', height: '1.125rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
            </div>
            <button type="submit" className="btn btn-warning border-0 text-dark fw-bold px-4 py-2" style={{ backgroundColor: '#fbbf24', borderRadius: '10px' }} disabled={statsLoading}>
              {statsLoading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : null}
              Show Report
            </button>
            {reportShown && (
              <button type="button" onClick={handleClearDateFilter} className="btn btn-outline-secondary text-light px-3 py-2 border-0" style={{ borderRadius: '10px' }}>
                Clear Filter
              </button>
            )}
          </div>
        </form>

        {/* Selected Date Report Output */}
        {statsLoading && (
          <div className="text-center py-4">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading report...</span>
            </div>
          </div>
        )}

        {statsError && (
          <div className="alert alert-danger border-0 mt-3" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
            {statsError}
          </div>
        )}

        {!statsLoading && reportShown && dateStats && (
          <div className="mt-4 pt-3 border-top" style={{ borderColor: '#1f2937' }}>
            {dateStats.ordersCount === 0 ? (
              <div className="alert alert-warning border-0 m-0 text-center fw-semibold text-warning" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '10px' }}>
                No sales found for the selected date.
              </div>
            ) : (
              <div>
                <h6 className="text-secondary small text-uppercase font-semibold tracking-wider mb-3 text-start">Performance Metrics for {new Date(selectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</h6>
                <div className="row g-3">
                  <div className="col-6 col-md-3">
                    <div className="p-3 rounded text-center" style={{ backgroundColor: 'rgba(251, 191, 36, 0.03)', border: '1px solid rgba(251, 191, 36, 0.1)' }}>
                      <span className="text-secondary small text-uppercase font-semibold">Revenue</span>
                      <h4 className="fw-bold mt-2 text-warning">₹{dateStats.revenue?.toLocaleString('en-IN') || '0'}</h4>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="p-3 rounded text-center" style={{ backgroundColor: 'rgba(56, 189, 248, 0.03)', border: '1px solid rgba(56, 189, 248, 0.1)' }}>
                      <span className="text-secondary small text-uppercase font-semibold">Orders</span>
                      <h4 className="fw-bold mt-2 text-info">{dateStats.ordersCount}</h4>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="p-3 rounded text-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.03)', border: '1px solid rgba(34, 197, 94, 0.1)' }}>
                      <span className="text-secondary small text-uppercase font-semibold">Avg Order Value</span>
                      <h4 className="fw-bold mt-2 text-success">₹{dateStats.averageOrderValue?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0'}</h4>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="p-3 rounded text-center" style={{ backgroundColor: 'rgba(168, 85, 247, 0.03)', border: '1px solid rgba(168, 85, 247, 0.1)' }}>
                      <span className="text-secondary small text-uppercase font-semibold">Products Sold</span>
                      <h4 className="fw-bold mt-2" style={{ color: '#a855f7' }}>{dateStats.productsSold} units</h4>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Date Filters and Tabs Panel */}
      <div className="card border-0 p-3 mb-4 shadow-sm" style={{ borderRadius: '14px', backgroundColor: '#111827', border: '1px solid #1f2937' }}>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          {/* Tabs */}
          <ul className="nav nav-pills" style={{ gap: '6px' }}>
            {['daily', 'monthly', 'yearly'].map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  onClick={() => { setActiveTab(tab); setStartDate(''); setEndDate(''); }}
                  className={`nav-link text-capitalize px-4 py-2 border-0 ${activeTab === tab ? 'bg-warning text-dark fw-bold' : 'text-secondary hover-bg-btn'}`}
                  style={{ borderRadius: '8px' }}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>

          {/* Date range picker */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <div>
              <input 
                type="text" 
                className="form-control admin-input py-1.5 font-monospace text-center" 
                placeholder="Start (e.g. 2026-08)" 
                style={{ width: '180px', fontSize: '0.85rem' }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <span className="text-secondary small">to</span>
            <div>
              <input 
                type="text" 
                className="form-control admin-input py-1.5 font-monospace text-center" 
                placeholder="End (e.g. 2026-08-31)" 
                style={{ width: '180px', fontSize: '0.85rem' }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            {(startDate || endDate) && (
              <button onClick={() => { setStartDate(''); setEndDate(''); }} className="btn btn-outline-secondary py-1 px-2.5 text-light text-decoration-none border-0" style={{ fontSize: '0.85rem' }}>
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chart container */}
      <div className="card border-0 p-4 mb-4 shadow-sm" style={{ borderRadius: '16px', backgroundColor: '#111827', border: '1px solid #1f2937' }}>
        <h5 className="text-white fw-bold mb-4 font-sans tracking-wide text-capitalize">{activeTab} Sales Distribution Graph</h5>
        
        <div className="ratio rounded overflow-hidden p-2 bg-transparent" style={{ height: '300px', minHeight: '300px' }}>
          {chartData.length > 0 ? (
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height="100%">
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {gridLines.map((line, i) => (
                <g key={i}>
                  <line x1={padding} y1={line.y} x2={svgWidth - padding} y2={line.y} stroke="#1f2937" strokeWidth="1" />
                  <text x={padding - 8} y={line.y + 4} fill="#64748b" fontSize="10" textAnchor="end" fontWeight="500">
                    {line.label}
                  </text>
                </g>
              ))}

              {/* Area path (only for line display on daily/monthly) */}
              {activeTab !== 'yearly' && fillStr && (
                <polygon points={fillStr} fill="url(#chartFill)" />
              )}

              {/* Line path */}
              {activeTab !== 'yearly' && pointsStr && (
                <polyline points={pointsStr} fill="none" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              )}

              {/* Bars (only for yearly or as columns) */}
              {activeTab === 'yearly' && chartData.map((d, idx) => {
                const x = padding + (chartData.length === 1 ? chartWidth / 2 : (idx / (chartData.length - 1)) * chartWidth);
                const h = (d.revenue / maxVal) * chartHeight;
                const y = padding + chartHeight - h;
                return (
                  <g key={idx}>
                    <rect 
                      x={x - barWidth / 2} 
                      y={y} 
                      width={barWidth} 
                      height={h} 
                      fill="#fbbf24" 
                      rx="4"
                      className="bar-hover"
                    />
                    <title>{`${d.period}: ₹${d.revenue}`}</title>
                  </g>
                );
              })}

              {/* Highlight dots on line chart */}
              {activeTab !== 'yearly' && chartData.map((d, idx) => {
                const x = padding + (chartData.length === 1 ? chartWidth / 2 : (idx / (chartData.length - 1)) * chartWidth);
                const y = padding + chartHeight - (d.revenue / maxVal) * chartHeight;
                return (
                  <g key={idx} className="chart-dot">
                    <circle cx={x} cy={y} r="5" fill="#fbbf24" stroke="#111827" strokeWidth="2.5" />
                    <title>{`${d.period}: ₹${d.revenue}`}</title>
                  </g>
                );
              })}

              {/* Axis Label */}
              {xLabels.map((lbl, idx) => {
                // Show alternating labels if too many to prevent overlapping
                const skip = xLabels.length > 12 && idx % 2 !== 0;
                if (skip) return null;
                return (
                  <text key={idx} x={lbl.x} y={svgHeight - 12} fill="#64748b" fontSize="10" textAnchor="middle" fontWeight="500">
                    {lbl.text.length > 10 ? lbl.text.substring(5) : lbl.text}
                  </text>
                );
              })}
            </svg>
          ) : (
            <div className="d-flex align-items-center justify-content-center text-secondary h-100">
              No aggregate points matching date parameters.
            </div>
          )}
        </div>
      </div>

      {/* Listing of aggregations */}
      <div className="card border-0 p-4 shadow-sm" style={{ borderRadius: '16px', backgroundColor: '#111827', border: '1px solid #1f2937' }}>
        <h5 className="text-white fw-bold mb-4 font-sans tracking-wide">Breakdown Summary</h5>
        
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle m-0" style={{ backgroundColor: 'transparent' }}>
            <thead>
              <tr style={{ color: '#94a3b8', borderBottom: '1px solid #1f2937' }}>
                <th className="py-3 px-4 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider">Period</th>
                <th className="py-3 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider">Sales Revenue</th>
                <th className="py-3 px-4 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider text-end">Orders Completed</th>
              </tr>
            </thead>
            <tbody>
              {chartData.length > 0 ? (
                chartData.map((d) => (
                  <tr key={d.period} style={{ borderBottom: '1px solid #1f2937' }}>
                    <td className="py-3 px-4 border-0 bg-transparent font-monospace text-warning">{d.period}</td>
                    <td className="py-3 border-0 bg-transparent fw-semibold text-white">₹{d.revenue?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4 border-0 bg-transparent text-end fw-semibold text-secondary">{d.ordersCount} transactions</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-secondary">
                    No summary logs available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <style>{`
        .chart-dot circle {
          transition: r 0.2s ease, fill 0.2s ease;
        }
        .chart-dot:hover circle {
          r: 7;
          fill: #ffffff;
        }
        .bar-hover {
          transition: opacity 0.2s ease, fill 0.2s ease;
        }
        .bar-hover:hover {
          fill: #fcd34d;
          opacity: 0.95;
        }
        .hover-bg-btn:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: #f1f5f9 !important;
        }
        .admin-input {
          background-color: #0f172a !important;
          border: 1px solid #1f2937 !important;
          color: #f8fafc !important;
          border-radius: 8px;
        }
        .admin-input:focus {
          border-color: #fbbf24 !important;
        }
      `}</style>
    </div>
  );
};

export default Analytics;
