// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddProgressPage from './pages/AddProgressPage';
import EditProgressPage from './pages/EditProgressPage';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/add" element={<AddProgressPage />} />
                    <Route path="/edit/:id" element={<EditProgressPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;