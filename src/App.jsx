import React, { useEffect, useMemo, useState } from 'react';
import { Boxes, CheckCircle2, Clock3, Ship } from 'lucide-react';
import { cargos, events, roles, vessels } from './data/mockData.js';
import { Header } from './components/Header.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { MetricCard } from './components/MetricCard.jsx';
import { MapPanel } from './components/MapPanel.jsx';
import { VesselDetails } from './components/VesselDetails.jsx';
import { PortDetails } from './components/PortDetails.jsx';
import { CargoTable } from './components/CargoTable.jsx';
import { CargoInfoModal } from './components/CargoInfoModal.jsx';
import { CargoListModal } from './components/CargoListModal.jsx';
import { EventsPanel } from './components/EventsPanel.jsx';
import { RolesPanel } from './components/RolesPanel.jsx';
import { NewCargoModal } from './components/NewCargoModal.jsx';

export default function App() {
  const [query, setQuery] = useState('');
  const [cargoList, setCargoList] = useState(cargos);
  const [cargoModalMode, setCargoModalMode] = useState('create');
  const [cargoPanel, setCargoPanel] = useState(null);
  const [editingCargo, setEditingCargo] = useState(null);
  const [isCargoModalOpen, setIsCargoModalOpen] = useState(false);
  const [isCargoInfoOpen, setIsCargoInfoOpen] = useState(false);
  const [selectedVessel, setSelectedVessel] = useState(vessels[0]);
  const [selectedNsrPort, setSelectedNsrPort] = useState(null);
  const [selectedCargo, setSelectedCargo] = useState(cargos[0]);
  const hasOpenModal = Boolean(cargoPanel) || isCargoModalOpen || isCargoInfoOpen;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (hasOpenModal) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [hasOpenModal]);

  const filteredCargos = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return cargoList;

    return cargoList.filter((cargo) => {
      const cargoColumn = [cargo.id, cargo.bl, cargo.title].join(' ');
      const routeColumn = `${cargo.origin} - ${cargo.destination}`;
      const searchableColumns = [cargoColumn, cargo.owner, cargo.vessel, routeColumn, cargo.eta].join(' ');

      return searchableColumns.toLowerCase().includes(value);
    });
  }, [cargoList, query]);

  const vesselCargos = cargoList.filter((cargo) => cargo.vessel === selectedVessel.name);
  const portCargos = selectedNsrPort
    ? cargoList.filter((cargo) => cargo.origin === selectedNsrPort.name || cargo.destination === selectedNsrPort.name)
    : [];

  function openCargoInfo(cargo) {
    setSelectedCargo(cargo);
    setIsCargoInfoOpen(true);
  }

  function openVesselCargosPanel() {
    setCargoPanel({
      title: `Грузы судна ${selectedVessel.name}`,
      subtitle: selectedVessel.route,
      cargos: vesselCargos,
    });
  }

  function openPortCargosPanel() {
    if (!selectedNsrPort) return;

    setCargoPanel({
      title: `Грузы порта ${selectedNsrPort.name}`,
      subtitle: selectedNsrPort.mainCargo,
      cargos: portCargos,
    });
  }

  function handleSelectVessel(vessel) {
    setSelectedVessel(vessel);
    setSelectedNsrPort(null);
    setCargoPanel(null);
  }

  function openCreateCargoModal() {
    setCargoModalMode('create');
    setEditingCargo(null);
    setIsCargoModalOpen(true);
  }

  function openEditCargoModal(cargo) {
    setCargoModalMode('edit');
    setEditingCargo(cargo);
    setSelectedCargo(cargo);
    setIsCargoModalOpen(true);
  }

  function closeCargoModal() {
    setIsCargoModalOpen(false);
    setEditingCargo(null);
  }

  function handleCreateCargo(cargoForm) {
    const newCargo = {
      ...cargoForm,
      id: `C-${Date.now().toString().slice(-4)}`,
      bl: `BL-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    setCargoList((currentCargos) => [newCargo, ...currentCargos]);
    setSelectedCargo(newCargo);
    setQuery('');
    closeCargoModal();
  }

  function handleUpdateCargo(cargoForm) {
    if (!editingCargo) return;

    const updatedCargo = {
      ...editingCargo,
      ...cargoForm,
    };

    setCargoList((currentCargos) =>
      currentCargos.map((cargo) => (cargo.id === updatedCargo.id ? updatedCargo : cargo))
    );
    setCargoPanel((currentPanel) =>
      currentPanel
        ? {
            ...currentPanel,
            cargos: currentPanel.cargos.map((cargo) => (cargo.id === updatedCargo.id ? updatedCargo : cargo)),
          }
        : currentPanel
    );
    setSelectedCargo(updatedCargo);
    closeCargoModal();
  }

  return (
    <main className="app-shell">
      <Sidebar />

      <section className="workspace">
        <Header onCreateCargo={openCreateCargoModal} />

        <section className="metrics-grid">
          <MetricCard icon={<Ship />} label="Активные суда" value="24" hint="+3 за сутки" />
          <MetricCard icon={<Boxes />} label="Грузы в пути" value={cargoList.length} hint="моковые записи" />
          <MetricCard icon={<Clock3 />} label="Средний ETA" value="12.4 дн." hint="-8% к прошлой неделе" />
          <MetricCard icon={<CheckCircle2 />} label="Без задержек" value="91%" hint="по текущим рейсам" />
        </section>

        <section className="main-grid">
          <MapPanel
            selectedNsrPort={selectedNsrPort}
            vessels={vessels}
            selectedVessel={selectedVessel}
            onSelectNsrPort={(port) => {
              setSelectedNsrPort(port);
              setCargoPanel(null);
            }}
            onSelectVessel={handleSelectVessel}
          />
          {selectedNsrPort ? (
            <PortDetails
              port={selectedNsrPort}
              cargos={portCargos}
              onBack={() => setSelectedNsrPort(null)}
              onOpenCargos={openPortCargosPanel}
            />
          ) : (
            <VesselDetails
              vessel={selectedVessel}
              cargos={vesselCargos}
              onOpenCargos={openVesselCargosPanel}
            />
          )}
        </section>

        <section className="lower-grid">
          <CargoTable
            cargos={filteredCargos}
            query={query}
            selectedCargo={selectedCargo}
            onEditCargo={openEditCargoModal}
            onQueryChange={setQuery}
            onSelectCargo={openCargoInfo}
          />
        </section>

        <section className="bottom-grid">
          <EventsPanel events={events} />
          <RolesPanel roles={roles} />
        </section>
      </section>

      <CargoListModal
        cargos={cargoPanel?.cargos ?? []}
        isOpen={Boolean(cargoPanel)}
        selectedCargo={selectedCargo}
        subtitle={cargoPanel?.subtitle ?? ''}
        title={cargoPanel?.title ?? ''}
        onClose={() => setCargoPanel(null)}
        onEditCargo={openEditCargoModal}
        onSelectCargo={openCargoInfo}
      />

      <NewCargoModal
        cargo={editingCargo}
        isOpen={isCargoModalOpen}
        mode={cargoModalMode}
        vessels={vessels}
        onClose={closeCargoModal}
        onSubmit={cargoModalMode === 'edit' ? handleUpdateCargo : handleCreateCargo}
      />

      <CargoInfoModal
        cargo={selectedCargo}
        isOpen={isCargoInfoOpen}
        onClose={() => setIsCargoInfoOpen(false)}
      />
    </main>
  );
}
