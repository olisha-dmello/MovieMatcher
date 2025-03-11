import React from 'react';
import './posterCardLarge.css';

const posterCard = ({ title, genres, description, rating, poster }) => {
    return (
        <div className="card">
            <div className="poster-container">
                <img src={poster} alt={title} className="poster" />
            </div>
            <div className="card-content">
                <h3>{title}</h3>
                <p><strong>Rating:</strong> {rating}/10</p>
                <div className="genres">
                    {genres.map((genre) => (
                        <span key={genre} className="genre-tag">{genre}</span>
                    ))}
                </div>
                <p className="description">{description}</p>
            </div>
        </div>
    );
};

export default posterCard;
