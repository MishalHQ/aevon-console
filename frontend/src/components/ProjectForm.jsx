// ProjectForm component for create/edit
import React, { useState, useEffect } from 'react';

function ProjectForm({ project, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Business',
    status: 'Planned',
    description: '',
    tech_stack: '',
    is_demo: false,
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        type: project.type || 'Business',
        status: project.status || 'Planned',
        description: project.description || '',
        tech_stack: project.tech_stack || '',
        is_demo: project.is_demo === 1,
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{project ? 'Edit Project' : 'Create New Project'}</h2>
        
        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-group">
            <label>Project Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter project name"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Type *</label>
              <select name="type" value={formData.type} onChange={handleChange} required>
                <option value="Business">Business</option>
                <option value="Student">Student</option>
                <option value="Internal Demo">Internal Demo</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select name="status" value={formData.status} onChange={handleChange} required>
                <option value="Planned">Planned</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Enter project description"
            />
          </div>

          <div className="form-group">
            <label>Tech Stack</label>
            <input
              type="text"
              name="tech_stack"
              value={formData.tech_stack}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, MongoDB"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_demo"
                checked={formData.is_demo}
                onChange={handleChange}
              />
              <span>Show in Demo Showcase</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {project ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectForm;