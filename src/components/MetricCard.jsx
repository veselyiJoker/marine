import React from 'react';

export function MetricCard({ icon, label, value, hint }) {
  return (
    <article className="metric-card">
      <span className="metric-icon">{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        <span>{hint}</span>
      </div>
    </article>
  );
}
