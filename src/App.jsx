import React, { useMemo, useState } from 'react';
import { Boxes, CheckCircle2, Clock3, Ship } from 'lucide-react';
import { cargos, events, roles, vessels } from './data/mockData.js';
import { Header } from './components/Header.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { MetricCard } from './components/MetricCard.jsx';
import { MapPanel } from './components/MapPanel.jsx';
import { VesselDetails } from './components/VesselDetails.jsx';
import { CargoTable } from './components/CargoTable.jsx';
import { CargoDetails } from './components/CargoDetails.jsx';
import { EventsPanel } from './components/EventsPanel.jsx';
import { RolesPanel } from './components/RolesPanel.jsx';

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedVessel, setSelectedVessel] = useState(vessels[0]);
  const [selectedCargo, setSelectedCargo] = useState(cargos[0]);

  const filteredCargos = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return cargos;

    return cargos.filter((cargo) =>
      [cargo.id, cargo.bl, cargo.title, cargo.owner, cargo.vessel, cargo.status]
        .join(' ')
        .toLowerCase()
        .includes(value)
    );
  }, [query]);

  const vesselCargos = cargos.filter((cargo) => cargo.vessel === selectedVessel.name);

  return (
    <main className="app-shell">
      <Sidebar />

      <section className="workspace">
        <Header />

        <section className="metrics-grid">
          <MetricCard icon={<Ship />} label="Активные суда" value="24" hint="+3 за сутки" />
          <MetricCard icon={<Boxes />} label="Грузы в пути" value="186" hint="42 требуют контроля" />
          <MetricCard icon={<Clock3 />} label="Средний ETA" value="12.4 дн." hint="-8% к прошлой неделе" />
          <MetricCard icon={<CheckCircle2 />} label="Без задержек" value="91%" hint="по текущим рейсам" />
        </section>

        <section className="main-grid">
          <MapPanel
            vessels={vessels}
            selectedVessel={selectedVessel}
            onSelectVessel={setSelectedVessel}
          />
          <VesselDetails
            vessel={selectedVessel}
            cargos={vesselCargos}
            onSelectCargo={setSelectedCargo}
          />
        </section>

        <section className="lower-grid">
          <CargoTable
            cargos={filteredCargos}
            query={query}
            selectedCargo={selectedCargo}
            onQueryChange={setQuery}
            onSelectCargo={setSelectedCargo}
          />
          <CargoDetails cargo={selectedCargo} />
        </section>

        <section className="bottom-grid">
          <EventsPanel events={events} />
          <RolesPanel roles={roles} />
        </section>
      </section>
    </main>
  );
}
