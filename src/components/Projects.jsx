import React from 'react';
import './Projects.css';
import projectImage1 from './Project-images/image1.avif';
import projectImage2 from './Project-images/image2.avif';
import projectImage3 from './Project-images/image3.avif';

const Projects = () => {
  const projects = [
    {
      title: "Master's Dissertation: When Words Are Not Enough - A Multimodal Sarcasm Detection AI",
      description: "The future of AI shows promising possibilities in the field of communication, with a variety of applications in therapy, retail, customer service, and more. Despite the significant progress in AI, there is a lack of research that explores the extent to which AI can be used to distinguish passive aggression or sarcasm using multimodal inputs. This study investigates the potential of AI in recognizing subtle forms of human expressions in conversations. This paper introduces an innovative framework that combines early fusion and late fusion with ensemble methods. The study demonstrates a 1.2% improvement in performance over existing research in this domain and an error reduction rate of 56.5%.",
      image: projectImage1
    },
    {
      title: "Microsoft Malware Detection",
      description: "Malware, or malicious software, is any program intended to disrupt, damage, or gain unauthorized access to computer systems. Traditional antivirus methods struggle to keep pace with the rapid evolution of malware techniques. However, the rise of machine learning (ML) offers a beacon of hope, providing new tools to enhance our cybersecurity arsenal.",
      image: projectImage2
    },
  ];

  return (
    <div className="projects-page">
      <header className="projects-header">
        <h1>My Projects</h1>
        <p>Welcome to my portfolio of projects. Here you'll find a selection of my work in AI, cybersecurity, and gaming technology.</p>
      </header>
      {projects.map((project, index) => (
        <section key={index} className={`project-section ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
          <div className="project-content">
            <div className="project-text">
              <h2>{project.title}</h2>
              <p>{project.description}</p>
            </div>
            <img src={project.image} alt={project.title} className="project-image" />
          </div>
        </section>
      ))}
    </div>
  );
};

export default Projects;
