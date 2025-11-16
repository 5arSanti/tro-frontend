import './App.css'
import { VideoDetection } from './components/VideoDetection'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Video Detection System</h1>
        <p>Real-time object detection using YOLO model</p>
      </header>
      <main className="app-main">
        <VideoDetection />
      </main>
    </div>
  )
}

export default App
