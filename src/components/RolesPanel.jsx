import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function RolesPanel({ roles }) {
  return (
    <div className="roles-panel">
      <div className="panel-head compact">
        <h2>Права доступа</h2>
        <span>RBAC для профилей</span>
      </div>
      <div className="roles-grid">
        {roles.map((role) => (
          <article className="role-card" key={role.name}>
            <div>
              <ShieldCheck size={20} />
              <strong>{role.name}</strong>
              <span>{role.users} пользователей</span>
            </div>
            <p>{role.permissions.join(' / ')}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
