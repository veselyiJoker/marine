export function statusClass(status) {
  if (['В пути', 'Прибыл'].includes(status)) return 'good';
  if (['Погрузка', 'Разгрузка', 'Ожидает отправки'].includes(status)) return 'mid';
  return 'bad';
}
