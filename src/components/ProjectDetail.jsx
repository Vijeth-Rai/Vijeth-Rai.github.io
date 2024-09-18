import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjectDisplay from './Project-Format';

const ProjectDetail = () => {
  const { dataFile } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        console.log(`Attempting to fetch: ${process.env.PUBLIC_URL}/data/${dataFile}`);
        const response = await fetch(`${process.env.PUBLIC_URL}/data/${dataFile}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Received project data:', data);
        setProjectData(data);
      } catch (error) {
        console.error('Error loading project data:', error);
        setError(`Failed to load project data: ${error.message}`);
      }
    };

    if (dataFile) {
      loadProjectData();
    }
  }, [dataFile]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="project-detail-page">
      {projectData ? (
        <ProjectDisplay {...projectData} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProjectDetail;