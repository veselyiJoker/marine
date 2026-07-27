export const cargoTypes = ['Генеральный груз', 'Щебень', 'Песок', 'Прочее'];

export function cargoTypeLabel(type) {
  return cargoTypes.includes(type) ? type : 'Прочее';
}

export function groupCargosByType(cargos) {
  return cargoTypes
    .map((type) => ({
      type,
      cargos: cargos.filter((cargo) => cargoTypeLabel(cargo.type) === type),
    }))
    .filter((group) => group.cargos.length > 0);
}
