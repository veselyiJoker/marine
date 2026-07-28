export function statusClass(status) {
  if (['В пути', 'Прибыл', 'Погружен', 'Завершен'].includes(status)) return 'good';
  if (['Погрузка', 'Разгрузка', 'Ожидает отправки', 'Запланирован'].includes(status)) return 'mid';
  return 'bad';
}
