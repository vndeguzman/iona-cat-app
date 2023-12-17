import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const SingleCatPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const catData = location.state && location.state.catData;
    const [breedDetails, setBreedDetails] = useState<any | null>(null);

    useEffect(() => {
        const fetchBreedDetails = async () => {
            if (catData && catData.breeds.length > 0) {
                const breedId = catData.breeds[0].id; // Assuming there's only one breed
                try {
                    const response = await axios.get(`https://api.thecatapi.com/v1/breeds/${breedId}`, {
                        headers: {
                            'x-api-key': 'live_cpPmfeiLsuY2F5gDsUNLI3DMXHA7gx0pLKaNjX1J665ZrEUS8emY9eZReoM6h8VS', // Replace with your API key
                        },
                    });

                    setBreedDetails(response.data);
                } catch (error) {
                    console.error('Error fetching breed details:', error);
                }
            }
        };

        fetchBreedDetails();
    }, [catData]);

    if (!catData || !breedDetails) {
        // Handle the case where catData or breedDetails is not available
        return <div>Loading...</div>;
    }

    const { id, url } = catData;
    const { name, origin, temperament, description } = breedDetails;

    return (
        <div>
            <div>
                <img src={url} alt={`Cat ${id}`} />
            </div>
            <div>
                <h2>Breed: {name}</h2>
                <p>Origin: {origin}</p>
                <p>Temperament: {temperament}</p>
                <p>Description: {description}</p>
            </div>
            <div>
                {/* Add a Link to navigate back to the homepage with the current breed */}
                <Link to={`../breed/${catData.breeds[0].id}`}>Back</Link>
            </div>
        </div>
    );
};

export default SingleCatPage;
