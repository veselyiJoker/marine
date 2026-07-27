import React from 'react';
import { Filter } from 'lucide-react';
import { VesselMap } from './VesselMap.jsx';

export function MapPanel({ selectedNsrPort, vessels, selectedVessel, onSelectNsrPort, onSelectVessel }) {
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
          selectedNsrPort={selectedNsrPort}
          vessels={vessels}
          selectedVessel={selectedVessel}
          onSelectNsrPort={onSelectNsrPort}
          onSelectVessel={onSelectVessel}
        />
        <div className="map-legend">
          <span><i className="legend-route" />Маршрут</span>
          <span><i className="legend-vessel" />Судно</span>
          <span><i className="legend-port" />Порт маршрута</span>
          <span><i className="legend-nsr-port" />Порт СМП</span>
        </div>
      </div>
    </div>
  );
}
