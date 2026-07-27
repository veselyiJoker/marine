import React from 'react';
import { Pencil, Search } from 'lucide-react';
import { cargoTypeLabel } from '../utils/cargoTypes.js';
import { statusClass } from '../utils/status.js';

export function CargoTable({ cargos, query, selectedCargo, onEditCargo, onQueryChange, onSelectCargo }) {
  return (
    <div className="table-panel">
      <div className="panel-head">
        <div>
          <h2>Отслеживание груза</h2>
          <span>Поиск по грузу, наименованию, владельцу, судну, маршруту или ETA</span>
        </div>
        <label className="search-box">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Например Мурманск или 05.08"
          />
        </label>
      </div>

      <div className="cargo-table">
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
        {cargos.map((cargo) => (
          <div
            className={`table-row ${selectedCargo.id === cargo.id ? 'selected-row' : ''}`}
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
        ))}
      </div>
    </div>
  );
}
