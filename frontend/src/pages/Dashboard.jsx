// Dashboard page - Enhanced with Business Statistics
import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import StatCard from '../components/StatCard';
import '../Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching dashboard stats...');
      const response = await dashboardAPI.getStats();
      console.log('Dashboard API response:', response);
      
      if (response && response.data) {
        console.log('Stats data:', response.data);
        setStats(response.data);
      } else {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Dashboard error details:', {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data
      });
      
      let errorMessage = 'Failed to fetch dashboard statistics';
      
      if (err.response?.status === 401) {
        errorMessage = 'Please login again';
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please check backend logs.';
      } else if (err.message === 'Network Error') {
        errorMessage = 'Cannot connect to backend. Is it running on port 5001?';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-skeleton">
          <div className="skeleton-header"></div>
          <div className="stats-grid">
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">
          <h3>⚠️ {error}</h3>
          <p>Troubleshooting steps:</p>
          <ul>
            <li>Check if backend is running: <code>http://localhost:5001/health</code></li>
            <li>Check browser console (F12) for detailed errors</li>
            <li>Verify you're logged in (check localStorage for token)</li>
            <li>Try logging out and logging in again</li>
          </ul>
          <button onClick={fetchStats} className="btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="page-container">
        <div className="error-message">
          <h3>⚠️ No data available</h3>
          <button onClick={fetchStats} className="btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  // Format currency in INR (₹) - just symbol change, no conversion
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Business overview and statistics</p>
        </div>
      </div>

      {/* Projects Statistics */}
      <div className="section-header">
        <h2>Projects</h2>
      </div>
      <div className="stats-grid">
        <StatCard 
          title="Total Projects" 
          value={stats?.projects?.total || 0}
          color="#E50914"
          icon="📊"
        />
        <StatCard 
          title="Active Projects" 
          value={stats?.projects?.active || 0}
          color="#46D369"
          icon="🚀"
        />
        <StatCard 
          title="Completed Projects" 
          value={stats?.projects?.completed || 0}
          color="#0080FF"
          icon="✅"
        />
        <StatCard 
          title="Planned Projects" 
          value={stats?.projects?.planned || 0}
          color="#FFD700"
          icon="📅"
        />
      </div>

      {/* Business Statistics */}
      <div className="section-header">
        <h2>Business</h2>
      </div>
      <div className="stats-grid">
        <StatCard 
          title="Total Clients" 
          value={stats?.clients?.total || 0}
          color="#E50914"
          icon="👥"
        />
        <StatCard 
          title="Active Clients" 
          value={stats?.clients?.active || 0}
          color="#46D369"
          icon="✨"
        />
        <StatCard 
          title="Total Leads" 
          value={stats?.leads?.total || 0}
          color="#FFD700"
          icon="🎯"
        />
        <StatCard 
          title="Lead Value" 
          value={formatCurrency(stats?.leads?.totalValue || 0)}
          color="#0080FF"
          icon="💰"
        />
      </div>

      {/* Tasks Statistics */}
      <div className="section-header">
        <h2>Tasks</h2>
      </div>
      <div className="stats-grid">
        <StatCard 
          title="Total Tasks" 
          value={stats?.tasks?.total || 0}
          color="#E50914"
          icon="📋"
        />
        <StatCard 
          title="In Progress" 
          value={stats?.tasks?.inProgress || 0}
          color="#FFD700"
          icon="⏳"
        />
        <StatCard 
          title="Completed" 
          value={stats?.tasks?.done || 0}
          color="#46D369"
          icon="✅"
        />
        <StatCard 
          title="Completion Rate" 
          value={`${stats?.tasks?.completionRate || 0}%`}
          color="#0080FF"
          icon="📈"
        />
      </div>

      {/* Revenue Statistics */}
      <div className="section-header">
        <h2>Revenue</h2>
      </div>
      <div className="stats-grid">
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(stats?.revenue?.total || 0)}
          color="#E50914"
          icon="💵"
        />
        <StatCard 
          title="Completed" 
          value={formatCurrency(stats?.revenue?.completed || 0)}
          color="#46D369"
          icon="✅"
        />
        <StatCard 
          title="Active" 
          value={formatCurrency(stats?.revenue?.active || 0)}
          color="#FFD700"
          icon="🚀"
        />
        <StatCard 
          title="Projected" 
          value={formatCurrency(stats?.revenue?.projected || 0)}
          color="#0080FF"
          icon="📊"
        />
      </div>

      {/* Recent Activity */}
      {stats?.recentActivity && (
        <>
          <div className="section-header">
            <h2>Recent Activity</h2>
          </div>
          
          <div className="recent-activity-grid">
            {/* Recent Projects */}
            {stats.recentActivity.projects && stats.recentActivity.projects.length > 0 && (
              <div className="activity-section">
                <h3>Recent Projects</h3>
                <div className="activity-list">
                  {stats.recentActivity.projects.slice(0, 5).map((project) => (
                    <div key={project.id} className="activity-item">
                      <div className="activity-icon">📁</div>
                      <div className="activity-content">
                        <h4>{project.name}</h4>
                        <p>{project.client_company || 'No client'} • {project.status}</p>
                      </div>
                      <span className={`status-badge status-${project.status.toLowerCase()}`}>
                        {project.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Tasks */}
            {stats.recentActivity.tasks && stats.recentActivity.tasks.length > 0 && (
              <div className="activity-section">
                <h3>Recent Tasks</h3>
                <div className="activity-list">
                  {stats.recentActivity.tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="activity-item">
                      <div className="activity-icon">✓</div>
                      <div className="activity-content">
                        <h4>{task.title}</h4>
                        <p>{task.project_name || 'No project'}</p>
                      </div>
                      <span className={`status-badge status-${task.status.toLowerCase().replace(' ', '-')}`}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;