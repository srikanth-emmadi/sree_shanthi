import React, { useState, useEffect } from "react";
import "./../styles/Slider.css";

import img1 from "./../assets/slider1.jpg";
import img2 from "./../assets/slider2.jpg";
import img3 from "./../assets/slider3.jpg";

const images = [img1, img2, img3];

function Slider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!paused) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [paused]);

  const goToSlide = (index) => setCurrent(index);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div
      className="slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="slides-wrapper" style={{ transform: `translateX(-${current * 100}%)` }}>
        {images.map((src, index) => (
          <div className="slide" key={index}>
            <img src={src} alt={`Slide ${index}`} />
          </div>
        ))}
      </div>

      {/* Gradient overlay behind text */}
      <div className="welcome-banner">
        <h2>Welcome to Sree Shanthi Nagar Society</h2>
        <p>Building community, together.</p>
      </div>

      <button className="arrow left" onClick={prevSlide}>❮</button>
      <button className="arrow right" onClick={nextSlide}>❯</button>

      <div className="dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === current ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default Slider;
