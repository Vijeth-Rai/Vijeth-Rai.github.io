import React, { useState, useEffect } from 'react';
import profilePic from '../image-2.png'; // Ensure this path is correct and the image is available
import './Home.css';
import Projects from './Projects'; // Import the Projects component

const Home = () => {
  const [typedText, setTypedText] = useState('');
  const [showProjects, setShowProjects] = useState(false);
  const [zoomEffect, setZoomEffect] = useState(false);
  const fullText = "I'm a Data Scientist and AI Engineer who excels at providing solutions to business problems.";

  useEffect(() => {
    setTypedText(fullText);

    let i = 0;
    const typingEffect = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingEffect);
      }
    }, 50);

    return () => clearInterval(typingEffect);
  }, [fullText]);

  const handleViewProjects = () => {
    setZoomEffect(true);
    setTimeout(() => {
      setShowProjects(true);
      window.scrollTo(0, 0); // Ensure the page scrolls to the top when projects are displayed
    }, 1000); // Match this duration with the CSS animation duration
  };

  return (
    <div className={`home ${zoomEffect ? 'zoom-out' : ''}`}>
      {!showProjects ? (
        <div className="content">
          <img src={profilePic} alt="Your Name" className="profile-pic" />
          <h1>Welcome to My Portfolio</h1>
          <p className="typed-text">{typedText}</p>
          <div className="cta-buttons">
            <button className="btn primary" onClick={handleViewProjects}>View Projects</button>
            <button className="btn secondary">Contact Me</button>
          </div>
          <div className="social-links">
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      ) : (
        <Projects />
      )}
    </div>
  );
};

export default Home;
