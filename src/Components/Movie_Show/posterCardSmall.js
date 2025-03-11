import React from 'react';
import './posterCardSmall.css';
import { Paper } from '@mui/material';

const posterCardSmall = ({ title, poster }) => {
    return (
        <Paper className="mini-poster-card">
            <img src={poster} alt={title} className="mini-poster-card-image" />
            <div className="mini-poster-card-title">{title}</div>
        </Paper>
    );
};

export default posterCardSmall;
