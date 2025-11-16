import "./App.css";
import { VideoDetection } from "./components/VideoDetection";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🚇 Sistema de Monitoreo Metro - TRO</h1>
        <p>
          Control y Gestión de Rutas en Tiempo Real con Detección Inteligente
        </p>
      </header>
      <main className="app-main">
        <VideoDetection />
      </main>
    </div>
  );
}

export default App;
