import React from 'react';
import { Boxes, CalendarClock, Clock3, Gauge, Navigation } from 'lucide-react';
import { statusClass } from '../utils/status.js';
import { InfoRow } from './InfoRow.jsx';

export function VesselDetails({ vessel, cargos, onOpenCargos }) {
  return (
    <aside className="details-panel">
      <div className="panel-head compact">
        <h2>{vessel.name}</h2>
        <span className={`status ${statusClass(vessel.status)}`}>{vessel.status}</span>
      </div>
      <div className="detail-list">
        <InfoRow icon={<Navigation />} label="Маршрут" value={vessel.route} />
        <InfoRow icon={<CalendarClock />} label="Отбытие" value={vessel.etd} />
        <InfoRow icon={<Clock3 />} label="Прибытие" value={vessel.eta} />
        <InfoRow icon={<Gauge />} label="Скорость" value={`${vessel.speed} уз.`} />
      </div>
      <div className="progress-block">
        <div>
          <strong>Прогресс рейса</strong>
          <span>{vessel.progress}%</span>
        </div>
        <div className="progress"><span style={{ width: `${vessel.progress}%` }} /></div>
      </div>

      <section className="cargo-summary-action">
        <div>
          <small>Грузы на судне</small>
          <strong>{cargos.length}</strong>
        </div>
        <button className="primary-button full" type="button" onClick={onOpenCargos}>
          <Boxes size={18} />
          Показать грузы
        </button>
      </section>
    </aside>
  );
}
