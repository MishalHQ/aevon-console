// ProjectCard component
import React from 'react';

function ProjectCard({ project, onEdit, onDelete, readOnly }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Planned': return '#fbbf24';
      case 'Active': return '#10b981';
      case 'Completed': return '#6366f1';
      default: return '#6b7280';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Business': return '#3b82f6';
      case 'Student': return '#8b5cf6';
      case 'Internal Demo': return '#ec4899';
      default: return '#6b7280';
    }
  };

  return (
    <div className="project-card">
      <div className="project-header">
        <h3 className="project-name">{project.name}</h3>
        <div className="project-badges">
          <span 
            className="badge" 
            style={{ backgroundColor: getTypeColor(project.type) }}
          >
            {project.type}
          </span>
          <span 
            className="badge" 
            style={{ backgroundColor: getStatusColor(project.status) }}
          >
            {project.status}
          </span>
          {project.is_demo === 1 && (
            <span className="badge badge-demo">Demo</span>
          )}
        </div>
      </div>
      
      {project.description && (
        <p className="project-description">{project.description}</p>
      )}
      
      {project.tech_stack && (
        <div className="project-tech">
          <strong>Tech Stack:</strong> {project.tech_stack}
        </div>
      )}
      
      {!readOnly && (
        <div className="project-actions">
          <button onClick={() => onEdit(project)} className="btn-edit">
            Edit
          </button>
          <button onClick={() => onDelete(project.id)} className="btn-delete">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default ProjectCard;