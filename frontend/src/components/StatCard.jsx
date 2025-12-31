// StatCard component for dashboard - Enhanced with icons
import React from 'react';

function StatCard({ title, value, color, icon }) {
  return (
    <div className="stat-card" style={{ borderTopColor: color }}>
      <div className="stat-header">
        {icon && <span className="stat-icon">{icon}</span>}
        <h3 className="stat-title">{title}</h3>
      </div>
      <p className="stat-value" style={{ color: color }}>{value}</p>
    </div>
  );
}

export default StatCard;