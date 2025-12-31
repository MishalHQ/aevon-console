// Enhanced ProjectCard component with Netflix-style animations
import React from 'react';

function ProjectCard({ project, onEdit, onDelete, readOnly }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Planned': return '#FFA500';
      case 'Active': return '#46D369';
      case 'Completed': return '#0080FF';
      default: return '#808080';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Business': return '#E50914';
      case 'Student': return '#8b5cf6';
      case 'Internal Demo': return '#FFD700';
      default: return '#808080';
    }
  };

  return (
    <div className="project-card">
      <div className="project-content">
        <div className="project-header">
          <div>
            <h3 className="project-name">{project.name}</h3>
          </div>
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
              <span className="badge badge-demo">★ Featured</span>
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
    </div>
  );
}

export default ProjectCard;