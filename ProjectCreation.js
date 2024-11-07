import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('http://localhost:5000/api/projects', { name: projectName }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(`/project/${response.data._id}/components`);
    } catch (err) {
      setError('Failed to create project.');
    }
  };

  return (
    <div>
      <h2>Create Project</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleCreateProject}>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project Name"
          required
        />
        <button type="submit">Create Project</button>
      </form>
    </div>
  );
};

export default CreateProject;
