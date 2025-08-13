import React, { useState, useEffect } from 'react';
import './ImageCarousel.css';
import { useUserInteraction } from './UserInteractionContext';
import TextBoxIcon from './TextBoxIcon';

// Import all images from the Sticks folder
import stickImage1 from '../assets/Sticks/1751373226401.avif';
import stickImage2 from '../assets/Sticks/UBS stick kite.png';
// Removed UBS sticks.png from rotation
import stickImage4 from '../assets/Sticks/man-woman-group-collaboration-element.svg';
import stickImage5 from '../assets/Sticks/scik deal.png';
import stickImage6 from '../assets/Sticks/stick twint.svg';
import stickImage7 from '../assets/Sticks/stick.png';
import stickImage8 from '../assets/Sticks/ubs sitkc.svg';
import stickImage9 from '../assets/Sticks/woman-graph-arrow.svg';

function ImageCarousel() {
  const { lastInteraction } = useUserInteraction();
  
  const images = [
    { src: stickImage1, alt: 'UBS Stick Image 1' },
    { src: stickImage2, alt: 'UBS Stick Kite' },
    // Removed UBS Sticks image from rotation
    { src: stickImage4, alt: 'Collaboration' },
    { src: stickImage5, alt: 'Stick Deal' },
    { src: stickImage6, alt: 'Stick Twint', className: 'cropped-twint-svg' },
    { src: stickImage7, alt: 'Stick' },
    { src: stickImage8, alt: 'UBS Stick', className: 'enlarged-svg' },
    { src: stickImage9, alt: 'Woman Graph Arrow' },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Rotate images when text changes (when lastInteraction changes)
  useEffect(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [lastInteraction, images.length]);

  // Auto-rotation only, no manual navigation

  return (
    <div className="image-carousel" style={{ position: 'relative' }}>
      <div className="carousel-container">
        <div className="carousel-image-container">
          <img 
            key={currentImageIndex}
            src={images[currentImageIndex].src} 
            alt={images[currentImageIndex].alt} 
            className={`carousel-image ${images[currentImageIndex].className || ''}`}
            style={{ opacity: 1 }}
          />
        </div>
      </div>
      <TextBoxIcon />
    </div>
  );
}

export default ImageCarousel;