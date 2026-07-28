import React from 'react';
import { Bell, Container, Route } from 'lucide-react';

export function Header({ onCreateCargo, onCreateVoyage }) {
  return (
    <header className="topbar">
      <div>
        <h1>Панель морских перевозок</h1>
        <p>Мониторинг судов, грузов, маршрутов и сроков доставки</p>
      </div>
      <div className="top-actions">
        <button className="icon-button" aria-label="Уведомления"><Bell size={20} /></button>
        <button className="ghost-button top-action-button" onClick={onCreateVoyage}>
          <Route size={18} />
          Создать рейс
        </button>
        <button className="primary-button" onClick={onCreateCargo}>
          <Container size={18} />
          Новый груз
        </button>
      </div>
    </header>
  );
}
