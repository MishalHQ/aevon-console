// StatCard component for dashboard
import React from 'react';

function StatCard({ title, value, color }) {
  return (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <h3 className="stat-title">{title}</h3>
      <p className="stat-value">{value}</p>
    </div>
  );
}

export default StatCard;