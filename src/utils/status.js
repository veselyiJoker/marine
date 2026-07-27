export function statusClass(status) {
  if (['В пути', 'Прибыл', 'Погружен'].includes(status)) return 'good';
  if (['Погрузка', 'Разгрузка', 'Ожидает отправки'].includes(status)) return 'mid';
  return 'bad';
}
