import React from 'react';
import { Boxes, CalendarDays, Clock3, FileText, MapPin, Route, Ship, X } from 'lucide-react';
import { InfoRow } from './InfoRow.jsx';
import { VoyageMap } from './VoyageMap.jsx';
import { statusClass } from '../utils/status.js';
import { formatVoyageDate, voyageDuration } from '../utils/voyages.js';

export function VoyageInfoModal({ voyage, isOpen, vessels, cargos, ports, onClose }) {
  if (!isOpen || !voyage) return null;

  const vessel = vessels.find((item) => item.id === voyage.vesselId);
  if (!vessel) return null;

  const portById = Object.fromEntries(ports.map((port) => [port.id, port]));
  const routePorts = voyage.routePointIds.map((id) => portById[id]).filter(Boolean);
  const attachedCargos = cargos.filter((cargo) => voyage.cargoIds.includes(cargo.id));

  return (
    <div className="modal-backdrop">
      <section className="modal voyage-info-modal" role="dialog" aria-modal="true" aria-labelledby="voyage-info-title">
        <header className="modal-head">
          <div>
            <h2 id="voyage-info-title">{voyage.title}</h2>
            <span>{voyage.id}</span>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Закрыть">
            <X size={20} />
          </button>
        </header>

        <div className="voyage-info-layout">
          <div className="voyage-info-details">
            <div className="panel-head compact">
              <h3>Параметры рейса</h3>
              <mark className={`status ${statusClass(voyage.status)}`}>{voyage.status}</mark>
            </div>
            <div className="detail-list">
              <InfoRow icon={<Ship />} label="Судно" value={vessel.name} />
              <InfoRow icon={<Route />} label="Маршрут" value={routePorts.map((port) => port.name).join(' - ')} />
              <InfoRow icon={<MapPin />} label="Порт отправления" value={routePorts[0]?.name} />
              <InfoRow icon={<MapPin />} label="Порт прибытия" value={routePorts.at(-1)?.name} />
              <InfoRow icon={<CalendarDays />} label="Начало" value={formatVoyageDate(voyage.startDate)} />
              <InfoRow icon={<CalendarDays />} label="Окончание" value={formatVoyageDate(voyage.endDate)} />
              <InfoRow icon={<Clock3 />} label="Продолжительность" value={voyageDuration(voyage.startDate, voyage.endDate)} />
            </div>

            <div className="voyage-comment">
              <span><FileText size={16} />Комментарий</span>
              <p>{voyage.comment || 'Комментарий не добавлен.'}</p>
            </div>

            <div className="voyage-cargo-block">
              <h3><Boxes size={17} />Грузы · {attachedCargos.length}</h3>
              <div className="voyage-cargo-list">
                {attachedCargos.map((cargo) => (
                  <div key={cargo.id}>
                    <strong>{cargo.title}</strong>
                    <span>{cargo.id} · {cargo.weight}</span>
                  </div>
                ))}
                {attachedCargos.length === 0 && <p className="empty-cargo-state">К рейсу пока не прикреплены грузы.</p>}
              </div>
            </div>
          </div>

          <VoyageMap voyage={voyage} vessel={vessel} ports={ports} />
        </div>
      </section>
    </div>
  );
}
