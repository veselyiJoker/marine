import { vessels } from './mockData.js';

function routePointIds(vessel) {
  return vessel.routePoints.map((port) => port.id);
}

export const voyages = [
  {
    id: 'R-1001',
    title: 'Восточный арктический экспресс',
    vesselId: vessels[0].id,
    cargoIds: ['C-2001', 'C-2002', 'C-2003'],
    routePointIds: routePointIds(vessels[0]),
    startDate: '2026-07-27T08:20',
    endDate: '2026-08-02T17:45',
    comment: 'Приоритетная доставка снабжения. Контрольная связь каждые шесть часов.',
    status: 'В пути',
  },
  {
    id: 'R-1002',
    title: 'Снабжение западного сектора',
    vesselId: vessels[7].id,
    cargoIds: ['C-2050', 'C-2051', 'C-2052', 'C-2053'],
    routePointIds: routePointIds(vessels[7]),
    startDate: '2026-07-29T06:50',
    endDate: '2026-08-04T18:25',
    comment: 'Погрузка в Архангельске, дополнительная проверка крепления груза в Мурманске.',
    status: 'Запланирован',
  },
  {
    id: 'R-1003',
    title: 'Колымская линия',
    vesselId: vessels[11].id,
    cargoIds: ['C-2078', 'C-2079'],
    routePointIds: routePointIds(vessels[11]),
    startDate: '2026-07-31T04:20',
    endDate: '2026-08-09T11:15',
    comment: 'Маршрут зависит от ледовой обстановки восточнее Тикси.',
    status: 'Ожидает отправки',
  },
];
