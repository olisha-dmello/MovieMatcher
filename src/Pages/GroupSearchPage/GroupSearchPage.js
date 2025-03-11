import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../Components/UserProvider/UserProvider';
import PageWrapper from '../PageWrapper';
import { Avatar, Button, IconButton, InputAdornment, TextField, Typography, Modal, Box, Tooltip, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddIcon from '@mui/icons-material/Add';
import { keyframes } from '@mui/system';

import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';

import './GroupSearchPage.css';
import './../../Components/Modal.css'


const GroupsSearchPage = () => {
    const { groups, profiles, currentProfileId, addGroupToList, updateProfileField } = useUserContext();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isJoinModalOpen, setJoinModalOpen] = useState(false);
    const [isNotificationsModalOpen, setNotificationsModalOpen] = useState(false);
    const [notificationModalWasOpened, setNotificationModalWasOpened] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [joinGroupCode, setJoinGroupCode] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');



    const currentProfile = profiles[currentProfileId];

    const currentGroups = Object.values(groups).filter(group => group.members.includes(currentProfileId));
    const filteredGroups = currentGroups.filter(group => group.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const pendingInvites = currentProfile.invites || []; // Profile's pending group invites

    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    // Modal handlers
    const openCreateModal = () => { setFeedbackMessage(''); setCreateModalOpen(true); };
    const closeCreateModal = () => setCreateModalOpen(false);
    const openJoinModal = () => { setFeedbackMessage(''); setJoinModalOpen(true); };
    const closeJoinModal = () => setJoinModalOpen(false);
    const openNotificationsModal = () => { setNotificationsModalOpen(true); setNotificationModalWasOpened(true); }
    const closeNotificationsModal = () => setNotificationsModalOpen(false);


    useEffect(() => {
        setFeedbackMessage('')
    }, [isNotificationsModalOpen, isCreateModalOpen, isNotificationsModalOpen])

    // Handle creating a new group
    const handleCreateGroup = () => {
        if (!newGroupName.trim()) {
            setFeedbackMessage("Please enter a valid group name.");
            return;
        }
        const newGroupId = `group${Object.keys(groups).length + 1}`;
        const newGroupCode = `secret${newGroupId}`;

        const newGroup = {
            name: newGroupName,
            members: [currentProfileId],
            picture: '',
            allmovies: [],
            allshows: [],
            everyoneLiked: [],
            code: newGroupCode,
        };

        addGroupToList(newGroupId, newGroup);
        updateProfileField(currentProfileId, 'groups', [...currentProfile.groups, newGroupId]);

        setFeedbackMessage(`Group "${newGroupName}" created!`);
        setNewGroupName('');
        setCreateModalOpen(false);
    };

    // Handle joining a group by code
    const handleJoinGroup = () => {
        const group = Object.values(groups).find(g => g.code === joinGroupCode);

        if (joinGroupCode.trim() === '') {
            setFeedbackMessage('Please Enter a valid group code.')
            return;
        }

        if (!group) {
            setFeedbackMessage("Invalid group code.");
            return;
        }
        if (group.members.includes(currentProfileId)) {
            setFeedbackMessage("You are already a member of this group.");
            return;
        }

        group.members.push(currentProfileId);
        updateProfileField(currentProfileId, 'groups', [...currentProfile.groups, group.id]);
        setFeedbackMessage("Successfully joined the group!");
        setJoinGroupCode('');
    };

    // Function to handle joining a group from an invite
    const handleJoinInvite = (inviteId) => {
        const group = groups[inviteId];

        if (group) {
            // Add user to the group's members
            
            // console.log('Current Profile:', currentProfile)
            group.members.push(currentProfileId);

            // Remove the invite from the user's pending invites
            const updatedInvites = currentProfile.invites.filter(id => id !== inviteId);
            updateProfileField(currentProfileId, 'invites', updatedInvites);

            setFeedbackMessage(`Successfully joined ${group.name}!`);
        } else {
            setFeedbackMessage("This group no longer exists.");
        }
    };

    const shake = keyframes`
            0% { transform: translate(0, 0); }
            5% { transform: translate(-2px, 0); }
            10% { transform: translate(2px, 0); }
            15% { transform: translate(-2px, 0); }
            20% { transform: translate(0, 0); }
            100% { transform: translate(0, 0); }
        `;


    return (
        <PageWrapper>
            <div className='content-container'>
                <Typography variant="h4" gutterBottom>Groups</Typography>

                {/* Search bar and action buttons */}
                <div className="search-add-container">
                    <TextField
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
                    <Tooltip title="Create New Group">
                        <IconButton onClick={openCreateModal}>
                            <GroupAddIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Join a Group">
                        <IconButton onClick={openJoinModal}>
                            <AddIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Notifications">
                        <IconButton onClick={openNotificationsModal}>
                            {
                                (!notificationModalWasOpened && pendingInvites.length > 0)
                                    ? <NotificationsActiveIcon fontSize="large" sx={{
                                        color: 'primary.main', // Set the icon color to red when there are pending notifications
                                        animation: `${shake} 2s infinite`,
                                        animationDelay: '1s',
                                    }} />
                                    : <NotificationsIcon fontSize="large" sx={{
                                        color: pendingInvites.length > 0 ? 'primary.main' : 'inherit', // Use red color if there are invites
                                    }} />
                            }
                        </IconButton>
                    </Tooltip>
                </div>

                {/* Groups list */}
                <div className="groups-list">
                    {filteredGroups && filteredGroups.length > 0 ? (
                        filteredGroups.map(group => (
                            <Paper
                                key={group.name}
                                className="group-item"
                                onClick={() => navigate(`/group/${group.groupId}`)}>
                                <Avatar
                                    className="group-avatar"
                                    alt={group.name || "Group"}
                                    src={group.profile ? `/${group.profile}` : ''}
                                />
                                <Typography variant="h6" className="group-name">{group.name}</Typography>
                                <div className="group-arrow">
                                    <Tooltip title="View Group">
                                        <IconButton
                                            onClick={() => navigate(`/group/${group.groupId}`)}
                                        >
                                            <ArrowForwardIosIcon />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </Paper>
                        ))
                    ) : (
                        <Typography>No groups found</Typography>
                    )}
                </div>

                {/* Create Group Modal */}
                <Modal open={isCreateModalOpen} onClose={closeCreateModal}>
                    <div className='modal-box'>
                        <Paper className='modal-content'>

                            <IconButton sx={{ position: 'absolute', right: '5px', top: '5px' }}
                                onClick={closeCreateModal}>
                                <Tooltip title="Close Menu">
                                    <CloseIcon />
                                </Tooltip>
                            </IconButton>
                            <Typography variant="h6">Create New Group</Typography>
                            <TextField
                                label="Group Name"
                                fullWidth
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                margin="normal"
                            />
                            {feedbackMessage && <Typography color="error">{feedbackMessage}</Typography>}
                            <Button variant='contained' onClick={handleCreateGroup}>Create</Button>
                        </Paper>
                    </div>
                </Modal>

                {/* Join Group Modal */}
                <Modal open={isJoinModalOpen} onClose={closeJoinModal}>
                    <div className='modal-box'>
                        <Paper className='modal-content'>

                            <IconButton sx={{ position: 'absolute', right: '5px', top: '5px' }}
                                onClick={closeJoinModal}>
                                <Tooltip title="Close Menu">
                                    <CloseIcon />
                                </Tooltip>
                            </IconButton>

                            <Typography variant="h6">Join Group</Typography>
                            <TextField
                                label="Enter Group Code"
                                fullWidth
                                value={joinGroupCode}
                                onChange={(e) => setJoinGroupCode(e.target.value)}
                                margin="normal"
                            />
                            {feedbackMessage && <Typography color="error">{feedbackMessage}</Typography>}
                            <Button variant='contained' onClick={handleJoinGroup}>Join</Button>
                        </Paper>
                    </div>
                </Modal>

                {/* Notifications Modal */}
                <Modal open={isNotificationsModalOpen} onClose={closeNotificationsModal}>
                    <div className='modal-box'>
                        <Paper className='modal-content'>

                            <IconButton sx={{ position: 'absolute', right: '5px', top: '5px' }}
                                onClick={closeNotificationsModal}>
                                <Tooltip title="Close Menu">
                                    <CloseIcon />
                                </Tooltip>
                            </IconButton>

                            <Typography variant="h6">Group Invitations</Typography>
                            {pendingInvites.length > 0 ? (
                                pendingInvites.map(inviteId => (
                                    <Box key={inviteId} display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography>{groups[inviteId]?.name || "Unknown Group"}</Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleJoinInvite(inviteId)}
                                        >
                                            Join
                                        </Button>
                                    </Box>
                                ))
                            ) : (
                                <Typography>No pending invitations</Typography>
                            )}
                            {feedbackMessage && (
                                <Typography color="success" variant="body2" style={{ marginTop: '10px' }}>
                                    {feedbackMessage}
                                </Typography>
                            )}
                        </Paper>
                    </div>
                </Modal>
            </div>
        </PageWrapper>
    );
};

export default GroupsSearchPage;
