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

    // Track scroll position
    const [scrollPosition, setScrollPosition] = useState<number>(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        // Attach scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (!catData || !breedDetails) {
        // Handle the case where catData or breedDetails is not available
        return <div>*Purring*</div>;
    }

    const { id, url } = catData;
    const { name, origin, temperament, description } = breedDetails;

    return (
        <div>
            <div
                className="parallax-container"
                style={{
                    backgroundImage: `url(${url})`,
                    backgroundAttachment: 'fixed',
                    backgroundPosition: `center ${scrollPosition * 0.1}px`, // Adjust the multiplier for the parallax effect
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    minHeight: '100vh', // Ensure full height
                }}
            >
                <div className="parallax-element">
                    <h2>{name}</h2>
                    <p>Origin: {origin}</p>
                    <p>Temperament: {temperament}</p>
                    <p>{description}</p>
                    <div>
                        {/* Add a Link to navigate back to the homepage with the current breed */}
                        <Link to={`../b/${catData.breeds[0].id}`}>Back</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleCatPage;
