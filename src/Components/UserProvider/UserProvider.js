import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { groupData } from './groupData';
import { profileData } from './profileData';
import { movieData } from '../Movie_Show/movieData';
import { showData } from '../Movie_Show/showData';
import { ThemeProvider } from '@mui/material/styles';
import { themes } from './../../Themes/themes';
import CssBaseline from "@mui/material/CssBaseline";

//
//  What this will do is be the 'BRAIN' of our app.
// Since we don't need to have a real backend, we're going to fake it using this
// context provider.
//
// Components within the Context (which in this case any inside a page, so any for us) can use the functions from this context
// meaning that we can save state between pages.
//
// These wont save between sessions, but that's not expected or required of us.
//

// Create the context
const UserContext = createContext();

// Create the provider component
export function UserProvider({ children }) {

    //Profile State
    const [currentProfileId, setCurrentProfile] = useState(1);
    const [currentGroupIdSwipingFor, setSwipingGroup] = useState(null);

    // Groups State
    const [groups, setUserGroups] = useState(groupData);

    // Profiles State
    const [profiles, setUserProfiles] = useState(profileData);

    // Movies
    const [movies] = useState(movieData);

    // TV Shows
    const [shows] = useState(showData);

    // App Settings State
    const [appSettings, setAppSettings] = useState({
        textSize: "default",
        colorScheme: "default",
        lightmode: true,
        hapticFeedback: true,
        subtitles: true,
        language: "English",
        allowNotifications: true
    });

    /*  ----------------------------- Profile Functions ----------------------------- */

    //login and set current profile
    const login = (profileId) => {
        setCurrentProfile(profileId);
    };

    // logout and remove current profile
    const logout = () => {
        setCurrentProfile(null);
    };

    /* ----------------------------- App Settings Functions ----------------------------- */

    // update app settings record
    const updateAppSettings = (settingName, value) => {
        setAppSettings((prevSettings) => ({
            ...prevSettings,
            [settingName]: value,
        }));
        // console.log(appSettings)
    };

    /* ----------------------------- Group Functions ----------------------------- */

    // add new group to list of groups
    const addNewGroup = (newGroupId, newGroupData) => {
        setUserGroups((oldGroupData) => ({
            ...oldGroupData,
            [newGroupId]: newGroupData
        }));
    };

    // remove member from group
    const removeMember = (groupId, memberId) => {
        setUserGroups((prevGroups) => {
            const updatedGroup = {
                ...prevGroups[groupId],
                members: prevGroups[groupId].members.filter(id => id !== memberId),
            };
            return { ...prevGroups, [groupId]: updatedGroup };
        });
    };


    /* ----------------------------- Profile Functions ----------------------------- */

    // add new profile to list of profiles
    const addNewProfile = (newProfileId, newProfileData) => {
        setUserProfiles((oldProfiles) => ({
            ...oldProfiles,
            [newProfileId]: newProfileData
        }));
    };

    // Update a field in a profile
    const updateProfileField = (profileId, field, value) => {
        setUserProfiles((prevProfiles) => {
            // Check if profileId exists
            if (!prevProfiles[profileId]) {
                console.error(`Profile ID ${profileId} not found.`);
                return prevProfiles;
            }

            // Check if the field exists in the profile
            if (!(field in prevProfiles[profileId])) {
                console.error(`Field "${field}" not found in profile ID ${profileId}.`);
                return prevProfiles;
            }

            // Update the field if both profileId and field are valid
            return {
                ...prevProfiles,
                [profileId]: {
                    ...prevProfiles[profileId],
                    [field]: value,
                },
            };
        });
    };


    /* ----------------------------- Use Effect ----------------------------- */

    useEffect(() => {
        // Initialize or fetch data if needed
        // console.log('App started, can fetch data now');

    }, []);

    /* ----------------------------- eturn ----------------------------- */
    

    // Switch Theme
    const muiTheme = useMemo(() => {
        if (appSettings.lightmode) {
            if (appSettings.colorScheme === '') {}
            return themes.light;
        }
        return themes.dark;

    }, [appSettings]);

    return (

        <UserContext.Provider value={
            {
                // Place the variables you want to pass on to anything lower on in the app here.
                // To access the variable 'user',  you will use     const {user} = useAppContext();

                currentProfileId,
                login,
                logout,

                appSettings,
                updateAppSettings,

                groups,
                addGroupToList: addNewGroup,
                removeMember,

                profiles,
                addProfileToList: addNewProfile,
                updateProfileField,

                movies,
                shows,
                
                currentGroupIdSwipingFor,
                setSwipingGroup,

            }}>
            <ThemeProvider theme={muiTheme}>
            <CssBaseline />
                {children}
            </ThemeProvider>
        </UserContext.Provider>
    );
}

// Custom hook for using the context
export const useUserContext = () => useContext(UserContext);
