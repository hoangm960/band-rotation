import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Playlist from './pages/Playlist';
import Ranking from './pages/Ranking';
import Randomize from './pages/Randomize';

function App() {
  return (
    <Router>
      <div className="h-screen bg-gray-100 flex flex-col">
        <nav className="bg-blue-600 p-4">
          <div className="container mx-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Link to="/" className="text-white hover:bg-blue-700 px-2 py-1 rounded">Playlist</Link>
            <Link to="/ranking" className="text-white hover:bg-blue-700 px-2 py-1 rounded">Ranking</Link>
            <Link to="/randomize" className="text-white hover:bg-blue-700 px-2 py-1 rounded">Randomize</Link>
          </div>
        </nav>
        <main className="container mx-auto p-4 flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Playlist />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/randomize" element={<Randomize />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
