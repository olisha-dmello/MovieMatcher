import React from 'react';
import PageWrapper from '../PageWrapper';
import { useUserContext } from '../../Components/UserProvider/UserProvider';
import { Typography, Slider, Select, MenuItem, Switch, FormControlLabel, Box, Paper } from '@mui/material';
import './AppSettingsPage.css';

const AppSettingsPage = () => {
    const { appSettings, updateAppSettings } = useUserContext();

    const labelSize = {
        fontSize: {
            xs: '16px', // small screens
            sm: '20px', // medium screens
        }
    }

    return (
        <PageWrapper>
            <div style={{ paddingTop: '3rem' }}>
                <Paper className="settings-container">
                    <Typography variant="h4" gutterBottom>App Settings</Typography>
                    <div className="setting">
                        <Typography variant="h6" className="setting-label" sx={labelSize}>Text Size</Typography>
                        <div className="setting-control">
                            <Slider
                                value={appSettings.textSize === "small" ? 0 : appSettings.textSize === "default" ? 1 : 2}
                                onChange={(e, newValue) => {
                                    const textSize = newValue === 0 ? "small" : newValue === 1 ? "default" : "large";
                                    updateAppSettings("textSize", textSize);
                                }}
                                step={1}
                                marks
                                min={0}
                                max={2}
                                valueLabelDisplay="auto"
                                valueLabelFormat={(value) => ["Small", "Default", "Large"][value]}
                            />
                        </div>
                    </div>

                    <div className="setting">
                        <Typography variant="h6" className="setting-label"  sx={labelSize}>Color Scheme</Typography>
                        <div className="setting-control">
                            <Select
                                value={appSettings.colorScheme}
                                onChange={(e) => updateAppSettings("colorScheme", e.target.value)}
                                fullWidth
                                className="select-small"
                            >
                                <MenuItem value="default">Default</MenuItem>
                                <MenuItem value="deuteranopia">Deuteranopia</MenuItem>
                                <MenuItem value="protanopia">Protanopia</MenuItem>
                                <MenuItem value="tritanopia">Tritanopia</MenuItem>
                            </Select>
                        </div>
                    </div>

                    <div className="setting">
                        <Typography variant="h6" className="setting-label"  sx={labelSize}>Light Mode / Dark Mode***</Typography>
                        <div className="setting-control">
                            <Switch
                                checked={appSettings.lightmode}
                                onChange={(e) => updateAppSettings("lightmode", e.target.checked)}
                            />
                        </div>
                    </div>

                    <div className="setting">
                        <Typography variant="h6" className="setting-label"  sx={labelSize}>Haptic Feedback</Typography>
                        <div className="setting-control">
                            <Switch
                                checked={appSettings.hapticFeedback}
                                onChange={(e) => updateAppSettings("hapticFeedback", e.target.checked)}
                            />
                        </div>
                    </div>

                    <div className="setting">
                        <Typography variant="h6" className="setting-label"  sx={labelSize}>Subtitles (for trailers)</Typography>
                        <div className="setting-control">
                            <Switch
                                checked={appSettings.subtitles}
                                onChange={(e) => updateAppSettings("subtitles", e.target.checked)}
                            />
                        </div>
                    </div>

                    <div className="setting">
                        <Typography variant="h6" className="setting-label"  sx={labelSize}>Language</Typography>
                        <div className="setting-control">
                            <Select
                                value={appSettings.language}
                                onChange={(e) => updateAppSettings("language", e.target.value)}
                                fullWidth
                                className="select-small"
                            >
                                <MenuItem value="English">English</MenuItem>
                                <MenuItem value="Spanish">Spanish</MenuItem>
                                <MenuItem value="French">French</MenuItem>
                                <MenuItem value="German">German</MenuItem>
                            </Select>
                        </div>
                    </div>

                    <div className="setting">
                        <Typography variant="h6" className="setting-label" sx={labelSize}>Allow Notifications</Typography>
                        <div className="setting-control">
                            <Switch
                                checked={appSettings.allowNotifications}
                                onChange={(e) => updateAppSettings("allowNotifications", e.target.checked)}
                            />
                        </div>
                    </div>
                    {/* </div> */}
                </Paper>
            </div>
        </PageWrapper>
    );
};

export default AppSettingsPage;
