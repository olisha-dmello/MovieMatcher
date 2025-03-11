import { useState, useRef, useEffect } from 'react';
import PageWrapper from './../PageWrapper';
import { SwipeCard } from '../../Components/SwipeCard/SwipeCard';
import './../PageWrapper.css';
import './SwipePage.css';
import { useUserContext } from '../../Components/UserProvider/UserProvider';
import Navbar from './../../Components/Navbar/Navbar';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Paper, Typography, Button, Avatar, Modal, IconButton, Tooltip, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const SwipePage = () => {

    const navigate = useNavigate();

    const { movies, shows, appSettings, currentGroupIdSwipingFor, setSwipingGroup, groups, currentProfileId, profiles } = useUserContext();
    const [isDragging, setIsDragging] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const [swiping, setSwiping] = useState(false);
    const [groupModalOpen, setGroupSelectorOpen] = useState(false);
    const openGroupSelectorModal = () => setGroupSelectorOpen(true);
    const closeGroupSelectorModal = () => setGroupSelectorOpen(false);


    const [message, setMessage] = useState('');
    const hintMessage = useRef(null);
    const loadingNextMovie = useRef(false);

    const [undoable, setUndoable] = useState(false);


    const mediaIndexLookingAt = useRef(0);

    const group = groups[currentGroupIdSwipingFor];

    const currentGroups = Object.values(groups).filter(group => group.members.includes(currentProfileId));
    // const currentGroups = []

    const selectAsGroupSwiping = (groupData) => {
        setSwipingGroup(groupData.groupId);
        closeGroupSelectorModal();
    }

    function combineRandomly(list1, list2) {
        // Concatenate the two lists into one array
        const combinedList = [...list1, ...list2];

        // Shuffle the combined array using Fisher-Yates shuffle
        for (let i = combinedList.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [combinedList[i], combinedList[j]] = [combinedList[j], combinedList[i]];
        }

        return combinedList;
    }

    //Default to movie
    const [displayOrder, setDisplayOrder] = useState([]);
    const [currentMedia, setCurrentMedia] = useState({});

    const addMediaToUserLikes = () => {
        // console.log('Accepted!')
        // console.log(profiles[currentProfileId])

        if (currentMedia.seasons) {
            if (!profiles[currentProfileId].likedTVShows.includes(currentMedia.id))
                profiles[currentProfileId].likedTVShows.push(currentMedia.id);
        } else {
            if (!profiles[currentProfileId].likedMovies.includes(currentMedia.id))
                profiles[currentProfileId].likedMovies.push(currentMedia.id);
        }
    }

    const addMediaToUserGroupLikes = () => {

        if (currentMedia.seasons) {

            // Ensure Path Exists
            if (profiles[currentProfileId].likesPerGroup.shows[currentGroupIdSwipingFor] === undefined)
                profiles[currentProfileId].likesPerGroup.shows[currentGroupIdSwipingFor] = [];

            // Add to Path
            if (!profiles[currentProfileId].likesPerGroup.shows[currentGroupIdSwipingFor].includes(currentMedia.id))
                profiles[currentProfileId].likesPerGroup.shows[currentGroupIdSwipingFor].push(currentMedia.id)

        } else {
            // Ensure Path Exists
            if (profiles[currentProfileId].likesPerGroup.movies[currentGroupIdSwipingFor] === undefined)
                profiles[currentProfileId].likesPerGroup.movies[currentGroupIdSwipingFor] = [];

            // Add to Path
            if (!profiles[currentProfileId].likesPerGroup.movies[currentGroupIdSwipingFor].includes(currentMedia.id))
                profiles[currentProfileId].likesPerGroup.movies[currentGroupIdSwipingFor].push(currentMedia.id)
        }

    }


    const completeSwipe = async (accepted, reset) => {

        loadingNextMovie.current = true;
        if (hintMessage.current) {
            clearTimeout(hintMessage.current);
            hintMessage.current = null;
        }
        setMessage('');

        // Accept or Reject the Movie Show
        // console.log(profiles[currentProfileId])
        if (accepted) {
            addMediaToUserLikes()
            addMediaToUserGroupLikes()
        }
        // console.log('Updated Profile Data:', profiles[currentProfileId]);

        setUndoable(true);

        setTimeout(() => {

            //Switch Next
            mediaIndexLookingAt.current = (mediaIndexLookingAt.current + 1) % displayOrder.length;

            // console.log(displayOrder[mediaIndexLookingAt.current].seasons, 'seasons')

            // Set Current Media as the next in the list
            setCurrentMedia(displayOrder[mediaIndexLookingAt.current]);

            reset();
            loadingNextMovie.current = false;
        }, 1000);
    };

    const resetBackgroundTint = () => {
        setBackgroundColor(appSettings.lightmode ? 'white' : 'black');
    };

    const setBackgroundTintState = (state) => {
        if (state === 'accept') {
            setBackgroundColor(appSettings.lightmode ? '#afa' : '#030');
        } else if (state === 'reject') {
            setBackgroundColor(appSettings.lightmode ? '#faa' : '#300');
        } else {
            resetBackgroundTint();
        }
    };

    const [backgroundColor, setBackgroundColor] = useState('black');

    useEffect(() => {

        //Set to Base
        resetBackgroundTint()

        // Start Swiping Right Away
        setSwiping(currentGroupIdSwipingFor != null);

        // Define the show order here... constant but oh well
        const _displayOrder = combineRandomly(movies, shows);
        setDisplayOrder(_displayOrder);
        setCurrentMedia(_displayOrder[0])

    }, [])

    //When Swiping Starts, Start the timer message.
    useEffect(() => {
        if (swiping)
            hintMessage.current = setTimeout(() => setMessage('Swipe the Card Left or Right to Accept or Reject the movie!'), 7000)
    }, [swiping])

    const validateGroupSelection = () => {


        // Fail Case
        if (currentGroupIdSwipingFor === null) {
            setErrorMessage('You need to select a group!')
            return
        }

        setErrorMessage('')
        setSwiping(true);

    }

    const onUndo = (reset) => {
        // navigate('/')
        setUndoable(false);

        //Switch Next
        const newIndex = (mediaIndexLookingAt.current - 1) % displayOrder.length;;
        mediaIndexLookingAt.current = newIndex;
        setCurrentMedia(displayOrder[mediaIndexLookingAt.current]);

        const undidData = displayOrder[mediaIndexLookingAt.current];

        const delete_from_array = (array, item) => {
            const index = array.indexOf(item);
            if (index > -1) { // only splice array when item is found
                array.splice(index, 1); // 2nd parameter means remove one item only
                // console.log('Found and Deleted.')
            } else {
                // console.log(`Did not find value ${item} in $`)
            }
        }

        // Delete from Likes
        if (currentMedia.seasons) {
            if (profiles[currentProfileId].likedTVShows.includes(undidData.id))
                delete_from_array(profiles[currentProfileId].likedTVShows, undidData.id);
        } else {
            if (profiles[currentProfileId].likedMovies.includes(undidData.id))
                delete_from_array(profiles[currentProfileId].likedMovies ,undidData.id);
        }

        reset();

        // Delete from Group Likes
        if (displayOrder[mediaIndexLookingAt.current].seasons) {

            // Ensure Path Exists
            if (profiles[currentProfileId].likesPerGroup.shows[currentGroupIdSwipingFor] === undefined)
                return;

            // Add to Path
            if (profiles[currentProfileId].likesPerGroup.shows[currentGroupIdSwipingFor].includes(undidData.id))
                delete_from_array(profiles[currentProfileId].likesPerGroup.shows[currentGroupIdSwipingFor], undidData.id)

        } else {
            // Ensure Path Exists
            if (profiles[currentProfileId].likesPerGroup.movies[currentGroupIdSwipingFor] === undefined)
                return;

            // Add to Path
            if (!profiles[currentProfileId].likesPerGroup.movies[currentGroupIdSwipingFor].includes(undidData.id))
                delete_from_array(profiles[currentProfileId].likesPerGroup.movies[currentGroupIdSwipingFor], undidData.id);
        }
    }


    return (
        <div className='pageWrapper'>
            <div className='header'>
                <Navbar />
            </div>

            <div className='swipe_area_bkg_container'>
                <div className={'swipe_area_flat_bkg'} style={{ backgroundColor }}></div>

                <div
                    className='swipe_area_bkg'
                    style={
                        {
                            backgroundImage: `url(${currentMedia.poster})`,
                            backgroundSize: 'cover',
                            transform: 'scale(1.2)',
                            opacity: loadingNextMovie.current ? 0 : '70%',
                        }}
                ></div>

                {swiping &&
                    <div className={`swipe_bkg_icons ${isDragging ? 'swipe_bkg_icons_active' : ''}`}>
                        <CloseIcon className='swipe-icon' fontSize='1rem' />
                        <CheckIcon className='swipe-icon' fontSize='1rem' />
                    </div>
                }
            </div>

            {
                swiping
                    ?
                    <div className='swipe_area'>

                        <SwipeCard
                            isDragging={isDragging}
                            setIsDragging={setIsDragging}
                            completeSwipe={completeSwipe}
                            media={currentMedia}
                            // mediaIsTVShow={mediaAsTVShow}
                            onUndo={onUndo}
                            undoable={undoable}
                            setBackgroundTint={setBackgroundTintState}
                            resetBackgroundTint={resetBackgroundTint}
                        />

                        <div className={'swipe_area_message'}>
                            <Paper className={`swipe_area_paper ${message === '' ? '' : 'active'}`}>
                                {
                                    message
                                }
                            </Paper>
                        </div>

                        <Tooltip title="Click to change group" arrow>
                            <div
                                className='group-selector-in-swipe'
                                onClick={openGroupSelectorModal}
                                style={{ display: 'flex', alignItems: 'center' }} // Add flex styles
                            >
                                <Avatar
                                    className="group-avatar"
                                    alt={group.name || "Group"}
                                    src={group.profile ? `/${group.profile}` : ''}
                                />
                                <Typography style={{ marginLeft: '10px' }}> {/* Add margin for spacing */}
                                    {group.name}
                                </Typography>
                            </div>
                        </Tooltip>
                    </div>

                    :

                    <div className='group-swipe-selector-subpage'>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, marginTop: '5vh' }}>
                            <Typography variant="h5">
                                Choose Group To Swipe For
                            </Typography>

                            <Paper
                                className='group-swipe-choose'
                                onClick={openGroupSelectorModal}
                            >
                                <Box>
                                    {currentGroupIdSwipingFor
                                        ?
                                        <div className='group-swipe-item'>
                                            <Avatar
                                                className="group-avatar"
                                                alt={group.name || "Group"}
                                                src={group.profile ? `/${group.profile}` : ''}
                                            />
                                            {group.name}
                                        </div>
                                        :
                                        <div className='group-swipe-item'>
                                            <Avatar
                                                className="group-avatar"
                                                alt={"Unset Group"}
                                            >
                                                ?
                                            </Avatar>
                                            {'Unknown'}
                                        </div>
                                    }
                                </Box>
                            </Paper>

                            {errorMessage &&
                                <Typography variant="body" color='error'>
                                    {errorMessage}
                                </Typography>
                            }
                            <Button variant='contained' onClick={validateGroupSelection}>Start Swiping</Button>
                        </Box>
                    </div>
            }

            <Modal open={groupModalOpen} onClose={closeGroupSelectorModal}>
                <div className='modal-box'>
                    <Paper className='modal-content'>
                        <IconButton sx={{ position: 'absolute', right: '5px', top: '5px' }} onClick={closeGroupSelectorModal}>
                            <Tooltip title="Close Menu">
                                <CloseIcon />
                            </Tooltip>
                        </IconButton>

                        <Typography variant="h6">Select Group</Typography>

                        {currentGroups.length > 0
                            ?
                            currentGroups.map(group => (
                                <Paper
                                    elevation={2}
                                    className='member-row'
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => selectAsGroupSwiping(group)}
                                >
                                    <div className='member-name-combo'>
                                        <Avatar
                                            className="group-avatar"
                                            alt={group.name || "Group"}
                                            src={group.profile ? `/${group.profile}` : ''}
                                        />
                                        {group.name}
                                    </div>
                                </ Paper>
                            ))
                            :
                            <div>
                                You are not part of any groups!
                                <br />
                                <Button onClick={() => navigate('/groups')}>
                                    Create Group
                                </Button>
                            </div>
                        }

                    </Paper>
                </div>
            </Modal>
        </div >
    );
};

export default SwipePage;
