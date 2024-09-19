import React from 'react';
import ReactDOM from 'react-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './Project-Format.css';  // We'll update this CSS file

// Add this at the top of your file, outside of the component
const imageContext = require.context('./Project-images', false, /\.(avif|png|jpe?g|gif)$/);
console.log('Available images:', imageContext.keys());

function ProjectDisplay({ title, summary, projectImage, contentSections, githubLink }) {
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
    
    const createMarkup = (htmlContent) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const codeBlocks = doc.querySelectorAll('pre code');
      
      codeBlocks.forEach((codeBlock) => {
        const language = codeBlock.className.replace('language-', '');
        const code = codeBlock.textContent;
        
        const highlightedCode = (
          <SyntaxHighlighter 
            language={language || 'text'} 
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '1em',
              borderRadius: '5px',
              maxWidth: '100%',
              overflowX: 'auto'
            }}
          >
            {code}
          </SyntaxHighlighter>
        );
        
        const highlightedElement = document.createElement('div');
        ReactDOM.render(highlightedCode, highlightedElement);
        codeBlock.parentNode.replaceWith(highlightedElement);
      });

      return { __html: doc.body.innerHTML };
    };

    const processImageField = (imageField) => {
      const parts = imageField.split('<br>');
      const imageName = parts[parts.length - 1].trim();
      const brCount = parts.length - 1;
      return { imageName, brCount };
    };

    switch (type) {
      case 'text-left':
      case 'text-right':
        return (
          <div key={index} className={`container ${type}`}>
            {header && <h2>{header}</h2>}
            <p dangerouslySetInnerHTML={createMarkup(text)} />
          </div>
        );
      case 'image-left':
      case 'image-right':
        const { imageName, brCount } = processImageField(image);
        const contentImageSrc = getImage(imageName);
        return (
          <div key={index} className={`container ${type}`}>
            {[...Array(brCount)].map((_, i) => <br key={i} />)}
            {contentImageSrc && (
              <img 
                src={contentImageSrc} 
                alt="" 
                onError={(e) => e.target.style.display = 'none'} 
              />
            )}
          </div>
        );
      case 'text-full':
        if (text.includes('youtube.com')) {
          // Extract video ID from YouTube URL
          const videoId = text.split('v=')[1].split('&')[0];
          return (
            <div key={index} className={`container ${type}`}>
              {header && <h2>{header}</h2>}
              <div className="video-container">
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          );
        } else {
          return (
            <div key={index} className={`container ${type}`}>
              {header && <h2>{header}</h2>}
              <p dangerouslySetInnerHTML={createMarkup(text)} />
            </div>
          );
        }
      case 'image-full':
        const { imageName: fullImageName, brCount: fullBrCount } = processImageField(image);
        const fullContentImageSrc = getImage(fullImageName);
        return (
          <div key={index} className={`conatiner ${type}`}>
            {[...Array(fullBrCount)].map((_, i) => <br key={i} />)}
            {fullContentImageSrc && (
              <img 
                src={fullContentImageSrc} 
                alt="" 
                onError={(e) => e.target.style.display = 'none'} 
              />
            )}
          </div>
        );
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
            <h1 className="project-title">{title}</h1>
            <p>{summary}</p>
            {githubLink && (
              <a href={githubLink} className="github-button" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            )}
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
