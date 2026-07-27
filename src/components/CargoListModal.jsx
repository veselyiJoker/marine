import React, { useEffect, useState } from 'react';
import { Boxes, CircleUserRound, Clock3, FileText, MapPin, Route, Ship, Tags, X } from 'lucide-react';
import { cargoTypeLabel, groupCargosByType } from '../utils/cargoTypes.js';
import { statusClass } from '../utils/status.js';
import { InfoRow } from './InfoRow.jsx';

export function CargoListModal({ cargos, isOpen, subtitle, title, onClose }) {
  const [selectedCargo, setSelectedCargo] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    setSelectedCargo(cargos[0] ?? null);
  }, [cargos, isOpen]);

  if (!isOpen) return null;

  const cargoGroups = groupCargosByType(cargos);

  return (
    <div className="modal-backdrop">
      <section className="modal cargo-list-modal" role="dialog" aria-modal="true" aria-label="Список грузов">
        <header className="modal-head">
          <div>
            <h2>{title}</h2>
            <span>{subtitle}</span>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Закрыть">
            <X size={20} />
          </button>
        </header>

        <div className="cargo-list-summary">
          <Boxes size={20} />
          <div>
            <small>Всего грузов</small>
            <strong>{cargos.length}</strong>
          </div>
        </div>

        <div className="cargo-modal-body">
          <div className="modal-cargo-list">
            {cargoGroups.length > 0 ? (
              cargoGroups.map((group) => (
                <section className="cargo-type-group" key={group.type}>
                  <div className="cargo-type-head">
                    <strong>{group.type}</strong>
                    <span>{group.cargos.length}</span>
                  </div>
                  {group.cargos.map((cargo) => (
                    <button
                      className={selectedCargo?.id === cargo.id ? 'selected-cargo-card' : ''}
                      key={cargo.id}
                      type="button"
                      onClick={() => setSelectedCargo(cargo)}
                    >
                      <span className="cargo-list-card-head">
                        <strong>{cargo.id}</strong>
                        <mark className={`status ${statusClass(cargo.status)}`}>{cargo.status}</mark>
                      </span>
                      <small>{cargo.title}</small>
                      <small>{cargo.origin} - {cargo.destination}</small>
                    </button>
                  ))}
                </section>
              ))
            ) : (
              <div className="empty-cargo-state">Грузов для отображения нет.</div>
            )}
          </div>

          <aside className="cargo-preview" aria-label="Информация о грузе">
            {selectedCargo ? (
              <>
                <div className="panel-head compact">
                  <div>
                    <h3>{selectedCargo.id}</h3>
                    <span>{selectedCargo.bl}</span>
                  </div>
                  <span className={`status ${statusClass(selectedCargo.status)}`}>{selectedCargo.status}</span>
                </div>

                <h4 className="cargo-title">{selectedCargo.title}</h4>

                <div className="detail-list">
                  <InfoRow icon={<Tags />} label="Тип груза" value={cargoTypeLabel(selectedCargo.type)} />
                  <InfoRow icon={<CircleUserRound />} label="Владелец" value={selectedCargo.owner} />
                  <InfoRow icon={<Ship />} label="Судно" value={selectedCargo.vessel} />
                  <InfoRow icon={<Route />} label="Маршрут" value={`${selectedCargo.origin} - ${selectedCargo.destination}`} />
                  <InfoRow icon={<MapPin />} label="Порт отправления" value={selectedCargo.origin} />
                  <InfoRow icon={<Boxes />} label="Вес" value={selectedCargo.weight} />
                  <InfoRow icon={<Clock3 />} label="ETA" value={selectedCargo.eta} />
                </div>

                <button className="primary-button full" type="button">
                  <FileText size={18} />
                  Открыть документы
                </button>
              </>
            ) : (
              <div className="empty-cargo-state">Выберите груз из списка, чтобы увидеть детали.</div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
