// App.tsx

import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage';
import SingleCatPage from './components/SingleCatPage';
import './App.scss';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/b/:breed" element={<Homepage />} />
                <Route path="/b/:breed/:id" element={<SingleCatPage />} />
            </Routes>
        </Router>
    );
};

export default App;
