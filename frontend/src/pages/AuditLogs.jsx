// Secure Admin Console - Audit Logs Page
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ action: '', user_id: '' });
  const [pagination, setPagination] = useState({ limit: 50, offset: 0, total: 0 });

  useEffect(() => {
    fetchLogs();
  }, [pagination.offset, filter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        limit: pagination.limit,
        offset: pagination.offset,
        ...(filter.action && { action: filter.action }),
        ...(filter.user_id && { user_id: filter.user_id })
      });

      const response = await axios.get(`${API_URL}/audit-logs?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setLogs(response.data.logs);
      setPagination(prev => ({ ...prev, total: response.data.pagination.total }));
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }));
  };

  const handlePrevPage = () => {
    setPagination(prev => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }));
  };

  const getActionColor = (action) => {
    if (action.includes('LOGIN')) return 'info';
    if (action.includes('CREATED')) return 'success';
    if (action.includes('DELETED') || action.includes('DISABLED')) return 'danger';
    if (action.includes('UPDATED')) return 'warning';
    return 'default';
  };

  if (loading && logs.length === 0) {
    return <div className="page-container"><div className="loading">Loading audit logs...</div></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Audit Logs</h1>
          <p>System activity and security tracking (read-only)</p>
        </div>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label>Filter by Action:</label>
          <select 
            value={filter.action} 
            onChange={e => setFilter({...filter, action: e.target.value})}
          >
            <option value="">All Actions</option>
            <option value="USER_LOGIN">User Login</option>
            <option value="USER_LOGOUT">User Logout</option>
            <option value="USER_CREATED">User Created</option>
            <option value="USER_UPDATED">User Updated</option>
            <option value="USER_DISABLED">User Disabled</option>
            <option value="PROJECT_CREATED">Project Created</option>
            <option value="PROJECT_UPDATED">Project Updated</option>
            <option value="PROJECT_DELETED">Project Deleted</option>
            <option value="LOGIN_FAILED">Login Failed</option>
          </select>
        </div>
        <div className="pagination-info">
          Showing {pagination.offset + 1} - {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        <table className="data-table audit-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>User</th>
              <th>Details</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td className="timestamp">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td>
                  <span className={`action-badge action-${getActionColor(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td>
                  <div className="user-info">
                    <div className="user-name">{log.user_name || 'System'}</div>
                    <div className="user-email">{log.user_email}</div>
                  </div>
                </td>
                <td className="details">{log.details || '-'}</td>
                <td className="ip-address">{log.ip_address || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-controls">
        <button 
          onClick={handlePrevPage} 
          disabled={pagination.offset === 0}
          className="btn-secondary"
        >
          Previous
        </button>
        <span className="page-info">
          Page {Math.floor(pagination.offset / pagination.limit) + 1} of {Math.ceil(pagination.total / pagination.limit)}
        </span>
        <button 
          onClick={handleNextPage} 
          disabled={pagination.offset + pagination.limit >= pagination.total}
          className="btn-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AuditLogs;