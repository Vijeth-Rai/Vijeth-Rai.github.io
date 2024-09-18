import React from 'react';
import './Project-Format.css';  // We'll update this CSS file

// Add this at the top of your file, outside of the component
const imageContext = require.context('./Project-images', false, /\.(avif|png|jpe?g|gif)$/);
console.log('Available images:', imageContext.keys());

function ProjectDisplay({ title, summary, projectImage, contentSections }) {
  console.log('ProjectDisplay props:', { title, summary, projectImage, contentSections });

  const getImage = (imageName) => {
    const fileName = imageName.split('.')[0];
    const availableImages = imageContext.keys();
    console.log(`Looking for image with base name: ${fileName}`);
    
    const matchingImage = availableImages.find(path => 
      path.startsWith(`./${fileName}.`) || path.startsWith(`/${fileName}.`)
    );

    if (matchingImage) {
      console.log(`Found matching image: ${matchingImage}`);
      return imageContext(matchingImage);
    } else {
      console.error(`Error: No matching image found for ${fileName}`);
      return null;
    }
  };

  const mainImageSrc = getImage(projectImage);
  console.log('Main image source:', mainImageSrc);

  const renderContentSection = (section, index) => {
    const { type, text, image, header } = section;
    const contentImageSrc = image ? getImage(image) : null;

    switch (type) {
      case 'text-left':
      case 'text-right':
        return (
          <div key={index} className={`content ${type}`}>
            {header && <h3>{header}</h3>}
            <p>{text}</p>
          </div>
        );
      case 'image-left':
      case 'image-right':
        return contentImageSrc ? (
          <div key={index} className={`content ${type}`}>
            <img src={contentImageSrc} alt="" onError={(e) => e.target.style.display = 'none'} />
          </div>
        ) : null;
      case 'text-full':
        return (
          <div key={index} className={`content ${type}`}>
            {header && <h3>{header}</h3>}
            <p>{text}</p>
          </div>
        );
      case 'image-full':
        return contentImageSrc ? (
          <div key={index} className={`content ${type}`}>
            <img src={contentImageSrc} alt="" onError={(e) => e.target.style.display = 'none'} />
          </div>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="project-display-container">
      <div className="project-display">
        <div className="project-header">
          {mainImageSrc ? (
            <img 
              src={mainImageSrc} 
              alt={`Project snapshot for ${title}`} 
              className="project-image"
              onError={(e) => {
                console.error('Image failed to load:', e);
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <p>Image not available: {projectImage}</p>
          )}
          <div className="project-title-summary">
            <h2 className="project-title">{title}</h2>
            <p>{summary}</p>
            <a href="https://github.com/your-username/your-repo" class="github-button">GitHub</a>
          </div>
        </div>
        
        {contentSections.map((row, rowIndex) => (
          <div key={rowIndex} className="content-row">
            {Array.isArray(row) 
              ? row.map((section, sectionIndex) => renderContentSection(section, `${rowIndex}-${sectionIndex}`))
              : renderContentSection(row, rowIndex)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectDisplay;
