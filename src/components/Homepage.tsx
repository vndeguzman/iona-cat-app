import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Md5} from 'ts-md5';
import {useNavigate, useParams, useLocation} from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

// @ts-ignore
import { ReactComponent as Logo } from '../logo.svg';

const Homepage: React.FC = () => {
    const [breed, setBreed] = useState<string>('');
    const [catImages, setCatImages] = useState<any[]>([]);
    const [breeds, setBreeds] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMoreCats, setHasMoreCats] = useState<boolean>(true);
    const [uniqueHashes, setUniqueHashes] = useState<string[]>([]);
    const corsAnywhereUrl = 'http://localhost:8080';
    const navigate = useNavigate();
    const {selectedBreedId} = useParams();
    const [loadingBarProgress, setLoadingBarProgress] = useState(0);
    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const urlBreed = pathSegments[2] || '';
    const [runEffect, setRunEffect] = useState(true);
    const [loadingText, setLoadingText] = useState<string>('Load More');

    // Function to fetch random cats
    const fetchRandomCats = async () => {
        try {
            setLoadingBarProgress(0);
            setLoadingText('*Purr*');
            const response = await axios.get(
                `${corsAnywhereUrl}/https://api.thecatapi.com/v1/images/search?limit=10`,
                {
                    headers: {
                        'x-api-key': 'live_cpPmfeiLsuY2F5gDsUNLI3DMXHA7gx0pLKaNjX1J665ZrEUS8emY9eZReoM6h8VS',
                    },
                }
            );

            const uniqueNewImages = await filterUniqueImages(response.data);
            setCatImages(uniqueNewImages);
        } catch (error) {
            console.error('Error fetching random cat images:', error);
            alert('Apologies but we could not load random cat images at this time! Miau!');
        } finally {
            setLoadingBarProgress(100);
            setLoadingText('Load More');
        }
    };

    // Function to fetch cat breeds
    const fetchBreeds = async () => {
        try {
            const response = await axios.get(`${corsAnywhereUrl}/https://api.thecatapi.com/v1/breeds`, {
                headers: {
                    'x-api-key': 'live_cpPmfeiLsuY2F5gDsUNLI3DMXHA7gx0pLKaNjX1J665ZrEUS8emY9eZReoM6h8VS',
                },
            });

            setBreeds(response.data);
        } catch (error) {
            console.error('Error fetching cat breeds:', error);
            alert('Apologies but we could not load cat breeds at this time! Miau!');
        } finally {
            setLoadingBarProgress(0);
        }
    };

    // Function to fetch cat images based on the selected breed
    const fetchImagesByBreed = async (selectedBreed: string) => {
        setLoadingText('*Purr*');
        try {
            const response = await axios.get(
                `${corsAnywhereUrl}/https://api.thecatapi.com/v1/images/search?page=${page}&limit=10&breed_ids=${selectedBreed}`,
                {
                    headers: {
                        'x-api-key': 'live_cpPmfeiLsuY2F5gDsUNLI3DMXHA7gx0pLKaNjX1J665ZrEUS8emY9eZReoM6h8VS',
                    },
                }
            );

            const uniqueNewImages = await filterUniqueImages(response.data);

            if (page === 1) {
                // If it's the first page, set the new images
                setCatImages(uniqueNewImages);
            } else {
                // If it's a subsequent page, append the new images
                setCatImages((prevImages) => [...prevImages, ...uniqueNewImages]);
            }

            // Check if there are more cats
            setHasMoreCats(uniqueNewImages.length > 0);
        } catch (error) {
            console.error('Error fetching cat images:', error);
            alert('Apologies but we could not load cat images at this time! Miau!');
        } finally {
            setLoadingBarProgress(0);
            setLoadingText('Load More');
        }
    };

    // Function to get the content hash of an image
    const getImageContentHash = async (url: string) => {
        const response = await axios.get(`${corsAnywhereUrl}/${url}`, {responseType: 'arraybuffer'});
        const buffer = new Uint8Array(response.data);
        const text = new TextDecoder().decode(buffer);
        setLoadingBarProgress(loadingBarProgress + 10);
        return Md5.hashStr(text);
    };

    // Function to handle breed change
    const handleBreedChange = (selectedBreed: string) => {
        setPage(1);
        setHasMoreCats(true);
        setUniqueHashes([]);
        setCatImages([]);
        setLoadingBarProgress(loadingBarProgress + 10);

        if (selectedBreed) {
            // Fetch images for the selected breed if available
            setBreed(selectedBreed);
            fetchImagesByBreed(selectedBreed);
            // Update the URL with the selected breed
            navigate(`/b/${selectedBreed}`);
        } else {
            // If no breed is selected, fetch random cats
            fetchRandomCats();
            // Update the URL to remove the breed parameter
            navigate('/');
        }
        setRunEffect(false);
    };

    // Function to filter unique images based on content hash
