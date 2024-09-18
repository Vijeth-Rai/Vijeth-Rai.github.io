import React, { useState } from 'react';
import './Projects.css';
import projectImage1 from './Project-images/image1.avif';
import projectImage2 from './Project-images/image2.avif';
import projectImage3 from './Project-images/image3.avif';
import projectImage4 from './Project-images/image4.avif';
import projectImage5 from './Project-images/image5.avif';
import ParticleBackground from './ParticleBackground';
import { Link } from 'react-router-dom';

const Projects = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliding, setSliding] = useState(false);

  const projects = [
    {
      title: "Sarcasm Detection on Videos",
      description: "Advanced AI interpreting complex human expressions and humor nuances.",
      image: projectImage1,
      ctaText: "View More",
      dataFile: "project1.json"
    },
    {
      title: "Microsoft Malware Detection",
      description: "AI-driven cybersecurity solution for next-gen malware threats.",
      image: projectImage2,
      ctaText: "Explore Project",
      dataFile: "project2.json"
    },
    {
      title: "AI-Powered Gaming Experience",
      description: "Leverage cutting-edge AI for unmatched in-game strategies.",
      image: projectImage3,
      ctaText: "Play Demo",
      dataFile: "ai-powered-gaming-experience"
    },
    {
      title: "GitHub AI Bot",
      description: "Intelligent automation for labeling issues and discussions.",
      image: projectImage4,
      ctaText: "Read More",
      dataFile: "github-ai-bot"
    },
    {
      title: "Auto Anonymize",
      description: "Sophisticated AI auto-blurs non-owner faces in media.",
      image: projectImage5,
      ctaText: "Read Paper",
      dataFile: "auto-anonymize"
    },
  ];
  
  const getCardStyle = (index) => {
    const diff = (index - currentIndex + projects.length) % projects.length;
    let transform = '';
    let zIndex = 0;
    let opacity = 1;

    if (diff === 0) {
      transform = 'translateX(0) scale(1)';
      zIndex = 3;
    } else if (diff === 1 || diff === -4) {
      transform = 'translateX(50%) scale(0.5) rotateY(-100deg)';
      zIndex = 2;
      opacity = 0.3;
    } else if (diff === -1 || diff === 4) {
      transform = 'translateX(-50%) scale(0.5) rotateY(100deg)';
      zIndex = 2;
      opacity = 0.3;
    } else {
      transform = `translateX(${diff < 0 ? '-' : ''}100%) scale(0) rotateY(${diff < 0 ? '' : '-'}20deg)`;
      zIndex = 1;
      opacity = 0;
    }

    return { transform, zIndex, opacity };
  };

  const nextSlide = () => {
    setSliding('right');
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
      setSliding(false);
    }, 500);
  };

  const prevSlide = () => {
    setSliding('left');
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length);
      setSliding(false);
    }, 500);
  };

  return (
    <div className="projects-page">
      <ParticleBackground />
      <div className="slider-container">
        <div className={`project-slider ${sliding ? `sliding-${sliding}` : ''}`}>
          {projects.map((project, index) => (
            <section 
              key={index}
              className={`project-section ${index === currentIndex ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${project.image})`,
                ...getCardStyle(index)
              }}
            >
              <div className="project-content">
                <h2 className="project-title">{project.title}</h2>
                <p className="project-description">{project.description}</p>
              </div>
              <div className="project-cta">
                <Link 
                  to={`/project/${project.dataFile}`}
                  className="cta-button"
                >
                  {project.ctaText}
                </Link>
              </div>
            </section>
          ))}
        </div>
        <div className="navigation-area left" onClick={prevSlide}>
          <div className="nav-indicator"></div>
        </div>
        <div className="navigation-area right" onClick={nextSlide}>
          <div className="nav-indicator"></div>
        </div>
      </div>
    </div>
  );
};

export default Projects;