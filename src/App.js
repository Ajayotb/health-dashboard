import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Predict from './components/Predict';
import History from './components/History';
import User from './components/User';
import Users from './components/Users';
import Readings from './components/Readings';
import './App.css';

function App() {
    return (
        <Router>
            <div style={{ backgroundColor: '#0A0F1E', minHeight: '100vh' }}>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/predict" element={<Predict />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/user" element={<User />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/readings/:type" element={<Readings />} />
                    <Route path="/readings" element={<Readings />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;