// Function to filter unique images based on content hash
    const filterUniqueImages = async (newImages: any[]) => {
        const uniqueNewImages: any[] = [];

        for (const newImage of newImages) {
            const contentHash = await getImageContentHash(newImage.url);

            if (!uniqueHashes.includes(contentHash)) {
                uniqueNewImages.push({
                    ...newImage,
                    contentHash,
                });
                uniqueHashes.push(contentHash);
            }
        }

        // Update uniqueHashes after processing all images
        setUniqueHashes((prevHashes) => [...prevHashes, ...uniqueNewImages.map((image) => image.contentHash)]);

        return uniqueNewImages;
    };


// Function to handle "Load more" button click
    const handleLoadMore = async () => {
        setLoadingBarProgress(loadingBarProgress + 10);
        setLoadingText('*Purr*');
        try {
            const response = await axios.get(
                `${corsAnywhereUrl}/https://api.thecatapi.com/v1/images/search?page=${page + 1}&limit=10&breed_ids=${breed}`,
                {
                    headers: {
                        'x-api-key': 'live_cpPmfeiLsuY2F5gDsUNLI3DMXHA7gx0pLKaNjX1J665ZrEUS8emY9eZReoM6h8VS',
                    },
                }
            );

            const newImages = response.data;
            const uniqueNewImages = await filterUniqueImages(newImages);

            if (uniqueNewImages.length === 0) {
                setHasMoreCats(false);
            } else {
                setCatImages((prevImages) => [...prevImages, ...uniqueNewImages]);
                setPage((prevPage) => prevPage + 1); // Increment the page
            }
        } catch (error) {
            console.error('Error fetching additional cat images:', error);
            alert('Apologies but we could not load more cats for you at this time! Miau!');
        } finally {
            setLoadingBarProgress(100);
            setLoadingText('Load More')
        }
    };


    // Function to handle "View Details" button click
    const handleViewDetails = (catDetails: any) => {
        navigate(`/b/${catDetails.breeds[0].id}/${catDetails.id}`, {state: {catData: catDetails}});
    };


    useEffect(() => {
        if (runEffect) {
            console.log('here', catImages);
            setLoadingBarProgress(0);
            setLoadingText('*Purr*')
            // Set the breed based on the URL parameter
            const currentBreed = selectedBreedId || urlBreed;
            fetchBreeds();

            if (currentBreed) {
                // Fetch images for the selected breed if available
                setBreed(currentBreed);
                fetchImagesByBreed(currentBreed);
            } else {
                // If no breed is selected, fetch random cats
                fetchRandomCats();
            }

            // Update the route in the URL when the breed changes
            if (currentBreed) {
                navigate(`/b/${currentBreed}`);
            }
            // Your existing useEffect logic

            // Optionally, reset the state variable to allow the effect to run in the future
            setRunEffect(false);
        }

    }, [selectedBreedId, urlBreed, navigate]);

    return (
        <div className="cat-explorer-container">
            <LoadingBar color="#f11946" progress={loadingBarProgress}
                        onLoaderFinished={() => setLoadingBarProgress(0)}/>
            <div className="flex-container">
                <div className="content-container">
                    {catImages.length === 0 && <span>*Purr*</span>}
                    {catImages.length > 0 && (
                        <div className="cat-images-container">
                            {catImages.map((image: any, index) => (
                                <div key={index} className="cat-image-container">
                                    <img onClick={() => handleViewDetails(image)} src={image.url}
                                         alt={`Cat ${index + 1}`}/>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="navigation-bar">
                    <div className="sticky">
                        <Logo />
                        <h1>Cat Breeds</h1>
                        <select id="breedSelect" value={breed} onChange={(e) => handleBreedChange(e.target.value)}>
                            <option value="">--Random--</option>
                            {breeds.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <div>
                            {hasMoreCats &&  <button onClick={handleLoadMore} >{ loadingText }</button> }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;