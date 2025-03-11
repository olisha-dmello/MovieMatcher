import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../PageWrapper';
import { useUserContext } from '../../Components/UserProvider/UserProvider';
import { movieData } from '../../Components/Movie_Show/movieData';
import { showData } from '../../Components/Movie_Show/showData';
import { Avatar, Typography, Button, Paper, Modal, AvatarGroup } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import LiveTvIcon from '@mui/icons-material/LiveTv'; // Import LiveTv icon
import PosterCard from '../../Components/Movie_Show/posterCardSmall';
import ErrorPage from '../ErrorPage/ErrorPage';
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import './../../Components/Modal.css';
import './GroupProfilePage.css';
import EmptyMovieList from './../../Components/EmptyMovieList/EmptyMovieList';
import ConfirmButton from './../../Components/ConfirmButton/ConfirmButton';



const GroupProfilePage = () => {
    const { groupId } = useParams();
    const { groups, profiles, removeMember, movies, shows, currentProfileId } = useUserContext();
    const navigate = useNavigate();

    const groupData = groups[groupId];
    const [displayGroupMembers, setDisplayGroupMembers] = useState(false);
    const closeModal = () => { setDisplayGroupMembers(false) };

    // console.log(groupData);

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

    function stringAvatarWithColor(name) {

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

    const watchlistMovies = movieData.filter(movie => groupData.allmovies.includes(movie.id));
    const watchlistShows = showData.filter(show => groupData.allshows.includes(show.id));

    const handleDeleteMember = (profileId) => {
        removeMember(groupId, profileId);

        // Deleted Myself
        if (profileId === currentProfileId) {
            navigate('/groups');
        }
    };

    const sizes = {
        xs: '50px', // small screens
        sm: '80px', // medium screens
        md: '100px'
    };
    const avatarSize = {
        width: { ...sizes },
        height: { ...sizes },
    }

    //
    // Passes back a list of every media, including a field of profiles who liked it
    const curateLikes = () => {

        const moviesMembersLike = [];
        const showsMembersLike = [];

        const memberIds = groupData.members;
        for (let ind in memberIds) {

            const memberId = groupData.members[ind];
            const memberData = profiles[memberId]
            // console.log('memberid', memberId, memberData)

            // movies
            try {
                memberData.likesPerGroup.movies[groupId].forEach((item, index) => {

                    // Check if exists already
                    const object = moviesMembersLike.find(obj => obj.id === item);
                    if (object) {
                        // Found Duplicate, Log Match
                        object.usersLike.push(memberId);
                    } else {
                        // Add Item, with Counter, to New Item
                        const newItem = { id: item, usersLike: [memberId], movie: true }
                        moviesMembersLike.push(newItem);
                        // console.log('Added Item', item, 'to movies')
                    }
                });
            } catch {
                // No Movies liked for this group
            }

            // Shows
            try {
                memberData.likesPerGroup.shows[groupId].forEach((item, index) => {

                    // Check if exists already
                    const object = showsMembersLike.find(obj => obj.id === item);
                    if (object) {
                        // Found Duplicate, Log Match
                        object.usersLike.push(memberId);
                    } else {
                        // Add Item, with Counter, to New Item
                        const newItem = { id: item, usersLike: [memberId], movie: false }
                        showsMembersLike.push(newItem);
                        // console.log('Added Item', item, 'to tvshows')
                    }
                });
            } catch {
                // No shows liked for this group
            }

        }

        // console.log('moviesMembersLike', moviesMembersLike, showsMembersLike)

        //Sort based on most likes first
        const data = [...moviesMembersLike, ...showsMembersLike];
        data.sort((a, b) => b.usersLike.length - a.usersLike.length);
        return data.filter((item) => item.usersLike.length >= 2);;
    }




    const matchedMedia = [...watchlistShows, ...watchlistMovies];
    const likedMedia = curateLikes();

    if (!groupData) return <ErrorPage />;
    
    return (
        <PageWrapper>
            <div className="group-profile-container">

                <div className="group-header">
                    <Avatar
                        className="group-avatar"
                        alt={groupData.name || "Group"}
                        src={groupData.profile ? `/${groupData.profile}` : ''}
                        sx={avatarSize}
                    >
                        {groupData.name[0]}
                    </Avatar>
                    <div className="group-info">
                        <Typography variant="h4">{groupData.name}</Typography>
                        <Typography variant="body2">{groupData.members.length} Members</Typography>
                    </div>

                    <div className="members-section">
                        {
                            <AvatarGroup max={4}>
                                {groupData.members.map((item) => (
                                    <Avatar
                                        alt={profiles[item].name || "User"}
                                        {...stringAvatarWithColor(profiles[item].name)}
                                        sx={{ bgcolor: stringToColor(profiles[item].name) }}
                                        onClick={() => setDisplayGroupMembers(true)}
                                        key={`avatar-${item}`}
                                    />
                                ))}
                            </AvatarGroup>
                        }
                    </div>
                </div>

                <div className="section">
                    <Tooltip title="Members" arrow>
                        <Button
                            variant="text"
                            color="default"
                            onClick={() => setDisplayGroupMembers(true)}
                            className="icon-button"
                        >
                            <GroupIcon fontSize="large" />
                        </Button>
                    </Tooltip>
                </div>


                <div className="section">
                    {groupData.members.length > 1
                        ?
                        <>
                            <Typography variant="h6">What To Watch</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>These are all the Movies and TV Shows at least 2 members of your group want to watch with each other!</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Movies are only counted towards this talley if you swiped right on the movie under this specific group.</Typography>

                            <br />

                            <div className="liked-media-list">
                                {likedMedia.map((likedItemData, index) => {

                                    const mediaData = (likedItemData.movie) ? movies[likedItemData.id - 1] : shows[likedItemData.id - 1]; // no clue why -1 here. it just needs it.
                                    // console.log(likedItemData, mediaData);

                                    return (
                                        <div key={`searching_for_${index}`} className="liked-media-item">

                                            <PosterCard {...mediaData} />
                                            {/* <br /> */}
                                            {/* <Typography variant="body2">{`Votes so far: ${movie.votes || 0}`}</Typography> */}
                                            <AvatarGroup className='liked-avatars' max={3}>
                                                {
                                                    likedItemData.usersLike.map((userId) => (
                                                        <Avatar
                                                            alt={profiles[userId].name || "User"}
                                                            key={`liked-avatar-${userId}`}
                                                            {...stringAvatarWithColor(profiles[userId].name || "User")}
                                                        />
                                                    ))
                                                }
                                            </AvatarGroup>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                        :
                        <>
                            <Typography variant="h6">What To Watch</Typography>
                            <EmptyMovieList className="empty-media-list">
                                Invite more people to the group to see what you should watch!
                                <br />
                                <br />
                                Join Code: {groupData?.code || "N/A"}
                            </EmptyMovieList>
                        </>
                    }
                </div>

                {/* Watchlist Section */}
                <div className="section">
                    <Typography variant="h6">See if you'll like ...</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>The following are movies that will show up on your swipe page for this group. Start swiping to add them to your watch list!</Typography>
                    <div className="media-list">
                        {matchedMedia.map(movie => (
                            <PosterCard key={`see-if-youlike-${movie.id}-${movie.title}`} {...movie} />
                        ))}

                    </div>
                </div>

                {/* Vote Button with LiveTv Icon */}
                {/* Enhanced Vote Button with LiveTv Icon */}
                <div className="vote-button-section">
                    <Button
                        variant="contained"
                        className="vote-button"
                        onClick={() => navigate('/discover')}
                    >
                        <LiveTvIcon className="vote-icon" /> {/* Larger icon with custom styling */}
                        Vote
                    </Button>
                </div>
            </div>

            <Modal open={displayGroupMembers} onClose={closeModal}>
                <div className='modal-box'>
                    <Paper className='modal-content'>

                        <IconButton sx={{ position: 'absolute', right: '5px', top: '5px' }}
                            onClick={closeModal}>
                            <Tooltip title="Close Menu">
                                <CloseIcon />
                            </Tooltip>
                        </IconButton>

                        <Typography variant="h6" sx={{ marginBottom: '1rem' }}>Members</Typography>
                        <div className='member-scroll-section'>
                            {
                                groupData.members.map((profileId) => {
                                    const profile = profiles[profileId];
                                    const goToProfile = () => navigate(`/profile/${profile.profileId}`);

                                    return (
                                        <Paper elevation={1} className='member-row' key={profileId}>
                                            <div className='member-name-combo'>
                                                <Avatar
                                                    className='member-nav profile-avatar'
                                                    alt={profile.name || "User"}
                                                    {...stringAvatarWithColor(profile.name)}
                                                    sx={{ bgcolor: stringToColor(profile.name) }}
                                                    onClick={goToProfile}
                                                />
                                                <div className='member-nav' onClick={goToProfile}>
                                                    {profile.name}
                                                </div>
                                            </div>
                                            <ConfirmButton
                                                initialText={profileId === currentProfileId ? 'Leave Group' : 'Remove'}
                                                onConfirm={() => handleDeleteMember(profileId)}
                                            />
                                        </Paper>
                                    );
                                })
                            }
                            <Typography variant="body2">Join Code: {groupData?.code || "N/A"}</Typography>
                        </div>

                    </Paper>
                </div>
            </Modal>
        </PageWrapper>
    );
};

export default GroupProfilePage;
