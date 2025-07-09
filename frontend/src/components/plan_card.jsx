import React from 'react';
import './master.css';

export const PlanCard = ({ title, price, features, isCurrentPlan }) => {
  return (
    <div className="plan-card">
      <h2 className="plan-title">{title}</h2>
      <div className="plan-price">₹{price}</div>
      <ul className="plan-features">
        {features.map((item, index) => (
          <li key={index} className="feature-item">
            <span role="img" aria-label="check">✅</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {isCurrentPlan && (
        <p className="current-plan-btn" disabled>
          Already On This Plan
        </p>
      )}
    </div>
  );
};

export default PlanCard;
