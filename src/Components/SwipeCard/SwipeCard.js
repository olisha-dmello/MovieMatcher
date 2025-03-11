import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState, useRef, useEffect } from 'react';
import './SwipeCard.css';
import { Chip, Tooltip, IconButton } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';

export const SwipeCard = (props) => {

    // const {isDragging, setIsDragging} = props;
    const parentSetIsDragging = props.setIsDragging;
    const completeSwipe = props.completeSwipe;
    const mediaData = props.media;
    const cardIsForTV = props.mediaIsTVShow;
    const setBackgroundTint = props.setBackgroundTint;
    const resetBackgroundTint = props.resetBackgroundTint;
    const onUndo = props.onUndo;
    const undoable = props.undoable;

    const [show, setShow] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const locked = useRef(false);

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const initialMousePos = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef(null);
    const containerRef = useRef(null);

    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    const mobile = (winWidth <= 520);

    let cardWidth = Math.min(mobile ? winWidth * 0.8 : 500, winWidth - 30);
    let cardHeight = Math.min(winHeight > 700 ? (mobile ? 700 : 750) : 450, winHeight - 100);

    // // console.log('Rendering Card', mediaData, cardIsForTV);


    // ==========================================================================================================================================
    // ==========================================================================================================================================
    // ==========================================================================================================================================
    //Aux Functions

    //
    const onCompleteSwipe = (accepted) => {
        // Update the Parent
        completeSwipe(accepted, reset);
    }

    const getMouseOrTouchPosition = (event) => {

        let mouseX = event.clientX;
        let mouseY = event.clientY;

        if (event.touches) {
            mouseX = event.touches[0].clientX;
            mouseY = event.touches[0].clientY;
        }

        return { mouseX, mouseY }
    }

    const reset = () => {

        setIsDragging(false);
        locked.current = false;

        try {

            const containerWidth = containerRef.current.offsetWidth;
            const containerHeight = containerRef.current.offsetHeight;

            // console.log('Container:', containerHeight, containerWidth)

            // Resize
            cardWidth = Math.min(mobile ? winWidth * 0.8 : 500, winWidth - 30);
            cardHeight = Math.min(winHeight > 700 ? (mobile ? 700 : 750) : 450, winHeight - 100);

            setPosition({
                x: (containerWidth - cardWidth) / 2,
                y: (containerHeight - cardHeight) / 2,
            });

            resetBackgroundTint();

        } catch {
            // console.log('Unknown Width')
        }

    }

    const calculateChoiceThresholds = (centerX, containerWidth) => {
        return { rejectXPos: centerX - 0.25 * containerWidth, acceptXPos: centerX + 0.25 * containerWidth }
    }


    const openTrailer = () => {
        window.open(mediaData.trailer, '_blank');
    }



    // ==========================================================================================================================================
    // ==========================================================================================================================================
    // ==========================================================================================================================================


    const handleMouseDown = (event) => {
        if (locked.current) return;
        setIsDragging(true);

        const { mouseX, mouseY } = getMouseOrTouchPosition(event);

        initialMousePos.current = {
            x: mouseX - position.x,
            y: mouseY - position.y,
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (event) => {
        if (!isDragging) return;
        if (locked.current) return;

        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        const centerX = (containerWidth - cardWidth) / 2;
        const centerY = (containerHeight - cardHeight) / 2;

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {

            const { mouseX, mouseY } = getMouseOrTouchPosition(event);

            const x = mouseX - initialMousePos.current.x;
            const y = mouseY - initialMousePos.current.y;

            setPosition({ x, y });

            const containerWidth = containerRef.current.offsetWidth;
            const centerX = (containerWidth - cardWidth) / 2;
            const { rejectXPos, acceptXPos } = calculateChoiceThresholds(centerX, containerWidth);


            //

            // Reject Animation
            if (x < rejectXPos) {
                setBackgroundTint('reject');
            }
            else
                if (x > acceptXPos) {
                    setBackgroundTint('accept');
                } else {
                    resetBackgroundTint();
                }
        });

    };

    const handleMouseUp = (event) => {
        if (locked.current) return;

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        if (!isDragging) {
            reset();
            return;
        }

        // Stop
        setIsDragging(false);

        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);

        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        const centerX = (containerWidth - cardWidth) / 2;
        const centerY = (containerHeight - cardHeight) / 2;

        const x = position.x;
        const { rejectXPos, acceptXPos } = calculateChoiceThresholds(centerX, containerWidth);

        // Reject Animation
        if (x < rejectXPos) {

            locked.current = (true);
            setIsDragging(false);
            setPosition({
                x: -cardWidth,
                y: centerY, // Recalculate center Y
            });

            onCompleteSwipe(false);

            // Accept
        } else if (x > acceptXPos) {

            locked.current = (true);
            setIsDragging(false);
            setPosition({
                x: containerWidth,
                y: centerY,
            });

            onCompleteSwipe(true);

        } else {
            // Drop
            reset();
        }
    };

    const handleUndo = () => {

        locked.current = true;
        onUndo(reset);
    }

    // ==========================================================================================================================================
    // ==========================================================================================================================================
    // ==========================================================================================================================================



    // Center the card in the container when it first loads
    useEffect(() => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            const containerHeight = containerRef.current.offsetHeight;

            // console.log('Container:', containerHeight, containerWidth)

            setPosition({
                x: (containerWidth - cardWidth) / 2,
                y: (containerHeight - cardHeight) / 2,
            });
            setShow(true);

            window.addEventListener('resize', reset);
        }
    }, []);

    //Update the parent
    useEffect(() => {
        parentSetIsDragging(isDragging);
    }, [isDragging, parentSetIsDragging]);


    // ==========================================================================================================

    const posterpos = mediaData.poster_position ? mediaData.poster_position : 'top';
    const body2sx = { color: 'text.secondary', marginBottom: '1rem' }

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                width: '100vw', // Set container width
                height: '100vh', // Set container height
                overflow: 'show',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
        >
            {show &&
                <Card className='swipe_card_card'
                    style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        transition: isDragging ? 'none' : 'all 0.3s ease',
                        width: `${cardWidth}px`,
                        height: `${cardHeight}px`,
                    }}
                >
                    <CardMedia
                        component="img"
                        alt="movie poster"
                        className='card-poster'
                        image={mediaData.poster}
                        draggable='True'
                        sx={{ objectPosition: posterpos }}
                    />

                    {
                        undoable &&
                        <IconButton color='primary' sx={{ position: 'absolute', left: '5px', top: '5px' }} onClick={handleUndo}>
                            <Tooltip title="Undo Decision">
                                <ReplayIcon />
                            </Tooltip>
                        </IconButton>
                    }


                    <div className='card-body'>
                        {mediaData.seasons === undefined
                            ?
                            //Movie
                            <CardContent>
                                <div> Movie</div>

                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div className='title-row'>
                                        <div className='title'>
                                            {mediaData.title}
                                        </div>
                                        <div className='movie-year'>
                                            {mediaData.year}
                                        </div>
                                    </div>
                                    {mediaData.rating}
                                </div>

                                <div className='chip-row'>
                                    {mediaData.genres.map((item) => (
                                        <Chip label={item} variant="outlined" />
                                    ))}
                                </div>

                                <Typography className='short-hide bodyText' variant="body2" sx={body2sx}>
                                    {mediaData.director}, {mediaData.length} mins
                                </Typography>

                                <Typography className='bodyText' variant="body2" sx={body2sx}>
                                    {mediaData.description}
                                </Typography>

                                {mediaData.leadActors &&
                                    <Typography className='short-hide bodyText' variant="body2" sx={body2sx}>
                                        Starring: {mediaData.leadActors.join(', ')}
                                    </Typography>
                                }
                            </CardContent>
                            :
                            //Show
                            <CardContent>
                                {/* TV Show Card */}
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>TV Show</div>
                                    <div>Studio: {mediaData.studio}</div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div className='title-row'>
                                        <div className='title'>
                                            {mediaData.title}
                                        </div>
                                    </div>
                                    {mediaData.rating}
                                </div>

                                <div className='chip-row'>
                                    {mediaData.genres.map((item) => (
                                        <Chip label={item} variant="outlined" />
                                    ))}
                                </div>

                                <Typography className='bodyText' variant="body2" sx={body2sx}>
                                    {mediaData.seasons} seasons, {mediaData.year_final === 'Ongoing' ? `${mediaData.year_started}+` : `${mediaData.year_started}-${mediaData.year_final}`}
                                </Typography>

                                <Typography className='bodyText' variant="body2" sx={body2sx}>
                                    {mediaData.description}
                                </Typography>

                                <Typography className='short-hide bodyText' variant="body2" sx={body2sx}>
                                    Starring: {mediaData.lead_actors.join(', ')}
                                </Typography>
                            </CardContent>
                        }

                        <CardActions className='card-actions'>
                            <Button size="small" onClick={openTrailer}>Watch Trailer</Button>
                            <Button size="small">Learn More</Button>
                        </CardActions>
                    </div>
                </Card>
            }
        </div >);
}