// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage';
import SingleCatPage from './components/SingleCatPage';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/cat/:breed" element={<SingleCatPage />} />
            </Routes>
        </Router>
    );
};

export default App;
