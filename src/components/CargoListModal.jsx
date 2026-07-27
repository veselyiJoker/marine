import React from 'react';
import { Boxes, Pencil, X } from 'lucide-react';
import { cargoTypeLabel } from '../utils/cargoTypes.js';
import { statusClass } from '../utils/status.js';

export function CargoListModal({ cargos, isOpen, selectedCargo, subtitle, title, onClose, onEditCargo, onSelectCargo }) {
  if (!isOpen) return null;

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
          <div className="cargo-table modal-cargo-table">
            <div className="table-row table-head">
              <span>Груз</span>
              <span>Наименование</span>
              <span>Владелец</span>
              <span>Тип</span>
              <span>Судно</span>
              <span>Маршрут</span>
              <span>ETA</span>
              <span>Статус</span>
              <span>Действия</span>
            </div>

            {cargos.length > 0 ? (
              cargos.map((cargo) => (
                <div
                  className={`table-row ${selectedCargo?.id === cargo.id ? 'selected-row' : ''}`}
                  key={cargo.id}
                  onClick={() => onSelectCargo(cargo)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') onSelectCargo(cargo);
                  }}
                >
                  <span><strong>{cargo.id}</strong><small>{cargo.bl}</small></span>
                  <span>{cargo.title}</span>
                  <span>{cargo.owner}</span>
                  <span><mark className="type-pill">{cargoTypeLabel(cargo.type)}</mark></span>
                  <span>{cargo.vessel}</span>
                  <span>{cargo.origin} - {cargo.destination}</span>
                  <span>{cargo.eta}</span>
                  <span><mark className={`status ${statusClass(cargo.status)}`}>{cargo.status}</mark></span>
                  <span>
                    <button
                      className="row-action"
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onEditCargo(cargo);
                      }}
                      aria-label={`Редактировать груз ${cargo.id}`}
                      title="Редактировать"
                    >
                      <Pencil size={16} />
                    </button>
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-cargo-state modal-table-empty">Грузов для отображения нет.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
