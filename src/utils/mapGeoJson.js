import maplibregl from 'maplibre-gl';
import { NSR_ROUTE } from '../data/nsrRoute.js';

export const mapStyle = {
  version: 8,
  projection: {
    type: 'globe',
  },
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
    },
  ],
};

function unwrapLongitudeNear(lng, referenceLng) {
  let nextLng = lng;

  while (nextLng - referenceLng > 180) nextLng -= 360;
  while (nextLng - referenceLng < -180) nextLng += 360;

  return nextLng;
}

function unwrapRouteCoordinates(coordinates) {
  return coordinates.reduce((route, [lng, lat]) => {
    const previousLng = route.at(-1)?.[0] ?? lng;
    route.push([unwrapLongitudeNear(lng, previousLng), lat]);
    return route;
  }, []);
}

export function northernSeaRouteGeoJson() {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Северный морской путь' },
        geometry: {
          type: 'LineString',
          coordinates: unwrapRouteCoordinates(NSR_ROUTE.coordinates),
        },
      },
    ],
  };
}

export function boundsForNorthernSeaRoute() {
  const bounds = new maplibregl.LngLatBounds();
  unwrapRouteCoordinates(NSR_ROUTE.coordinates).forEach((coordinates) => bounds.extend(coordinates));
  return bounds;
}

export function vesselRouteGeoJson(vessel) {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { id: vessel.id, name: vessel.route },
        geometry: {
          type: 'LineString',
          coordinates: unwrapRouteCoordinates(vessel.routeCoordinates),
        },
      },
    ],
  };
}

export function portGeoJson(vessel) {
  let previousLng = vessel.routeCoordinates[0]?.[0] ?? vessel.routePoints[0]?.coordinates[0] ?? 0;

  return {
    type: 'FeatureCollection',
    features: vessel.routePoints.map((port, index) => {
      const coordinates = [unwrapLongitudeNear(port.coordinates[0], previousLng), port.coordinates[1]];
      previousLng = coordinates[0];

      return {
        type: 'Feature',
        properties: {
          name: port.name,
          country: port.country,
          kind: index === 0 ? 'Отправление' : index === vessel.routePoints.length - 1 ? 'Назначение' : 'Транзит',
        },
        geometry: {
          type: 'Point',
          coordinates,
        },
      };
    }),
  };
}

export function northernSeaRoutePortsGeoJson(ports) {
  return {
    type: 'FeatureCollection',
    features: ports.map((port) => ({
      type: 'Feature',
      properties: {
        id: port.id,
        name: port.name,
        lat: port.lat,
        lon: port.lon,
      },
      geometry: {
        type: 'Point',
        coordinates: port.coordinates,
      },
    })),
  };
}

export function vesselGeoJson(vessels) {
  return {
    type: 'FeatureCollection',
    features: vessels.map((vessel) => ({
      type: 'Feature',
      properties: {
        id: vessel.id,
        name: vessel.name,
        status: vessel.status,
        route: vessel.route,
        bearing: vessel.bearing,
      },
      geometry: {
        type: 'Point',
        coordinates: vessel.position,
      },
    })),
  };
}

export function selectedVesselGeoJson(vessel) {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          id: vessel.id,
          name: vessel.name,
        },
        geometry: {
          type: 'Point',
          coordinates: vessel.position,
        },
      },
    ],
  };
}

export function boundsForVessel(vessel) {
  const bounds = new maplibregl.LngLatBounds();
  const routeCoordinates = unwrapRouteCoordinates(vessel.routeCoordinates);
  const referenceLng = routeCoordinates.at(Math.floor(routeCoordinates.length / 2))?.[0] ?? vessel.position[0];

  routeCoordinates.forEach((coordinates) => bounds.extend(coordinates));
  bounds.extend([unwrapLongitudeNear(vessel.position[0], referenceLng), vessel.position[1]]);
  return bounds;
}

export function createVesselArrowImage() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  context.translate(size / 2, size / 2);

  context.beginPath();
  context.moveTo(0, -23);
  context.lineTo(17, 20);
  context.lineTo(0, 11);
  context.lineTo(-17, 20);
  context.closePath();
  context.fillStyle = '#0b2545';
  context.strokeStyle = '#ffffff';
  context.lineWidth = 6;
  context.lineJoin = 'round';
  context.stroke();
  context.fill();

  context.beginPath();
  context.arc(0, 1, 4, 0, Math.PI * 2);
  context.fillStyle = '#38bdf8';
  context.fill();

  return {
    width: size,
    height: size,
    data: context.getImageData(0, 0, size, size).data,
  };
}
