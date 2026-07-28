import React, { useMemo } from 'react';
import { VesselMap } from './VesselMap.jsx';
import { buildVoyageMapVessel } from '../utils/voyages.js';

const emptyWeatherLayers = { wind: false, ice: false, waves: false };
const noop = () => {};

export function VoyageMap({ voyage, vessel, ports, placeAtOrigin = false }) {
  const mapVessel = useMemo(
    () => buildVoyageMapVessel(voyage, vessel, ports, placeAtOrigin),
    [placeAtOrigin, ports, vessel, voyage]
  );
  const visibleVessels = useMemo(() => [mapVessel], [mapVessel]);

  return (
    <div className="voyage-map-frame">
      <VesselMap
        activeWeatherLayers={emptyWeatherLayers}
        selectedNsrPort={null}
        vessels={visibleVessels}
        selectedVessel={mapVessel}
        onSelectNsrPort={noop}
        onSelectVessel={noop}
      />
      <div className="voyage-map-legend">
        <span><i className="legend-route" />Маршрут рейса</span>
        <span><i className="legend-vessel" />Назначенное судно</span>
      </div>
    </div>
  );
}
