// Projects page - Real Projects Only (Non-Demo)
import React, { useState, useEffect } from 'react';
import { projectsAPI } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      // Filter out demo projects - show only real projects
      const realProjects = response.data.filter(project => !project.is_demo);
      setProjects(realProjects);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await projectsAPI.delete(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete project');
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      // Ensure is_demo is false for real projects
      const projectData = { ...formData, is_demo: false };
      
      if (editingProject) {
        // Update existing project
        const response = await projectsAPI.update(editingProject.id, projectData);
        setProjects(projects.map(p => p.id === editingProject.id ? response.data : p));
      } else {
        // Create new project
        const response = await projectsAPI.create(projectData);
        setProjects([response.data, ...projects]);
      }
      setShowForm(false);
      setEditingProject(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save project');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Projects</h1>
          <p>Manage your real business projects</p>
        </div>
        <button onClick={handleCreate} className="btn-primary">
          + New Project
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {projects.length === 0 ? (
        <div className="empty-state">
          <p>No projects yet. Create your first project!</p>
          <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: 'var(--netflix-light-gray)' }}>
            Demo projects are shown in the Showcase section.
          </p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm && (
        <ProjectForm
          project={editingProject}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default Projects;