import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  boundsForVessel,
  createVesselArrowImage,
  mapStyle,
  portGeoJson,
  vesselGeoJson,
  vesselRouteGeoJson,
} from '../utils/mapGeoJson.js';

export function VesselMap({ vessels, selectedVessel, onSelectVessel }) {
  const mapNode = useRef(null);
  const mapRef = useRef(null);
  const selectedRef = useRef(selectedVessel);
  const onSelectRef = useRef(onSelectVessel);

  useEffect(() => {
    selectedRef.current = selectedVessel;
  }, [selectedVessel]);

  useEffect(() => {
    onSelectRef.current = onSelectVessel;
  }, [onSelectVessel]);

  useEffect(() => {
    if (!mapNode.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapNode.current,
      style: mapStyle,
      center: [66, 30],
      zoom: 2,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
    mapRef.current = map;

    map.on('load', () => {
      if (!map.hasImage('vessel-arrow')) {
        map.addImage('vessel-arrow', createVesselArrowImage());
      }

      map.addSource('selected-route', {
        type: 'geojson',
        data: vesselRouteGeoJson(selectedRef.current),
      });
      map.addLayer({
        id: 'selected-route-glow',
        type: 'line',
        source: 'selected-route',
        paint: {
          'line-color': '#ffffff',
          'line-width': 8,
          'line-opacity': 0.72,
        },
      });
      map.addLayer({
        id: 'selected-route-line',
        type: 'line',
        source: 'selected-route',
        paint: {
          'line-color': '#f2b84b',
          'line-width': 5,
          'line-dasharray': [1.2, 1.2],
        },
      });

      map.addSource('route-ports', {
        type: 'geojson',
        data: portGeoJson(selectedRef.current),
      });
      map.addLayer({
        id: 'route-ports-circle',
        type: 'circle',
        source: 'route-ports',
        paint: {
          'circle-radius': ['case', ['==', ['get', 'kind'], 'Транзит'], 6, 8],
          'circle-color': ['case', ['==', ['get', 'kind'], 'Назначение'], '#167580', '#f2b84b'],
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2,
        },
      });
      map.addLayer({
        id: 'route-ports-label',
        type: 'symbol',
        source: 'route-ports',
        layout: {
          'text-field': ['get', 'name'],
          'text-offset': [0, 1.4],
          'text-size': 12,
          'text-anchor': 'top',
        },
        paint: {
          'text-color': '#173c43',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1.2,
        },
      });

      map.addSource('vessels', {
        type: 'geojson',
        data: vesselGeoJson(vessels),
      });
      map.addLayer({
        id: 'vessels-arrow',
        type: 'symbol',
        source: 'vessels',
        layout: {
          'icon-image': 'vessel-arrow',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'icon-rotate': ['get', 'bearing'],
          'icon-rotation-alignment': 'map',
          'icon-size': ['case', ['==', ['get', 'id'], selectedRef.current.id], 0.36, 0.28],
        },
      });
      map.addLayer({
        id: 'vessels-label',
        type: 'symbol',
        source: 'vessels',
        layout: {
          'text-field': ['get', 'name'],
          'text-offset': [0, -1.4],
          'text-size': 12,
          'text-anchor': 'bottom',
        },
        paint: {
          'text-color': '#172126',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1.4,
        },
      });

      map.on('click', 'vessels-arrow', (event) => {
        const feature = event.features?.[0];
        const vessel = vessels.find((item) => item.id === feature?.properties?.id);
        if (vessel) onSelectRef.current(vessel);
      });

      map.on('mouseenter', 'vessels-arrow', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'vessels-arrow', () => {
        map.getCanvas().style.cursor = '';
      });

      map.fitBounds(boundsForVessel(selectedRef.current), {
        padding: 64,
        maxZoom: 4,
        duration: 0,
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [vessels]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    map.getSource('selected-route')?.setData(vesselRouteGeoJson(selectedVessel));
    map.getSource('route-ports')?.setData(portGeoJson(selectedVessel));

    if (map.getLayer('vessels-arrow')) {
      map.setLayoutProperty('vessels-arrow', 'icon-size', [
        'case',
        ['==', ['get', 'id'], selectedVessel.id],
        0.36,
        0.28,
      ]);
    }

    map.fitBounds(boundsForVessel(selectedVessel), {
      padding: 64,
      maxZoom: 4,
      duration: 700,
    });
  }, [selectedVessel]);

  return <div ref={mapNode} className="maplibre-map" />;
}
