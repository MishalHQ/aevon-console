// Demo Showcase page (public)
import React, { useState, useEffect } from 'react';
import { projectsAPI } from '../services/api';
import ProjectCard from '../components/ProjectCard';

function DemoShowcase() {
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDemos();
  }, []);

  const fetchDemos = async () => {
    try {
      const response = await projectsAPI.getDemos();
      setDemos(response.data);
    } catch (err) {
      setError('Failed to load demo projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading demos...</div>;
  }

  return (
    <div className="demo-showcase">
      <div className="demo-header">
        <h1>AEVON</h1>
        <p className="demo-subtitle">Demo Showcase</p>
        <p className="demo-description">
          Explore our portfolio of projects and solutions
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {demos.length === 0 ? (
        <div className="empty-state">
          <p>No demo projects available at the moment.</p>
        </div>
      ) : (
        <div className="demos-grid">
          {demos.map(demo => (
            <ProjectCard
              key={demo.id}
              project={demo}
              readOnly={true}
            />
          ))}
        </div>
      )}

      <div className="demo-footer">
        <p>© 2024 AEVON. All rights reserved.</p>
      </div>
    </div>
  );
}

export default DemoShowcase;