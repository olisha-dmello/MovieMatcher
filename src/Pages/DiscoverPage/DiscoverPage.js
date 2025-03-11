import React from 'react';
import PageWrapper from '../PageWrapper';
import PosterCard from '../../Components/Movie_Show/posterCardLarge'
import { movieData } from '../../Components/Movie_Show/movieData'
import { showData } from '../../Components/Movie_Show/showData'


const DiscoverPage = () => {
    
    return (
        <PageWrapper>
            <h1>Discover</h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {movieData.map((movie) => (
                    <PosterCard
                        key={movie.id} // Remove quotes for variable use
                        title={movie.title}
                        genres={movie.genres}
                        description={movie.description}
                        rating={movie.rating}
                        poster={movie.poster}
                    />
                ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {showData.map((movie) => (
                    <PosterCard
                        key={movie.id} // Remove quotes for variable use
                        title={movie.title}
                        genres={movie.genres}
                        description={movie.description}
                        rating={movie.rating}
                        poster={movie.poster}
                    />
                ))}
            </div>


        </PageWrapper>
    );
};

export default DiscoverPage;
