import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Md5 } from 'ts-md5';

const Homepage: React.FC = () => {
    const [breed, setBreed] = useState<string>('');
    const [catImages, setCatImages] = useState<any[]>([]);
    const [breeds, setBreeds] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1); // Start from page 1
    const [hasMoreCats, setHasMoreCats] = useState<boolean>(true);
    const [uniqueHashes, setUniqueHashes] = useState<string[]>([]);
    const corsAnywhereUrl = 'http://localhost:8080'; // Use cors-anywhere

    useEffect(() => {
        // Fetch cat breeds when the component mounts
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
            }
        };

        fetchBreeds();
    }, []); // Empty dependency array ensures this effect runs once on component mount

    const getImageContentHash = async (url: string) => {
        const response = await axios.get(`${corsAnywhereUrl}/${url}`, { responseType: 'arraybuffer' });
        const buffer = new Uint8Array(response.data);

        // Convert the Uint8Array to a string using TextDecoder
        const text = new TextDecoder().decode(buffer);

        // Now you can use hashStr with the string
        return Md5.hashStr(text);
    };

    const handleBreedChange = async (selectedBreed: any) => {
        setBreed(selectedBreed);
        setPage(1); // Reset page when changing breed
        setHasMoreCats(true); // Reset hasMoreCats
        setUniqueHashes([]); // Reset uniqueHashes

        try {
            const response = await axios.get(
                `${corsAnywhereUrl}/https://api.thecatapi.com/v1/images/search?page=1&limit=10&breed_ids=${selectedBreed}`,
                {
                    headers: {
                        'x-api-key': 'live_cpPmfeiLsuY2F5gDsUNLI3DMXHA7gx0pLKaNjX1J665ZrEUS8emY9eZReoM6h8VS',
                    },
                }
            );

            const images = response.data;
            const uniqueNewImages = await filterUniqueImages(images);
            setCatImages(uniqueNewImages);
            await updateUniqueHashes(uniqueNewImages);
        } catch (error) {
            console.error('Error fetching cat images:', error);
            alert('Apologies but we could not load new cats for you at this time! Miau!');
        }
    };

    const handleLoadMore = async () => {
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
                await updateUniqueHashes(uniqueNewImages);
            }
        } catch (error) {
            console.error('Error fetching additional cat images:', error);
            alert('Apologies but we could not load more cats for you at this time! Miau!');
        }
    };

    const filterUniqueImages = async (newImages: any[]) => {
        const uniqueNewImages: any[] = [];

        for (const newImage of newImages) {
            const contentHash = await getImageContentHash(newImage.url);
            console.log('uniqueHashes', uniqueHashes);

            if (!uniqueHashes.includes(contentHash)) {
                uniqueNewImages.push({
                    ...newImage,
                    contentHash,
                });
               uniqueHashes.push(contentHash);
            }
        }

        return uniqueNewImages;
    };


    const updateUniqueHashes = async (images: any[]) => {
        for (const image of images) {
            const contentHash = await getImageContentHash(image.url);
            setUniqueHashes((prevHashes) => [...prevHashes, contentHash]);
        }
    };

    return (
        <div>
            <h1>Cat Browser</h1>
            <label>Breed</label>
            <select onChange={(e) => handleBreedChange(e.target.value)}>
                <option value="">Select Breed</option>
                {breeds.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>

            {catImages.length > 0 && (
                <div>
                    <h2>Images of {breed}</h2>
                    <div>
                        {catImages.map((image: any, index) => (
                            <img key={index} src={image.url} alt={`Cat ${index + 1}`} />
                        ))}
                    </div>
                    {hasMoreCats && <button onClick={handleLoadMore}>Load more</button>}
                </div>
            )}
        </div>
    );
};

export default Homepage;
