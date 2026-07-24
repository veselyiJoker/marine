import React from 'react';
import { Search } from 'lucide-react';
import { statusClass } from '../utils/status.js';

export function CargoTable({ cargos, query, selectedCargo, onQueryChange, onSelectCargo }) {
  return (
    <div className="table-panel">
      <div className="panel-head">
        <div>
          <h2>Отслеживание груза</h2>
          <span>Поиск по номеру груза, BL, владельцу или судну</span>
        </div>
        <label className="search-box">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Например C-1042"
          />
        </label>
      </div>

      <div className="cargo-table">
        <div className="table-row table-head">
          <span>Груз</span>
          <span>Судно</span>
          <span>Маршрут</span>
          <span>ETA</span>
          <span>Статус</span>
        </div>
        {cargos.map((cargo) => (
          <button
            className={`table-row ${selectedCargo.id === cargo.id ? 'selected-row' : ''}`}
            key={cargo.id}
            onClick={() => onSelectCargo(cargo)}
          >
            <span><strong>{cargo.id}</strong><small>{cargo.bl}</small></span>
            <span>{cargo.vessel}</span>
            <span>{cargo.origin} - {cargo.destination}</span>
            <span>{cargo.eta}</span>
            <span><mark className={`status ${statusClass(cargo.status)}`}>{cargo.status}</mark></span>
          </button>
        ))}
      </div>
    </div>
  );
}
