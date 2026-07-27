import React from 'react';
import { Anchor, ArrowLeft, Boxes, CloudSnow, Compass, Package, Ship, ThermometerSun, Waves } from 'lucide-react';
import { InfoRow } from './InfoRow.jsx';

export function PortDetails({ port, cargos, onBack, onOpenCargos }) {
  return (
    <aside className="details-panel">
      <div className="panel-head compact">
        <div>
          <h2>{port.name}</h2>
          <span>Портовая сводка СМП</span>
        </div>
        <span className="status good">{port.status}</span>
      </div>

      <button className="ghost-button full-width" type="button" onClick={onBack}>
        <ArrowLeft size={17} />
        Вернуться к судну
      </button>

      <div className="detail-list port-summary">
        <InfoRow icon={<Compass />} label="Координаты" value={`${port.lat.toFixed(4)}, ${port.lon.toFixed(4)}`} />
        <InfoRow icon={<ThermometerSun />} label="Погода" value={port.weather} />
        <InfoRow icon={<Waves />} label="Ледовая обстановка" value={port.iceClass} />
        <InfoRow icon={<Package />} label="Грузооборот" value={port.cargoTurnover} />
        <InfoRow icon={<Ship />} label="Судов в порту" value={port.vesselsInPort} />
        <InfoRow icon={<Anchor />} label="Ожидают на рейде" value={port.waitingVessels} />
        <InfoRow icon={<CloudSnow />} label="Ближайшее прибытие" value={port.nextArrival} />
      </div>

      <section className="cargo-summary-action port-cargos">
        <div>
          <small>Основные грузы</small>
          <strong>{cargos.length}</strong>
          <p>{port.mainCargo}</p>
        </div>
        <button className="primary-button full" type="button" onClick={onOpenCargos}>
          <Boxes size={18} />
          Показать грузы
        </button>
      </section>
    </aside>
  );
}
