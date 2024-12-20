import React, { useState } from 'react';

const Movies = () => {
    const [selectedMovie, setSelectedMovie] = useState('');

    const movies = [
        'The Shawshank Redemption',
        'The Godfather',
        'The Dark Knight',
        'Pulp Fiction',
        'The Lord of the Rings: The Return of the King'
    ];

    const handleChange = (event) => {
        setSelectedMovie(event.target.value);
    };

    return (
        <div>
            <h1>Select a Movie</h1>
            <select value={selectedMovie} onChange={handleChange}>
                <option value="" disabled>Select a movie</option>
                {movies.map((movie, index) => (
                    <option key={index} value={movie}>
                        {movie}
                    </option>
                ))}
            </select>
            {selectedMovie && <p>You have selected: {selectedMovie}</p>}
        </div>
    );
};

export default Movies;