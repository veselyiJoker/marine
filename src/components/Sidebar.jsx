import React from 'react';
import {
  Anchor,
  Boxes,
  ChevronDown,
  CircleUserRound,
  FileText,
  Map,
  Route,
  Settings,
  Ship,
  Users,
} from 'lucide-react';

const navigationItems = [
  { label: 'Карта судов', icon: Map, active: true },
  { label: 'Грузы', icon: Boxes },
  { label: 'Суда', icon: Ship },
  { label: 'Маршруты', icon: Route },
  { label: 'Документы', icon: FileText },
  { label: 'Пользователи', icon: Users },
  { label: 'Настройки', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark"><Anchor size={22} /></span>
        <div>
          <strong>Северная Логистика</strong>
          <small>Логистический контроль</small>
        </div>
      </div>

      <nav className="nav-list">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button className={item.active ? 'active' : undefined} key={item.label}>
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <section className="profile-card">
        <CircleUserRound size={34} />
        <div>
          <strong>Мария Волкова</strong>
          <span>Логист / Baltic Freight</span>
        </div>
        <ChevronDown size={18} />
      </section>
    </aside>
  );
}
