// Demo Showcase page - Demo Projects Only
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
      // Get all projects and filter for demos
      const response = await projectsAPI.getAll();
      const demoProjects = response.data.filter(project => project.is_demo === 1 || project.is_demo === true);
      setDemos(demoProjects);
    } catch (err) {
      setError('Failed to load demo projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading showcase...</div>;
  }

  return (
    <div className="demo-showcase">
      <div className="demo-header">
        <h1>AEVON</h1>
        <p className="demo-subtitle">Project Showcase</p>
        <p className="demo-description">
          Explore our portfolio of demo projects and solutions
        </p>
      </div>

      {error && (
        <div className="error-message" style={{ maxWidth: '1400px', margin: '0 auto 2rem', padding: '0 3rem' }}>
          {error}
        </div>
      )}

      {demos.length === 0 ? (
        <div className="empty-state" style={{ maxWidth: '1400px', margin: '0 auto 4rem', padding: '0 3rem' }}>
          <p>No demo projects available at the moment.</p>
          <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: 'var(--netflix-light-gray)' }}>
            Demo projects are marked with the "Demo" badge and showcase our capabilities.
          </p>
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
        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: 'var(--netflix-light-gray)' }}>
          Showing {demos.length} demo project{demos.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}

export default DemoShowcase;