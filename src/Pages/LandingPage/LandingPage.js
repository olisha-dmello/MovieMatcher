import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../Components/UserProvider/UserProvider';
import { TextField, Button, Typography } from '@mui/material';
import './LandingPage.css';

const LandingPage = () => {
    const { login, updateProfileField } = useUserContext();
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true); 
    const [username, setUsername] = useState("");  // State to capture the username

    const toggleLoginMode = () => {
        setIsLogin((flag) => !flag);
    };

    const handleLogin = () => {
        const profileId = 1;
        login(profileId);

        const displayName = username || "User";

        updateProfileField(profileId, 'name', displayName);

        navigate('/profile');
    };

    return (
        <div className="login-container">
            <div className='left-title'>
                <div className="title-text">MOVIE</div>
                <div className="title-text mobile">MATCHER</div>
            </div>
            <div className="login-form">
                <Typography variant="h4" gutterBottom>
                    {isLogin ? "Login" : "Sign Up"}
                </Typography>

                {isLogin ? (
                    <div>
                        <TextField 
                            label="Username" 
                            fullWidth 
                            margin="normal" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}  // Update username state
                        />
                        <TextField label="Password" type="password" fullWidth margin="normal" />
                        <Button variant="contained" fullWidth onClick={handleLogin}>
                            Login
                        </Button>
                    </div>
                ) : (
                    <div>
                        <TextField 
                            label="Username" 
                            fullWidth 
                            margin="normal" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}  // Update username state
                        />
                        <TextField label="Email" fullWidth margin="normal" />
                        <TextField label="Password" type="password" fullWidth margin="normal" />
                        <TextField label="Confirm Password" type="password" fullWidth margin="normal" />
                        <Button variant="contained" fullWidth onClick={handleLogin}>
                            Sign Up
                        </Button>
                    </div>
                )}

                <Button onClick={toggleLoginMode} style={{ marginTop: "20px" }}>
                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                </Button>
            </div>
            <div className="title-text end">MATCHER</div>
        </div>
    );
};

export default LandingPage;
