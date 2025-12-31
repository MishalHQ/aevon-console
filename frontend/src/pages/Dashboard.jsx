// Dashboard page
import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import StatCard from '../components/StatCard';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of all projects</p>
      </div>

      <div className="stats-grid">
        <StatCard 
          title="Total Projects" 
          value={stats?.totalProjects || 0}
          color="#3b82f6"
        />
        <StatCard 
          title="Active Projects" 
          value={stats?.activeProjects || 0}
          color="#10b981"
        />
        <StatCard 
          title="Completed Projects" 
          value={stats?.completedProjects || 0}
          color="#6366f1"
        />
        <StatCard 
          title="Demo Projects" 
          value={stats?.demoProjects || 0}
          color="#ec4899"
        />
      </div>
    </div>
  );
}

export default Dashboard;