import { nsrRouteForPorts } from '../data/nsrRoute.js';

export function buildVoyageMapVessel(voyage, vessel, ports, placeAtOrigin = false) {
  const portById = Object.fromEntries(ports.map((port) => [port.id, port]));
  const routePoints = voyage.routePointIds.map((id) => portById[id]).filter(Boolean);
  const originPortId = routePoints[0]?.id;
  const destinationPortId = routePoints.at(-1)?.id;
  const nsrRoute = nsrRouteForPorts(originPortId, destinationPortId);
  const routeCoordinates = nsrRoute?.coordinates ?? routePoints.map((port) => port.coordinates);
  const originPosition = routeCoordinates[0] ?? vessel.position;

  return {
    ...vessel,
    route: nsrRoute?.name ?? routePoints.map((port) => port.name).join(' - '),
    routePoints,
    routeCoordinates: routeCoordinates.length > 1 ? routeCoordinates : vessel.routeCoordinates,
    position: placeAtOrigin ? originPosition : vessel.position,
  };
}

export function formatVoyageDate(value) {
  if (!value) return 'Не указана';

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function voyageDuration(startDate, endDate) {
  const durationMs = new Date(endDate).getTime() - new Date(startDate).getTime();
  if (!Number.isFinite(durationMs) || durationMs <= 0) return 'Не рассчитана';

  const totalHours = Math.round(durationMs / 3_600_000);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  return `${days} дн. ${hours} ч.`;
}
