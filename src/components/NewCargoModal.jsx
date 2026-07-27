import React, { useEffect, useMemo, useState } from 'react';
import { PackagePlus, Save, X } from 'lucide-react';
import { cargoTypes } from '../utils/cargoTypes.js';

const initialForm = {
  title: '',
  type: 'Генеральный груз',
  owner: '',
  vessel: '',
  origin: '',
  destination: '',
  status: 'Ожидает отправки',
  weight: '',
  eta: '',
};

const statuses = ['Ожидает отправки', 'Погружен', 'В пути', 'Задержан', 'Прибыл'];

export function NewCargoModal({ cargo, isOpen, mode = 'create', vessels, onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const isEditMode = mode === 'edit';

  const selectedVessel = useMemo(
    () => vessels.find((vessel) => vessel.name === form.vessel),
    [form.vessel, vessels]
  );

  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && cargo) {
      setForm({
        title: cargo.title,
        type: cargo.type ?? 'Прочее',
        owner: cargo.owner,
        vessel: cargo.vessel,
        origin: cargo.origin,
        destination: cargo.destination,
        status: cargo.status,
        weight: cargo.weight,
        eta: cargo.eta,
      });
      return;
    }

    const firstVessel = vessels[0];
    setForm({
      ...initialForm,
      vessel: firstVessel?.name ?? '',
      origin: firstVessel?.routePoints[0]?.name ?? '',
      destination: firstVessel?.routePoints.at(-1)?.name ?? '',
      eta: firstVessel?.eta ?? '',
    });
  }, [cargo, isEditMode, isOpen, vessels]);

  useEffect(() => {
    if (!selectedVessel || isEditMode) return;

    setForm((currentForm) => ({
      ...currentForm,
      origin: selectedVessel.routePoints[0]?.name ?? currentForm.origin,
      destination: selectedVessel.routePoints.at(-1)?.name ?? currentForm.destination,
      eta: selectedVessel.eta,
    }));
  }, [isEditMode, selectedVessel]);

  if (!isOpen) return null;

  function updateField(field, value) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <div className="modal-backdrop">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="cargo-modal-title">
        <header className="modal-head">
          <div>
            <h2 id="cargo-modal-title">{isEditMode ? 'Редактирование груза' : 'Новый груз'}</h2>
            <span>{isEditMode ? `Изменение записи ${cargo?.id}` : 'Создание моковой записи для таблицы грузов'}</span>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Закрыть">
            <X size={20} />
          </button>
        </header>

        <form className="cargo-form" onSubmit={handleSubmit}>
          <label>
            Наименование
            <input
              required
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              placeholder="Например песок / 300 т"
            />
          </label>

          <label>
            Тип груза
            <select value={form.type} onChange={(event) => updateField('type', event.target.value)}>
              {cargoTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>

          <label>
            Владелец
            <input
              required
              value={form.owner}
              onChange={(event) => updateField('owner', event.target.value)}
              placeholder="Название компании"
            />
          </label>

          <label>
            Судно
            <select required value={form.vessel} onChange={(event) => updateField('vessel', event.target.value)}>
              {vessels.map((vessel) => (
                <option key={vessel.id} value={vessel.name}>{vessel.name}</option>
              ))}
            </select>
          </label>

          <label>
            Статус
            <select value={form.status} onChange={(event) => updateField('status', event.target.value)}>
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>

          <label>
            Порт отправления
            <input
              required
              value={form.origin}
              onChange={(event) => updateField('origin', event.target.value)}
            />
          </label>

          <label>
            Порт назначения
            <input
              required
              value={form.destination}
              onChange={(event) => updateField('destination', event.target.value)}
            />
          </label>

          <label>
            Вес
            <input
              required
              value={form.weight}
              onChange={(event) => updateField('weight', event.target.value)}
              placeholder="Например 84 т"
            />
          </label>

          <label>
            ETA
            <input
              required
              value={form.eta}
              onChange={(event) => updateField('eta', event.target.value)}
              placeholder="Например 02.08.2026 18:30"
            />
          </label>

          <footer className="modal-actions">
            <button className="ghost-button" type="button" onClick={onClose}>Отмена</button>
            <button className="primary-button" type="submit">
              {isEditMode ? <Save size={18} /> : <PackagePlus size={18} />}
              {isEditMode ? 'Сохранить' : 'Добавить груз'}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
