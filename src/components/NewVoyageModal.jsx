import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Boxes, MapPinPlus, Plus, Route, Save, Trash2, X } from 'lucide-react';
import { VoyageMap } from './VoyageMap.jsx';

function initialForm(vessels) {
  const vessel = vessels[0];
  const routePointIds = vessel?.routePoints.map((port) => port.id) ?? [];

  return {
    title: '',
    vesselId: vessel?.id ?? '',
    cargoIds: [],
    originPortId: routePointIds[0] ?? '',
    destinationPortId: routePointIds.at(-1) ?? '',
    waypointIds: routePointIds.slice(1, -1),
    startDate: '2026-08-10T08:00',
    endDate: '2026-08-18T18:00',
    comment: '',
  };
}

export function NewVoyageModal({ isOpen, vessels, cargos, ports, voyages, onClose, onSubmit }) {
  const [form, setForm] = useState(() => initialForm(vessels));
  const [nextWaypointId, setNextWaypointId] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setForm(initialForm(vessels));
    setNextWaypointId('');
    setFormError('');
  }, [isOpen, vessels]);

  const selectedVessel = useMemo(
    () => vessels.find((vessel) => vessel.id === form.vesselId) ?? vessels[0],
    [form.vesselId, vessels]
  );
  const selectedVesselCargos = useMemo(
    () => cargos.filter((cargo) => cargo.vessel === selectedVessel?.name),
    [cargos, selectedVessel]
  );
  const assignedCargoIds = useMemo(
    () => new Set(voyages.filter((voyage) => voyage.status !== 'Завершен').flatMap((voyage) => voyage.cargoIds)),
    [voyages]
  );
  const routePointIds = useMemo(
    () => [form.originPortId, ...form.waypointIds, form.destinationPortId].filter(Boolean),
    [form.destinationPortId, form.originPortId, form.waypointIds]
  );
  const previewVoyage = useMemo(
    () => ({ id: 'preview', routePointIds }),
    [routePointIds]
  );
  const routePortSet = new Set(routePointIds);
  const availableWaypointPorts = ports.filter((port) => !routePortSet.has(port.id));
  const portById = Object.fromEntries(ports.map((port) => [port.id, port]));

  if (!isOpen || !selectedVessel) return null;

  function updateField(field, value) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setFormError('');
  }

  function handleVesselChange(vesselId) {
    const vessel = vessels.find((item) => item.id === vesselId);
    const vesselRoute = vessel?.routePoints.map((port) => port.id) ?? [];

    setForm((currentForm) => ({
      ...currentForm,
      vesselId,
      cargoIds: [],
      originPortId: vesselRoute[0] ?? '',
      destinationPortId: vesselRoute.at(-1) ?? '',
      waypointIds: vesselRoute.slice(1, -1),
    }));
    setNextWaypointId('');
    setFormError('');
  }

  function toggleCargo(cargoId) {
    setForm((currentForm) => ({
      ...currentForm,
      cargoIds: currentForm.cargoIds.includes(cargoId)
        ? currentForm.cargoIds.filter((id) => id !== cargoId)
        : [...currentForm.cargoIds, cargoId],
    }));
    setFormError('');
  }

  function addWaypoint() {
    if (!nextWaypointId) return;
    setForm((currentForm) => ({
      ...currentForm,
      waypointIds: [...currentForm.waypointIds, nextWaypointId],
    }));
    setNextWaypointId('');
  }

  function removeWaypoint(index) {
    setForm((currentForm) => ({
      ...currentForm,
      waypointIds: currentForm.waypointIds.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function moveWaypoint(index, direction) {
    setForm((currentForm) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= currentForm.waypointIds.length) return currentForm;

      const waypointIds = [...currentForm.waypointIds];
      [waypointIds[index], waypointIds[nextIndex]] = [waypointIds[nextIndex], waypointIds[index]];
      return { ...currentForm, waypointIds };
    });
  }

  function handlePortChange(field, portId) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: portId,
      waypointIds: currentForm.waypointIds.filter((id) => id !== portId),
    }));
    setFormError('');
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (form.originPortId === form.destinationPortId) {
      setFormError('Порты отправления и прибытия должны отличаться.');
      return;
    }
    if (new Date(form.endDate) <= new Date(form.startDate)) {
      setFormError('Дата окончания должна быть позже даты начала.');
      return;
    }
    if (form.cargoIds.length === 0) {
      setFormError('Прикрепите к рейсу хотя бы один доступный груз.');
      return;
    }

    onSubmit({
      title: form.title.trim(),
      vesselId: form.vesselId,
      cargoIds: form.cargoIds,
      routePointIds,
      startDate: form.startDate,
      endDate: form.endDate,
      comment: form.comment.trim(),
      status: 'Запланирован',
    });
  }

  return (
    <div className="modal-backdrop">
      <section className="modal voyage-create-modal" role="dialog" aria-modal="true" aria-labelledby="voyage-modal-title">
        <header className="modal-head">
          <div>
            <h2 id="voyage-modal-title">Создание рейса</h2>
            <span>Назначьте судно, грузы, маршрут и сроки</span>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Закрыть">
            <X size={20} />
          </button>
        </header>

        <form className="voyage-form" onSubmit={handleSubmit}>
          <div className="voyage-form-fields">
            <label className="full-field">
              Название рейса
              <input
                required
                value={form.title}
                onChange={(event) => updateField('title', event.target.value)}
                placeholder="Например Арктическое снабжение / август"
              />
            </label>

            <label className="full-field">
              Судно
              <select required value={form.vesselId} onChange={(event) => handleVesselChange(event.target.value)}>
                {vessels.map((vessel) => <option key={vessel.id} value={vessel.id}>{vessel.name}</option>)}
              </select>
            </label>

            <label>
              Порт отправления
              <select required value={form.originPortId} onChange={(event) => handlePortChange('originPortId', event.target.value)}>
                {ports.filter((port) => port.id !== form.destinationPortId).map((port) => (
                  <option key={port.id} value={port.id}>{port.name}</option>
                ))}
              </select>
            </label>

            <label>
              Порт прибытия
              <select required value={form.destinationPortId} onChange={(event) => handlePortChange('destinationPortId', event.target.value)}>
                {ports.filter((port) => port.id !== form.originPortId).map((port) => (
                  <option key={port.id} value={port.id}>{port.name}</option>
                ))}
              </select>
            </label>

            <div className="route-editor full-field">
              <span className="field-label"><Route size={16} />Маршрут</span>
              <div className="route-sequence">
                <span className="route-endpoint"><strong>01</strong>{portById[form.originPortId]?.name}</span>
                {form.waypointIds.map((portId, index) => (
                  <div className="route-waypoint" key={portId}>
                    <span><strong>{String(index + 2).padStart(2, '0')}</strong>{portById[portId]?.name}</span>
                    <div>
                      <button type="button" className="route-action" disabled={index === 0} onClick={() => moveWaypoint(index, -1)} aria-label="Переместить порт выше"><ArrowUp size={15} /></button>
                      <button type="button" className="route-action" disabled={index === form.waypointIds.length - 1} onClick={() => moveWaypoint(index, 1)} aria-label="Переместить порт ниже"><ArrowDown size={15} /></button>
                      <button type="button" className="route-action danger" onClick={() => removeWaypoint(index)} aria-label="Удалить порт"><Trash2 size={15} /></button>
                    </div>
                  </div>
                ))}
                <span className="route-endpoint destination"><strong>{String(routePointIds.length).padStart(2, '0')}</strong>{portById[form.destinationPortId]?.name}</span>
              </div>
              <div className="waypoint-add">
                <select value={nextWaypointId} onChange={(event) => setNextWaypointId(event.target.value)} aria-label="Промежуточный порт">
                  <option value="">Добавить промежуточный порт</option>
                  {availableWaypointPorts.map((port) => <option key={port.id} value={port.id}>{port.name}</option>)}
                </select>
                <button type="button" className="ghost-button" disabled={!nextWaypointId} onClick={addWaypoint} aria-label="Добавить порт в маршрут"><Plus size={18} /></button>
              </div>
            </div>

            <label>
              Дата начала
              <input required type="datetime-local" value={form.startDate} onChange={(event) => updateField('startDate', event.target.value)} />
            </label>

            <label>
              Дата окончания
              <input required type="datetime-local" min={form.startDate} value={form.endDate} onChange={(event) => updateField('endDate', event.target.value)} />
            </label>

            <fieldset className="voyage-cargo-picker full-field">
              <legend><Boxes size={16} />Грузы судна</legend>
              <div>
                {selectedVesselCargos.map((cargo) => {
                  const isAssigned = assignedCargoIds.has(cargo.id);
                  return (
                    <label key={cargo.id} className={isAssigned ? 'disabled' : ''}>
                      <input
                        type="checkbox"
                        checked={form.cargoIds.includes(cargo.id)}
                        disabled={isAssigned}
                        onChange={() => toggleCargo(cargo.id)}
                      />
                      <span><strong>{cargo.title}</strong><small>{cargo.id} · {cargo.weight}{isAssigned ? ' · уже в рейсе' : ''}</small></span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <label className="full-field">
              Комментарий к рейсу
              <textarea value={form.comment} onChange={(event) => updateField('comment', event.target.value)} placeholder="Условия проводки, контрольные точки, примечания" rows="4" />
            </label>
          </div>

          <div className="voyage-form-map">
            <div className="voyage-map-title"><MapPinPlus size={17} /><span><strong>Предпросмотр маршрута</strong><small>На карте показано только выбранное судно</small></span></div>
            <VoyageMap voyage={previewVoyage} vessel={selectedVessel} ports={ports} placeAtOrigin />
          </div>

          <footer className="modal-actions voyage-modal-actions">
            {formError && <p className="form-error" role="alert">{formError}</p>}
            <button className="ghost-button" type="button" onClick={onClose}>Отмена</button>
            <button className="primary-button" type="submit"><Save size={18} />Создать рейс</button>
          </footer>
        </form>
      </section>
    </div>
  );
}
