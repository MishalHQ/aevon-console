// Secure Admin Console - Dashboard Page
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from '../components/StatCard';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

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
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">
          <h3>⚠️ {error}</h3>
          <button onClick={fetchStats} className="btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>System overview and activity monitoring</p>
        </div>
      </div>

      {/* Users Statistics */}
      <div className="section-header">
        <h2>Users</h2>
      </div>
      <div className="stats-grid">
        <StatCard 
          title="Total Users" 
          value={stats.users.total}
          color="#E50914"
          icon="👥"
        />
        <StatCard 
          title="Active Users" 
          value={stats.users.active}
          color="#46D369"
          icon="✅"
        />
        <StatCard 
          title="Admins" 
          value={stats.users.admins}
          color="#FFD700"
          icon="🔑"
        />
        <StatCard 
          title="Viewers" 
          value={stats.users.viewers}
          color="#0080FF"
          icon="👁️"
        />
      </div>

      {/* Projects Statistics */}
      <div className="section-header">
        <h2>Projects</h2>
      </div>
      <div className="stats-grid">
        <StatCard 
          title="Total Projects" 
          value={stats.projects.total}
          color="#E50914"
          icon="📁"
        />
        <StatCard 
          title="Active" 
          value={stats.projects.active}
          color="#46D369"
          icon="🚀"
        />
        <StatCard 
          title="Completed" 
          value={stats.projects.completed}
          color="#0080FF"
          icon="✅"
        />
        <StatCard 
          title="Archived" 
          value={stats.projects.archived}
          color="#666"
          icon="📦"
        />
      </div>

      {/* Audit Logs Statistics */}
      <div className="section-header">
        <h2>Security & Activity</h2>
      </div>
      <div className="stats-grid">
        <StatCard 
          title="Total Audit Logs" 
          value={stats.auditLogs.total}
          color="#E50914"
          icon="📋"
        />
        <StatCard 
          title="Today's Activity" 
          value={stats.auditLogs.today}
          color="#46D369"
          icon="📊"
        />
      </div>

      {/* Recent Activity */}
      <div className="section-header">
        <h2>Recent Activity</h2>
      </div>

      <div className="activity-grid">
        {/* Recent Projects */}
        {stats.recentActivity.projects && stats.recentActivity.projects.length > 0 && (
          <div className="activity-section">
            <h3>Recent Projects</h3>
            <div className="activity-list">
              {stats.recentActivity.projects.map((project) => (
                <div key={project.id} className="activity-item">
                  <div className="activity-icon">📁</div>
                  <div className="activity-content">
                    <h4>{project.name}</h4>
                    <p>Owner: {project.owner_name}</p>
                  </div>
                  <span className={`status-badge status-${project.status}`}>
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Audit Logs */}
        {stats.recentActivity.auditLogs && stats.recentActivity.auditLogs.length > 0 && (
          <div className="activity-section">
            <h3>Recent Audit Logs</h3>
            <div className="activity-list">
              {stats.recentActivity.auditLogs.map((log) => (
                <div key={log.id} className="activity-item">
                  <div className="activity-icon">📝</div>
                  <div className="activity-content">
                    <h4>{log.action}</h4>
                    <p>{log.user_name} - {log.details}</p>
                    <small>{new Date(log.timestamp).toLocaleString()}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;