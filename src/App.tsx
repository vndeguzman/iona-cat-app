// App.tsx

import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage';
import SingleCatPage from './components/SingleCatPage';

const App: React.FC = () => {
    const [cachedImages, setCachedImages] = useState<any[]>([]);

    const updateCachedImages = (images: any[]) => {
        setCachedImages(images);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/breed/:breed" element={<Homepage />} />
                <Route path="/breed/:breed/:id" element={<SingleCatPage />} />
            </Routes>
        </Router>
    );
};

export default App;
