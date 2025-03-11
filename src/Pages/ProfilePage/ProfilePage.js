import React from 'react';
import ErrorPage from '../ErrorPage/ErrorPage';
import PageWrapper from '../PageWrapper';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useUserContext } from '../../Components/UserProvider/UserProvider';
import { movieData } from '../../Components/Movie_Show/movieData';
import { showData } from '../../Components/Movie_Show/showData';
import { Avatar, Typography, Chip, Button } from '@mui/material';
import PosterCard from '../../Components/Movie_Show/posterCardSmall';
import './ProfilePage.css';
import EmptyMovieList from './../../Components/EmptyMovieList/EmptyMovieList';

const ProfilePage = () => {
    const { profileId } = useParams();
    const { currentProfileId, profiles } = useUserContext();
    const navigate = useNavigate();


    const isCurrentUser = !profileId || profileId === currentProfileId;
    const profileData = isCurrentUser ? profiles[currentProfileId] : profiles[profileId];

    if (!isCurrentUser && !profileData) return <ErrorPage />;

    const likedMovies = movieData.filter(movie => profileData.likedMovies.includes(movie.id));
    const likedTVShows = showData.filter(show => profileData.likedTVShows.includes(show.id));


    // From MUI docs
    function stringToColor(string) {
        let hash = 0;
        let i;

        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }

        return color;
    }

    function stringAvatar(name) {

        let displayname = name[0]
        if (name.includes(' '))
            displayname = `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`

        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: displayname,
        };
    }

    return (
        <PageWrapper>
            <div className="profile-container">
                <div className="profile-header">
                    <Avatar
                        className="profile-avatar"
                        alt={profileData.name || "User"}
                        {...stringAvatar(profileData.name || "User")}
                    />
                    <div className="profile-info">
                        <Typography variant="h4">{`${profileData.name}'s Profile`}</Typography>
                        <Typography variant="body1" className="profile-id">Profile ID: {profileData.profileId}</Typography>
                    </div>
                </div>

                <div className="section">
                    <Typography variant="h6">Genre Preferences</Typography>
                    <div className="genre-preferences">
                        {profileData.likedGenres.map((genre, index) => (
                            <Chip key={index} label={genre} className="genre-chip" />
                        ))}
                    </div>
                </div>

                <div className="section">
                    <Typography variant="h6">Favorite Movies</Typography>
                    <div className="movie-list">
                        {likedMovies.length > 0
                            ? likedMovies.map(movie => (
                                <PosterCard key={movie.id} {...movie} />
                            ))
                            :
                            <EmptyMovieList className="empty-media-list">
                                No Liked Movies
                                <Button variant='contained' onClick={() => navigate('/discover')}>Start Swiping</Button>
                            </EmptyMovieList>}
                    </div>
                </div>

                <div className="section">
                    <Typography variant="h6">Favorite TV Shows</Typography>
                    <div className="tvshow-list">
                        {
                            likedTVShows.length > 0
                                ? likedTVShows.map(show => (
                                    <PosterCard key={show.id} {...show} />
                                ))
                                :
                                <EmptyMovieList className="empty-media-list">
                                    No Liked TV Shows
                                    <Button variant='contained' onClick={() => navigate('/discover')}>Start Swiping</Button>
                                </EmptyMovieList>}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default ProfilePage;
