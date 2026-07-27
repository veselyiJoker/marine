import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { northernSeaRoutePorts } from '../data/mockData.js';
import {
  boundsForVessel,
  createVesselArrowImage,
  mapStyle,
  northernSeaRoutePortsGeoJson,
  portGeoJson,
  selectedVesselGeoJson,
  vesselGeoJson,
  vesselRouteGeoJson,
} from '../utils/mapGeoJson.js';

export function VesselMap({ selectedNsrPort, vessels, selectedVessel, onSelectNsrPort, onSelectVessel }) {
  const mapNode = useRef(null);
  const mapRef = useRef(null);
  const selectedNsrPortRef = useRef(selectedNsrPort);
  const selectedRef = useRef(selectedVessel);
  const onSelectNsrPortRef = useRef(onSelectNsrPort);
  const onSelectRef = useRef(onSelectVessel);

  useEffect(() => {
    selectedNsrPortRef.current = selectedNsrPort;
  }, [selectedNsrPort]);

  useEffect(() => {
    selectedRef.current = selectedVessel;
  }, [selectedVessel]);

  useEffect(() => {
    onSelectNsrPortRef.current = onSelectNsrPort;
  }, [onSelectNsrPort]);

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
          'line-width': 5,
          'line-opacity': 0.72,
        },
      });
      map.addLayer({
        id: 'selected-route-line',
        type: 'line',
        source: 'selected-route',
        paint: {
          'line-color': '#38bdf8',
          'line-width': 2,
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
          'circle-radius': ['case', ['==', ['get', 'kind'], 'Транзит'], 3, 4],
          'circle-color': ['case', ['==', ['get', 'kind'], 'Назначение'], '#0e7490', '#38bdf8'],
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
          'text-color': '#2563eb',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1.2,
        },
      });

      map.addSource('northern-sea-route-ports', {
        type: 'geojson',
        data: northernSeaRoutePortsGeoJson(northernSeaRoutePorts),
      });
      map.addLayer({
        id: 'nsr-ports-circle',
        type: 'circle',
        source: 'northern-sea-route-ports',
        paint: {
          'circle-radius': ['case', ['==', ['get', 'id'], selectedNsrPortRef.current?.id ?? ''], 6, 3.5],
          'circle-color': ['case', ['==', ['get', 'id'], selectedNsrPortRef.current?.id ?? ''], '#38bdf8', '#2563eb'],
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': ['case', ['==', ['get', 'id'], selectedNsrPortRef.current?.id ?? ''], 2.5, 1.5],
        },
      });
      map.addLayer({
        id: 'nsr-ports-label',
        type: 'symbol',
        source: 'northern-sea-route-ports',
        layout: {
          'text-field': ['get', 'name'],
          'text-offset': [0, 0.5],
          'text-size': 11,
          'text-anchor': 'top',
        },
        paint: {
          'text-color': '#000000',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1.4,
        },
      });

      map.addSource('vessels', {
        type: 'geojson',
        data: vesselGeoJson(vessels),
      });
      map.addSource('selected-vessel-highlight', {
        type: 'geojson',
        data: selectedVesselGeoJson(selectedRef.current),
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
          'text-allow-overlap': false,
          'text-ignore-placement': false,
          'text-optional': true,
          'text-offset': [0, -1],
          'text-size': 11,
          'text-anchor': 'bottom',
        },
        paint: {
          'text-color': '#102033',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1.4,
        },
      });
      map.addLayer({
        id: 'selected-vessel-halo',
        type: 'circle',
        source: 'selected-vessel-highlight',
        paint: {
          'circle-radius': 12,
          'circle-color': '#2563eb',
          'circle-opacity': 0.16,
          'circle-stroke-color': '#1d4ed8',
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0.72,
        },
      });
      map.addLayer({
        id: 'selected-vessel-ring',
        type: 'circle',
        source: 'selected-vessel-highlight',
        paint: {
          'circle-radius': 8,
          'circle-color': 'rgba(37, 99, 235, 0)',
          'circle-stroke-color': '#2563eb',
          'circle-stroke-width': 2.5,
          'circle-stroke-opacity': 0.96,
        },
      });

      ['route-ports-label', 'nsr-ports-label', 'vessels-label'].forEach((layerId) => {
        if (map.getLayer(layerId)) map.moveLayer(layerId, 'route-ports-circle');
      });

      map.on('click', 'vessels-arrow', (event) => {
        const feature = event.features?.[0];
        const vessel = vessels.find((item) => item.id === feature?.properties?.id);
        if (vessel) onSelectRef.current(vessel);
      });

      map.on('click', 'nsr-ports-circle', (event) => {
        const feature = event.features?.[0];
        const port = northernSeaRoutePorts.find((item) => item.id === feature?.properties?.id);
        if (port) onSelectNsrPortRef.current(port);
      });
      map.on('click', 'nsr-ports-label', (event) => {
        const feature = event.features?.[0];
        const port = northernSeaRoutePorts.find((item) => item.id === feature?.properties?.id);
        if (port) onSelectNsrPortRef.current(port);
      });

      map.on('mouseenter', 'vessels-arrow', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'vessels-arrow', () => {
        map.getCanvas().style.cursor = '';
      });
      map.on('mouseenter', 'nsr-ports-circle', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'nsr-ports-circle', () => {
        map.getCanvas().style.cursor = '';
      });
      map.on('mouseenter', 'nsr-ports-label', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'nsr-ports-label', () => {
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
    map.getSource('selected-vessel-highlight')?.setData(selectedVesselGeoJson(selectedVessel));

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

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded() || !map.getLayer('nsr-ports-circle')) return;

    const selectedId = selectedNsrPort?.id ?? '';
    const selectedCase = ['==', ['get', 'id'], selectedId];

    map.setPaintProperty('nsr-ports-circle', 'circle-radius', ['case', selectedCase, 6, 3.5]);
    map.setPaintProperty('nsr-ports-circle', 'circle-color', ['case', selectedCase, '#38bdf8', '#2563eb']);
    map.setPaintProperty('nsr-ports-circle', 'circle-stroke-width', ['case', selectedCase, 2.5, 1.5]);
  }, [selectedNsrPort]);

  return <div ref={mapNode} className="maplibre-map" />;
}
