import React from 'react';

export function EventsPanel({ events }) {
  return (
    <div className="timeline-panel">
      <div className="panel-head compact">
        <h2>События</h2>
        <span>Лента операций</span>
      </div>
      {events.map((event) => (
        <div className="event-item" key={event.time}>
          <span className={`event-dot ${event.type}`} />
          <div>
            <strong>{event.time}</strong>
            <p>{event.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
