import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../Components/UserProvider/UserProvider';
import PageWrapper from '../PageWrapper';
import { Avatar, Button, IconButton, InputAdornment, TextField, Typography, Modal, Box, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Tooltip from '@mui/material/Tooltip';
import './FriendsSearchPage.css';
import './../../Components/Modal.css'
import CloseIcon from '@mui/icons-material/Close';

const FriendsSearchPage = () => {
    const { profiles, currentProfileId, updateProfileField } = useUserContext();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [newFriendUsername, setNewFriendUsername] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');

    // Get current profile's friends
    const currentProfile = profiles[currentProfileId];
    const friends = currentProfile?.friends.map(friendId => profiles[friendId]);

    // Filter friends based on search term
    const filteredFriends = friends?.filter(friend =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Modal handlers
    const handleOpenModal = () => {
        setFeedbackMessage(''); // Reset feedback message each time modal opens
        setModalOpen(true);
    };
    const handleCloseModal = () => setModalOpen(false);

    // Handle adding a new friend
    const handleAddFriend = () => {

        // console.log('Attemtping to add', newFriendUsername)

        const friendProfile = Object.values(profiles).find(
            (profile) => profile.name.toLowerCase() === newFriendUsername.toLowerCase()
        );

        if (newFriendUsername.trim() === '') {
            // No Name Entered
            setFeedbackMessage("Please enter a username.");

        } else if (!friendProfile) {
            //No User Exists
            setFeedbackMessage("A user does not exist with that username. (Try adding 'Alex')");

        } else if (currentProfile.friends.includes(friendProfile.profileId)) {
            // Already a friend
            setFeedbackMessage("User is already added as a friend.");

        } else if (currentProfile.profileId === friendProfile.profileId) {
            setFeedbackMessage("You can't add yourself as a friend.");

        } else {
            // Add friend
            const updatedFriends = [...currentProfile.friends, friendProfile.profileId];
            updateProfileField(currentProfileId, 'friends', updatedFriends);
            setFeedbackMessage("Friend added.");
        }

        // Clear input field
        setNewFriendUsername('');
    };

    const labelSize = {
        fontSize: {
            xs: '16px', // small screens
            sm: '20px', // medium screens
        }
    }

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
            <div className='content-container'>
                <Typography variant="h4" gutterBottom>Friends</Typography>

                {/* Search bar and Add Friend button */}
                <div className="search-add-container">
                    <TextField
                        className='search-box'
                        variant="outlined"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        fullWidth
                    />
                    <Tooltip title="Add Friend">
                        <IconButton onClick={handleOpenModal}>
                            <AddIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                </div>

                {/* Friends list */}
                <div className="friends-list">
                    {filteredFriends && filteredFriends.length > 0 ? (
                        filteredFriends.map(friend => (

                            <Paper
                                key={friend.profileId}
                                className="friend-item"
                                onClick={() => navigate(`/profile/${friend.profileId}`)}
                            >
                                <Avatar
                                    className="friend-avatar"
                                    alt={friend.name || "User"}
                                    {...stringAvatar(friend.name || "User")}
                                />
                                <Typography variant="h6" className="friend-name" sx={labelSize}>{friend.name}</Typography>
                                <div className="friend-arrow" >
                                    <IconButton
                                        onClick={() => navigate(`/profile/${friend.profileId}`)}
                                    >
                                        <Tooltip title="View Profile">
                                            <ArrowForwardIosIcon />
                                        </Tooltip>
                                    </IconButton>
                                </div>
                            </Paper>

                        ))
                    ) : (
                        <Typography>No friends found</Typography>
                    )}
                </div>

                {/* Add Friend Modal */}
                <Modal open={isModalOpen} onClose={handleCloseModal}>
                    <div className='modal-box'>
                        <Paper className='modal-content'>

                            <IconButton sx={{ position: 'absolute', right: '5px', top: '5px' }}
                                onClick={handleCloseModal}>
                                <Tooltip title="Close Menu">
                                    <CloseIcon />
                                </Tooltip>
                            </IconButton>

                            <Typography variant="h6">Add Friend</Typography>
                            <TextField
                                label="Enter Username"
                                fullWidth
                                value={newFriendUsername}
                                onChange={(e) => setNewFriendUsername(e.target.value)}
                                margin="normal"
                            />
                            {feedbackMessage && (
                                <Typography color="error" variant="body2" style={{ marginTop: '10px' }}>
                                    {feedbackMessage}
                                </Typography>
                            )}
                            <Button variant="contained" color="primary" onClick={handleAddFriend} fullWidth style={{ marginTop: '20px' }}>
                                Add
                            </Button>
                        </Paper>
                    </div>
                </Modal>
            </div>
        </PageWrapper >
    );
};

export default FriendsSearchPage;
