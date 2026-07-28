const nsrRouteCoordinates = [
  [33.061, 68.9841],
  [33, 69.08],
  [32.95, 69.18],
  [33, 69.28],
  [33.2, 69.4],
  [33.8, 69.65],
  [35, 69.8],
  [40, 70.3],
  [48, 72],
  [48, 75],
  [52, 77],
  [60, 77.8],
  [68, 77.5],
  [74, 77],
  [82, 75.8],
  [88, 76],
  [94, 77.3],
  [99, 77.7],
  [102.5, 77.9],
  [104.5, 78],
  [106.5, 77.95],
  [110, 77.2],
  [116, 76.4],
  [124, 75.6],
  [132, 75.5],
  [137, 76.2],
  [140, 77],
  [148, 77.1],
  [156, 76],
  [164, 73.8],
  [171, 71.8],
  [176, 70.2],
  [179, 69.5],
  [-176, 69],
  [-172, 67.3],
  [-169.2, 66.2],
  [-168, 65.2],
  [-169.5, 64.3],
  [-171.5, 64],
  [-172.8, 64.1],
  [-173.2, 64.1],
  [-173.3, 64.2],
  [-173.3, 64.383],
];

export const AMBARCHIK_PEVEK_ROUTE_COORDINATES = [
  [162.2, 69.85],
  [163.5, 69.9],
  [165, 70.15],
  [166.5, 70.3],
  [168, 70.3],
  [169.2, 70.15],
  [170, 69.9],
  [170.1, 69.82],
];

export const NSR_ROUTE = Object.freeze({
  coordinates: nsrRouteCoordinates,
  originPortId: 'nsr-murmansk',
  destinationPortId: 'nsr-provideniya',
  eastboundName: 'Мурманск → Провидения через СМП',
  westboundName: 'Провидения → Мурманск через СМП',
});

export function nsrRouteForPorts(originPortId, destinationPortId) {
  if (originPortId === NSR_ROUTE.originPortId && destinationPortId === NSR_ROUTE.destinationPortId) {
    return {
      name: NSR_ROUTE.eastboundName,
      coordinates: NSR_ROUTE.coordinates,
    };
  }

  if (originPortId === NSR_ROUTE.destinationPortId && destinationPortId === NSR_ROUTE.originPortId) {
    return {
      name: NSR_ROUTE.westboundName,
      coordinates: [...NSR_ROUTE.coordinates].reverse(),
    };
  }

  return null;
}

function unwrapCoordinates(coordinates) {
  return coordinates.reduce((route, [lng, lat]) => {
    const previousLng = route.at(-1)?.[0] ?? lng;
    let nextLng = lng;
    while (nextLng - previousLng > 180) nextLng -= 360;
    while (nextLng - previousLng < -180) nextLng += 360;
    route.push([nextLng, lat]);
    return route;
  }, []);
}

function normalizeLongitude(lng) {
  return ((lng + 180) % 360 + 360) % 360 - 180;
}

export function positionAlongRoute(coordinates, progress) {
  const route = unwrapCoordinates(coordinates);
  const segmentLengths = [];
  let totalLength = 0;

  for (let index = 1; index < route.length; index += 1) {
    const [startLng, startLat] = route[index - 1];
    const [endLng, endLat] = route[index];
    const averageLatitude = ((startLat + endLat) / 2) * (Math.PI / 180);
    const segmentLength = Math.hypot((endLng - startLng) * Math.cos(averageLatitude), endLat - startLat);
    segmentLengths.push(segmentLength);
    totalLength += segmentLength;
  }

  const targetDistance = Math.min(1, Math.max(0, progress)) * totalLength;
  let travelledDistance = 0;

  for (let index = 0; index < segmentLengths.length; index += 1) {
    const segmentLength = segmentLengths[index];
    if (travelledDistance + segmentLength >= targetDistance) {
      const ratio = segmentLength === 0 ? 0 : (targetDistance - travelledDistance) / segmentLength;
      const [startLng, startLat] = route[index];
      const [endLng, endLat] = route[index + 1];
      const lng = startLng + (endLng - startLng) * ratio;
      const lat = startLat + (endLat - startLat) * ratio;
      const bearing = (Math.atan2(endLng - startLng, endLat - startLat) * 180) / Math.PI;
      return { coordinates: [normalizeLongitude(lng), lat], bearing };
    }
    travelledDistance += segmentLength;
  }

  return { coordinates: route.at(-1), bearing: 90 };
}
