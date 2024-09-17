import React, { useEffect, useState } from 'react';
import './Projects.css';
import projectImage1 from './Project-images/image1.avif';
import projectImage2 from './Project-images/image2.avif';
import projectImage3 from './Project-images/image3.avif';
import projectImage4 from './Project-images/image4.avif';
import projectImage5 from './Project-images/image5.avif';
import ParticleBackground from './ParticleBackground';

const Projects = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliding, setSliding] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 50000);

    return () => clearInterval(interval);
  }, []);

  const projects = [
    {
      title: "Multimodal Sarcasm Detection AI",
      description: "Revolutionizing communication with AI that understands subtle human expressions.",
      image: projectImage1,
      ctaText: "Learn More"
    },
    {
      title: "Microsoft Malware Detection",
      description: "Enhancing cybersecurity with machine learning to combat evolving malware threats.",
      image: projectImage2,
      ctaText: "Explore Project"
    },
    {
      title: "AI-Powered Gaming Experience",
      description: "Creating immersive gaming worlds with advanced AI technology.",
      image: projectImage3,
      ctaText: "Play Demo"
    },
    {
      title: "Blockchain for Supply Chain",
      description: "Implementing transparent and secure supply chain management using blockchain.",
      image: projectImage4,
      ctaText: "View Case Study"
    },
    {
      title: "Quantum Computing Research",
      description: "Pushing the boundaries of computation with quantum algorithms.",
      image: projectImage5,
      ctaText: "Read Paper"
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
      transform = 'translateX(50%) scale(0.8) rotateY(-10deg)';
      zIndex = 2;
      opacity = 0.7;
    } else if (diff === -1 || diff === 4) {
      transform = 'translateX(-50%) scale(0.8) rotateY(10deg)';
      zIndex = 2;
      opacity = 0.7;
    } else {
      transform = `translateX(${diff < 0 ? '-' : ''}100%) scale(0.6) rotateY(${diff < 0 ? '' : '-'}20deg)`;
      zIndex = 1;
      opacity = 0.5;
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
                <button className="cta-button">{project.ctaText}</button>
              </div>
            </section>
          ))}
          <div className="navigation-area left" onClick={prevSlide}>
            <div className="nav-indicator"></div>
          </div>
          <div className="navigation-area right" onClick={nextSlide}>
            <div className="nav-indicator"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
