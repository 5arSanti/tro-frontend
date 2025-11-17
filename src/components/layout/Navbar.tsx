import { NavLink } from "react-router-dom";
import { useHealthCheck } from "../../hooks/useHealthCheck";

export function Navbar() {
  const systemHealth = useHealthCheck();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="brand-logo">TRO</div>
        <div className="brand-text">
          <span className="brand-title">Sistema de Vigilancia</span>
          <span className="brand-subtitle">Transport Route Optimization</span>
        </div>
      </div>
      
      <div className="navbar-menu">
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>Inicio</span>
        </NavLink>
        
        <NavLink 
          to="/monitoring" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 7l-7 5 7 5V7z"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
          </svg>
          <span>Monitoreo</span>
        </NavLink>
        
        <NavLink 
          to="/cameras" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
            <polyline points="17 2 12 7 7 2"/>
          </svg>
          <span>Cámaras</span>
        </NavLink>
      </div>
      
      <div className={`navbar-status ${systemHealth.isOnline ? 'online' : 'offline'}`}>
        <div className="status-indicator-live"></div>
        <span>{systemHealth.isOnline ? "Sistema Operativo" : "Sistema Desconectado"}</span>
      </div>
    </nav>
  );
}

