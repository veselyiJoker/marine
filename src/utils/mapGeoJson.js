import maplibregl from 'maplibre-gl';

export const mapStyle = {
  version: 8,
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

export function vesselRouteGeoJson(vessel) {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { id: vessel.id, name: vessel.route },
        geometry: {
          type: 'LineString',
          coordinates: vessel.routeCoordinates,
        },
      },
    ],
  };
}

export function portGeoJson(vessel) {
  return {
    type: 'FeatureCollection',
    features: vessel.routePoints.map((port, index) => ({
      type: 'Feature',
      properties: {
        name: port.name,
        country: port.country,
        kind: index === 0 ? 'Отправление' : index === vessel.routePoints.length - 1 ? 'Назначение' : 'Транзит',
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

export function boundsForVessel(vessel) {
  const bounds = new maplibregl.LngLatBounds();
  vessel.routeCoordinates.forEach((coordinates) => bounds.extend(coordinates));
  bounds.extend(vessel.position);
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
  context.fillStyle = '#173c43';
  context.strokeStyle = '#ffffff';
  context.lineWidth = 6;
  context.lineJoin = 'round';
  context.stroke();
  context.fill();

  context.beginPath();
  context.arc(0, 1, 4, 0, Math.PI * 2);
  context.fillStyle = '#f2b84b';
  context.fill();

  return {
    width: size,
    height: size,
    data: context.getImageData(0, 0, size, size).data,
  };
}
