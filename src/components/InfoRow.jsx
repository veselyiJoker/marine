import React from 'react';

export function InfoRow({ icon, label, value }) {
  return (
    <div className="info-row">
      <span>{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
