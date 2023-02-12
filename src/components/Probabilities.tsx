import React from "react";

import "../styles/probabilites.css";

const Probabilities = ({ predictions }: any) => (
  <div className="probabilites-container">
    <h2 style={{ marginLeft: "5px" }}>Probability:</h2>
    {predictions.map(
      ({ className, probability }: any) =>
        probability.toFixed(3) > 0 && (
          <div className="probabilites" key={className}>
            {className.split(",")[0]} {probability.toFixed(3)}%
          </div>
        )
    )}
  </div>
);

export default Probabilities;
