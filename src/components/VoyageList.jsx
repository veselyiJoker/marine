import React from 'react';
import { CalendarDays, Route, Ship } from 'lucide-react';
import { statusClass } from '../utils/status.js';
import { formatVoyageDate } from '../utils/voyages.js';

export function VoyageList({ voyages, vessels, cargos, ports, onSelectVoyage }) {
  const vesselById = Object.fromEntries(vessels.map((vessel) => [vessel.id, vessel]));
  const portById = Object.fromEntries(ports.map((port) => [port.id, port]));

  return (
    <section className="voyage-panel">
      <div className="panel-head">
        <div>
          <h2>Рейсы</h2>
          <span>Суда, грузы, маршруты и сроки выполнения</span>
        </div>
        <span className="voyage-count"><Route size={17} />{voyages.length}</span>
      </div>

      <div className="voyage-list">
        {voyages.map((voyage) => {
          const vessel = vesselById[voyage.vesselId];
          const origin = portById[voyage.routePointIds[0]];
          const destination = portById[voyage.routePointIds.at(-1)];
          const attachedCargos = cargos.filter((cargo) => voyage.cargoIds.includes(cargo.id));

          return (
            <button key={voyage.id} type="button" className="voyage-row" onClick={() => onSelectVoyage(voyage)}>
              <span className="voyage-primary">
                <strong>{voyage.title}</strong>
                <small>{voyage.id}</small>
              </span>
              <span><Ship size={16} />{vessel?.name ?? 'Судно не найдено'}</span>
              <span><Route size={16} />{origin?.name} - {destination?.name}</span>
              <span>{attachedCargos.length} грузов</span>
              <span><CalendarDays size={16} />{formatVoyageDate(voyage.startDate)}</span>
              <mark className={`status ${statusClass(voyage.status)}`}>{voyage.status}</mark>
            </button>
          );
        })}
      </div>
    </section>
  );
}
