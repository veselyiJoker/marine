import React from 'react';
import { Boxes, CircleUserRound, Clock3, FileText, Ship } from 'lucide-react';
import { statusClass } from '../utils/status.js';
import { InfoRow } from './InfoRow.jsx';

export function CargoDetails({ cargo }) {
  return (
    <aside className="cargo-detail">
      <div className="panel-head compact">
        <h2>{cargo.id}</h2>
        <span className={`status ${statusClass(cargo.status)}`}>{cargo.status}</span>
      </div>
      <h3>{cargo.title}</h3>
      <div className="detail-list">
        <InfoRow icon={<CircleUserRound />} label="Владелец" value={cargo.owner} />
        <InfoRow icon={<Ship />} label="Судно" value={cargo.vessel} />
        <InfoRow icon={<Boxes />} label="Вес" value={cargo.weight} />
        <InfoRow icon={<Clock3 />} label="ETA" value={cargo.eta} />
      </div>
      <button className="primary-button full"><FileText size={18} />Открыть документы</button>
    </aside>
  );
}
