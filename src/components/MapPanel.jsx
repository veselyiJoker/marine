import React, { useMemo, useState } from 'react';
import { Layers3, Snowflake, Waves, Wind } from 'lucide-react';
import { VesselMap } from './VesselMap.jsx';
import { weatherLayerConfig } from '../utils/weatherLayers.js';

const weatherLayerControls = [
  { key: 'wind', icon: Wind },
  { key: 'ice', icon: Snowflake },
  { key: 'waves', icon: Waves },
];

export function MapPanel({ selectedNsrPort, vessels, selectedVessel, onSelectNsrPort, onSelectVessel }) {
  const [activeWeatherLayers, setActiveWeatherLayers] = useState({
    wind: true,
    ice: false,
    waves: false,
  });

  const activeScaleKeys = useMemo(
    () => weatherLayerControls.map(({ key }) => key).filter((key) => activeWeatherLayers[key]),
    [activeWeatherLayers]
  );

  function toggleWeatherLayer(layerKey) {
    setActiveWeatherLayers((currentLayers) => ({
      ...currentLayers,
      [layerKey]: !currentLayers[layerKey],
    }));
  }

  return (
    <div className="map-panel">
      <div className="panel-head">
        <div>
          <h2>Карта MapLibre</h2>
          <span>Моковый маршрут: {selectedVessel.route}</span>
        </div>
        <button className="ghost-button"><Layers3 size={17} />Слои погоды</button>
      </div>

      <div className="map-frame">
        <VesselMap
          activeWeatherLayers={activeWeatherLayers}
          selectedNsrPort={selectedNsrPort}
          vessels={vessels}
          selectedVessel={selectedVessel}
          onSelectNsrPort={onSelectNsrPort}
          onSelectVessel={onSelectVessel}
        />
        <div className="weather-toolbar" role="toolbar" aria-label="Слои погоды">
          {weatherLayerControls.map(({ key, icon: Icon }) => {
            const layer = weatherLayerConfig[key];
            const isActive = activeWeatherLayers[key];

            return (
              <button
                key={key}
                type="button"
                className={isActive ? 'active' : ''}
                aria-pressed={isActive}
                title={layer.label}
                onClick={() => toggleWeatherLayer(key)}
              >
                <Icon size={17} />
                <span>{layer.label}</span>
              </button>
            );
          })}
        </div>
        {activeScaleKeys.length > 0 && (
          <div className="weather-scales" aria-label="Шкалы погодных слоев">
            {activeScaleKeys.map((key) => {
              const layer = weatherLayerConfig[key];

              return (
                <div key={key} className="weather-scale">
                  <div className="weather-scale-head">
                    <strong><span className={`weather-scale-symbol symbol-${key}`} />{layer.label}</strong>
                    <small>{layer.caption}</small>
                  </div>
                  <div className={`weather-scale-bar scale-${key}`} />
                  <div className="weather-scale-values">
                    {layer.values.map((value) => (
                      <span key={value}>{value}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
