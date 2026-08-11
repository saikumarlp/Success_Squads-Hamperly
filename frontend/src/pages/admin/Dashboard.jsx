import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { getAdminAnalyticsOverall, getAdminAnalyticsDaily } from '../../services/admin/analyticsService';
import { getAdminOrders } from '../../services/admin/orderService';
import { getAdminUsers } from '../../services/admin/userService';
import DashboardCard from '../../components/admin/DashboardCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const overallData = await getAdminAnalyticsOverall();
      setStats(overallData);

      const dailyData = await getAdminAnalyticsDaily();
      setDailyRevenue(dailyData.slice(-7)); // show last 7 days of sales

      const ordersData = await getAdminOrders();
      setRecentOrders(ordersData.slice(0, 5)); // show top 5 recent orders

      const usersData = await getAdminUsers({ page: 0, size: 5, sortBy: 'id', direction: 'DESC' });
      setRecentUsers(usersData.content || []);

      const revRes = await api.get('/admin/reviews/stats');
      setReviewStats(revRes.data);

      setLoading(false);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
      setError('Could not fetch analytics. Please check backend connection.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-2">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 className="m-0 fw-bold tracking-wide" style={{ color: '#f8fafc' }}>Dashboard</h2>
            <p className="text-secondary small m-0 mt-1">Analyzing shop activity and revenue stream...</p>
          </div>
          <button className="btn btn-secondary disabled py-2 px-3">
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Loading Data...
          </button>
        </div>

        {/* Skeleton Grid */}
        <div className="row g-3 mb-4">
          {[...Array(8)].map((_, i) => (
            <div className="col-12 col-sm-6 col-xl-3" key={i}>
              <div className="skeleton-card" style={{ height: '120px', borderRadius: '16px' }}></div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          <div className="col-12 col-xl-8">
            <div className="skeleton-card mb-4" style={{ height: '380px', borderRadius: '16px' }}></div>
          </div>
          <div className="col-12 col-xl-4">
            <div className="skeleton-card" style={{ height: '380px', borderRadius: '16px' }}></div>
          </div>
        </div>
        <style>{`
          .skeleton-card {
            background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
            background-size: 200% 100%;
            animation: skeleton-loading 1.5s infinite;
          }
          @keyframes skeleton-loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  // Calculate SVG line chart coordinates dynamically based on dailyRevenue
  const svgWidth = 700;
  const svgHeight = 240;
  const padding = 30;
  const chartWidth = svgWidth - padding * 2;
  const chartHeight = svgHeight - padding * 2;

  let pointsStr = '';
  let fillStr = '';
  let gridLines = [];
  let xLabels = [];
  let maxRevenue = 1000;

  if (dailyRevenue.length > 0) {
    maxRevenue = Math.max(...dailyRevenue.map((d) => d.revenue), 1000) * 1.1;
    dailyRevenue.forEach((d, idx) => {
      const x = padding + (idx / (dailyRevenue.length - 1)) * chartWidth;
      const y = padding + chartHeight - (d.revenue / maxRevenue) * chartHeight;
      pointsStr += `${x},${y} `;
      xLabels.push({ x, text: d.period.substring(5) }); // YYYY-MM-DD -> MM-DD
    });

    if (dailyRevenue.length > 0) {
      const firstX = padding;
      const lastX = padding + chartWidth;
      const bottomY = padding + chartHeight;
      fillStr = `${firstX},${bottomY} ${pointsStr} ${lastX},${bottomY}`;
    }
  }

  // Grid helper
  for (let i = 0; i <= 4; i++) {
    const yVal = padding + (i / 4) * chartHeight;
    const revVal = (maxRevenue - (i / 4) * maxRevenue).toFixed(0);
    gridLines.push({ y: yVal, label: `₹${revVal}` });
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="m-0 fw-bold tracking-wide" style={{ color: '#f8fafc' }}>Dashboard Overview</h2>
          <p className="text-secondary small m-0 mt-1">Real-time indicators and store operations.</p>
        </div>
        <div className="d-flex gap-2">
          <button onClick={loadData} className="btn btn-outline-secondary d-flex align-items-center gap-2 py-2 px-3 text-light" style={{ borderColor: '#334155' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 15H19" />
            </svg>
            <span>Refresh</span>
          </button>
          <Link to="/admin/analytics" className="btn btn-warning d-flex align-items-center gap-2 py-2 px-3 border-0 text-dark fw-semibold" style={{ backgroundColor: '#fbbf24' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Reports</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger border-0 mb-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
          {error}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <DashboardCard 
            title="Total Revenue" 
            value={`₹${stats?.totalRevenue?.toLocaleString('en-IN') || '0'}`} 
            gradient="linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <DashboardCard 
            title="Today's Revenue" 
            value={`₹${stats?.todayRevenue?.toLocaleString('en-IN') || '0'}`} 
            gradient="linear-gradient(135deg, #064e3b 0%, #0f172a 100%)"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <DashboardCard 
            title="Monthly Revenue" 
            value={`₹${stats?.monthlyRevenue?.toLocaleString('en-IN') || '0'}`} 
            gradient="linear-gradient(135deg, #581c87 0%, #0f172a 100%)"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <DashboardCard 
            title="Total Products" 
            value={stats?.totalProducts || 0} 
            gradient="linear-gradient(135deg, #78350f 0%, #0f172a 100%)"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <DashboardCard 
            title="Total Users" 
            value={stats?.totalUsers || 0} 
            gradient="linear-gradient(135deg, #111827 0%, #0f172a 100%)"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <DashboardCard 
            title="Orders Placement" 
            value={stats?.totalOrders || 0} 
            gradient="linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <DashboardCard 
            title="Pending Orders" 
            value={stats?.pendingOrders || 0} 
            gradient="linear-gradient(135deg, #824403 0%, #0f172a 100%)"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <DashboardCard 
            title="Out Of Stock" 
            value={stats?.outOfStockProducts || 0} 
            gradient="linear-gradient(135deg, #991b1b 0%, #0f172a 100%)"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <DashboardCard 
            title="Avg Product Rating" 
            value={`${reviewStats?.averageRating ? reviewStats.averageRating.toFixed(1) : '0.0'} ★`} 
            gradient="linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.253.588 1.81l-3.97 2.88a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.88a1 1 0 00-1.178 0l-3.97 2.88c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.88c-.773-.558-.375-1.81.588-1.81h4.907a1 1 0 00.95-.69l1.519-4.674z" />
              </svg>
            }
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <DashboardCard 
            title="Total Customer Reviews" 
            value={reviewStats?.totalReviews || 0} 
            gradient="linear-gradient(135deg, #311005 0%, #0f172a 100%)"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
          />
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Sales Trend Line Chart */}
        <div className="col-12 col-xl-8">
          <div className="card border-0 p-4 shadow-sm" style={{ borderRadius: '16px', backgroundColor: '#111827', border: '1px solid #1f2937' }}>
            <h5 className="text-white fw-bold mb-4 font-sans tracking-wide">Daily Revenue Curve</h5>
            <div className="ratio ratio-21x9 overflow-hidden rounded" style={{ height: '240px' }}>
              {dailyRevenue.length > 0 ? (
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height="100%">
                  <defs>
                    <linearGradient id="gradientLine" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  {gridLines.map((line, i) => (
                    <g key={i}>
                      <line x1={padding} y1={line.y} x2={svgWidth - padding} y2={line.y} stroke="#1f2937" strokeWidth="1" />
                      <text x={padding - 5} y={line.y + 4} fill="#64748b" fontSize="10" textAnchor="end" fontWeight="500">
                        {line.label}
                      </text>
                    </g>
                  ))}

                  {/* Gradient Area Fill */}
                  <polygon points={fillStr} fill="url(#gradientLine)" />

                  {/* Smooth line */}
                  <polyline points={pointsStr} fill="none" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

                  {/* Highlight dots */}
                  {dailyRevenue.map((d, idx) => {
                    const x = padding + (idx / (dailyRevenue.length - 1)) * chartWidth;
                    const y = padding + chartHeight - (d.revenue / maxRevenue) * chartHeight;
                    return (
                      <g key={idx} className="chart-dot">
                        <circle cx={x} cy={y} r="5" fill="#fbbf24" stroke="#111827" strokeWidth="2" />
                        <title>{`${d.period}: ₹${d.revenue}`}</title>
                      </g>
                    );
                  })}

                  {/* X Labels */}
                  {xLabels.map((lbl, idx) => (
                    <text key={idx} x={lbl.x} y={svgHeight - 8} fill="#64748b" fontSize="10" textAnchor="middle" fontWeight="500">
                      {lbl.text}
                    </text>
                  ))}
                </svg>
              ) : (
                <div className="d-flex align-items-center justify-content-center text-secondary">
                  No sales trends available.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="col-12 col-xl-4">
          <div className="card border-0 p-4 shadow-sm h-100" style={{ borderRadius: '16px', backgroundColor: '#111827', border: '1px solid #1f2937' }}>
            <h5 className="text-white fw-bold mb-4 font-sans tracking-wide">Quick Operations</h5>
            <div className="d-flex flex-column gap-3">
              <button onClick={() => navigate('/admin/products')} className="btn btn-outline-warning w-100 py-2.5 text-start px-3 d-flex align-items-center justify-content-between transition-all outline-hover-glow" style={{ borderRadius: '10px' }}>
                <div className="d-flex align-items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="fw-semibold">Add New Product</span>
                </div>
                <span>&rarr;</span>
              </button>
              <button onClick={() => navigate('/admin/users')} className="btn btn-outline-primary w-100 py-2.5 text-start px-3 d-flex align-items-center justify-content-between transition-all outline-hover-glow" style={{ borderRadius: '10px' }}>
                <div className="d-flex align-items-center gap-2 text-primary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  </svg>
                  <span className="fw-semibold">Modify User Privileges</span>
                </div>
                <span>&rarr;</span>
              </button>
              <button onClick={() => navigate('/admin/analytics')} className="btn btn-outline-info w-100 py-2.5 text-start px-3 d-flex align-items-center justify-content-between transition-all outline-hover-glow" style={{ borderRadius: '10px' }}>
                <div className="d-flex align-items-center gap-2 text-info">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="fw-semibold">Export Detailed CSV Report</span>
                </div>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Recent Orders table */}
        <div className="col-12 col-xl-8">
          <div className="card border-0 p-4 shadow-sm" style={{ borderRadius: '16px', backgroundColor: '#111827', border: '1px solid #1f2937' }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h5 className="text-white fw-bold m-0 font-sans tracking-wide">Recent Placed Orders</h5>
              <Link to="/admin/orders" className="text-warning text-decoration-none small font-semibold hover-gold">
                View All &rarr;
              </Link>
            </div>
            
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle m-0" style={{ backgroundColor: 'transparent' }}>
                <thead>
                  <tr style={{ color: '#94a3b8', borderBottom: '1px solid #1f2937' }}>
                    <th className="py-3 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider">Order ID</th>
                    <th className="py-3 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider">Customer</th>
                    <th className="py-3 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider">Amount</th>
                    <th className="py-3 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider">Status</th>
                    <th className="py-3 border-0 bg-transparent fs-8 font-semibold text-uppercase tracking-wider">Placed Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length > 0 ? (
                    recentOrders.map((o) => (
                      <tr key={o.orderId} style={{ borderBottom: '1px solid #1f2937' }}>
                        <td className="py-3 border-0 bg-transparent font-monospace text-truncate" style={{ maxWidth: '140px', color: '#fbbf24' }}>
                          {o.orderId}
                        </td>
                        <td className="py-3 border-0 bg-transparent">
                          <div>
                            <span className="d-block fw-semibold text-white">{o.customerName}</span>
                            <small className="text-secondary" style={{ fontSize: '0.75rem' }}>{o.customerEmail}</small>
                          </div>
                        </td>
                        <td className="py-3 border-0 bg-transparent fw-semibold text-white">
                          ₹{o.totalAmount?.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 border-0 bg-transparent">
                          <span className={`badge px-2.5 py-1.5 rounded-pill fs-9 text-uppercase font-bold ${
                            o.status === 'SUCCESS' ? 'bg-success-subtle border border-success text-success' :
                            o.status === 'PENDING' ? 'bg-warning-subtle border border-warning text-warning' :
                            'bg-danger-subtle border border-danger text-danger'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 border-0 bg-transparent text-secondary small">
                          {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-secondary">
                        No orders recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Registered Users List */}
        <div className="col-12 col-xl-4">
          <div className="card border-0 p-4 shadow-sm" style={{ borderRadius: '16px', backgroundColor: '#111827', border: '1px solid #1f2937' }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h5 className="text-white fw-bold m-0 font-sans tracking-wide">Recent Active Users</h5>
              <Link to="/admin/users" className="text-warning text-decoration-none small font-semibold hover-gold">
                View All &rarr;
              </Link>
            </div>

            <div className="d-flex flex-column gap-3">
              {recentUsers.length > 0 ? (
                recentUsers.map((u) => (
                  <div key={u.id} className="d-flex align-items-center justify-content-between p-2 rounded hover-user-card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white font-semibold" style={{ width: '38px', height: '38px', backgroundColor: '#4b5563' }}>
                        {u.fullName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="d-block fw-semibold text-white text-truncate" style={{ maxWidth: '140px', fontSize: '0.9rem' }}>{u.fullName}</span>
                        <small className="text-secondary" style={{ fontSize: '0.75rem' }}>{u.email}</small>
                      </div>
                    </div>
                    <div>
                      <span className={`badge rounded px-2 py-1 fs-9 font-bold ${
                        u.role === 'ADMIN' ? 'bg-danger text-light' : 'bg-primary text-light'
                      }`}>
                        {u.role}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-secondary">
                  No registered users.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .chart-dot {
          cursor: pointer;
        }
        .chart-dot:hover circle {
          r: 7;
          fill: #ffffff;
        }
        .bg-warning-subtle {
          background-color: rgba(234, 179, 8, 0.1) !important;
        }
        .bg-danger-subtle {
          background-color: rgba(239, 68, 68, 0.1) !important;
        }
        .outline-hover-glow:hover {
          box-shadow: 0 0 10px rgba(251, 191, 36, 0.1);
        }
        .hover-user-card:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
