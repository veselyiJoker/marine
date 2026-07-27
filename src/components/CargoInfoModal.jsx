import React from 'react';
import { Boxes, CircleUserRound, Clock3, FileText, MapPin, Route, Ship, Tags, X } from 'lucide-react';
import { cargoTypeLabel } from '../utils/cargoTypes.js';
import { statusClass } from '../utils/status.js';
import { InfoRow } from './InfoRow.jsx';

export function CargoInfoModal({ cargo, isOpen, onClose }) {
  if (!isOpen || !cargo) return null;

  return (
    <div className="modal-backdrop">
      <section className="modal cargo-info-modal" role="dialog" aria-modal="true" aria-labelledby="cargo-info-title">
        <header className="modal-head">
          <div>
            <h2 id="cargo-info-title">{cargo.id}</h2>
            <span>{cargo.bl}</span>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Закрыть">
            <X size={20} />
          </button>
        </header>

        <div className="cargo-info-content">
          <div className="panel-head compact">
            <h3>{cargo.title}</h3>
            <span className={`status ${statusClass(cargo.status)}`}>{cargo.status}</span>
          </div>

          <div className="detail-list">
            <InfoRow icon={<Tags />} label="Тип груза" value={cargoTypeLabel(cargo.type)} />
            <InfoRow icon={<CircleUserRound />} label="Владелец" value={cargo.owner} />
            <InfoRow icon={<Ship />} label="Судно" value={cargo.vessel} />
            <InfoRow icon={<Route />} label="Маршрут" value={`${cargo.origin} - ${cargo.destination}`} />
            <InfoRow icon={<MapPin />} label="Порт отправления" value={cargo.origin} />
            <InfoRow icon={<Boxes />} label="Вес" value={cargo.weight} />
            <InfoRow icon={<Clock3 />} label="ETA" value={cargo.eta} />
          </div>

          <button className="primary-button full" type="button">
            <FileText size={18} />
            Открыть документы
          </button>
        </div>
      </section>
    </div>
  );
}
