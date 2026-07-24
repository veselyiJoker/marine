import React from 'react';
import { Filter } from 'lucide-react';
import { VesselMap } from './VesselMap.jsx';

export function MapPanel({ vessels, selectedVessel, onSelectVessel }) {
  return (
    <div className="map-panel">
      <div className="panel-head">
        <div>
          <h2>Карта MapLibre</h2>
          <span>Моковый маршрут: {selectedVessel.route}</span>
        </div>
        <button className="ghost-button"><Filter size={17} />Фильтры</button>
      </div>

      <div className="map-frame">
        <VesselMap
          vessels={vessels}
          selectedVessel={selectedVessel}
          onSelectVessel={onSelectVessel}
        />
        <div className="map-legend">
          <span><i className="legend-route" />Маршрут</span>
          <span><i className="legend-vessel" />Судно</span>
          <span><i className="legend-port" />Порт</span>
        </div>
      </div>
    </div>
  );
}
