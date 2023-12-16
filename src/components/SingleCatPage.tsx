// src/components/SingleCatPage.tsx

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate

const SingleCatPage: React.FC = () => {
    const { breed } = useParams<{ breed: string }>();
    const navigate = useNavigate(); // Use useNavigate instead of useHistory

    // Dummy data for demonstration, replace with actual data fetching
    const catData = {
        image: 'cat-image-url',
        breed: 'Breed Name',
        origin: 'Origin',
        temperament: 'Temperament',
        description: 'Description of the cat.',
    };

    const handleBack = () => {
        navigate(-1); // Navigate back
    };

    return (
        <div>
            <button onClick={handleBack}>Back</button>
            <h2>{catData.breed}</h2>
            <img src={catData.image} alt={catData.breed} />
            <p>Origin: {catData.origin}</p>
            <p>Temperament: {catData.temperament}</p>
            <p>Description: {catData.description}</p>
        </div>
    );
};

export default SingleCatPage;
