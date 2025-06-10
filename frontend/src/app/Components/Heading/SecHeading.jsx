import React from "react";
import "./heading.css";

// Add 'level' as a prop, with a default value (e.g., <h2> if not specified)
const Heading = ({ title, subtitle, level = 'h2' }) => {
  // Dynamically render the heading tag based on the 'level' prop
  const HeadingTag = level;

  return (
    <div className="heading-container container">
      {/* Use the dynamically determined HeadingTag */}
      <HeadingTag className="heading-title">{title}</HeadingTag>
      <p className="heading-subtitle m-0">{subtitle}</p>
    </div>
  );
};

export default Heading;