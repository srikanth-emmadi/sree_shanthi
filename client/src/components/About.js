import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./../styles/About.css";

function About() {
  return (
    <div>
      <Navbar />
      <div className="about-container">
        <h2>About Sree Shanthi Nagar Society</h2>
        <p>
          Sree Shanthi Nagar Society is a vibrant residential community built on
          the values of unity, harmony, and progress. Our society is home to
          families who share a vision of living together in peace while
          supporting each other in everyday life.
        </p>
        <p>
          We organize cultural events, community gatherings, and initiatives
          that bring residents closer. With modern amenities and a strong sense
          of belonging, Sree Shanthi Nagar Society is more than just a place to
          live — it’s a place to thrive.
        </p>
        <p>
          Our mission is to foster a safe, inclusive, and sustainable
          environment where every member feels valued and connected.
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default About;
