import { profileData } from './profileData';

export const groupData = {
    1: {
        groupId: 1,
        name: 'Blockbuster Buddies',
        members: [1, 2, 3],
        picture: '',
        allmovies: [],
        allshows: [],
        everyoneLikedMovies: [1,2,3,4,5],
        everyoneLikedShows: [1,2,3,4,5],
        code: "secret1",
        profile: 'group1.png'
    },
    2: {
        groupId: 2,
        name: 'Reel Mates',
        members: [4, 5, 6],
        picture: '',
        allmovies: [],
        allshows: [],
        everyoneLikedMovies: [6,7,8,9,10],
        everyoneLikedShows: [6,7,8,9,10],
        code: "secret2",
        profile: 'group2.png'
    },
    3: {
        groupId: 3,
        name: 'Flick Clique',
        members: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        picture: '',
        allmovies: [],
        allshows: [],
        everyoneLikedMovies: [11,12,13,14,15],
        everyoneLikedShows: [11,12,13,14,15],
        code: "secret3",
    },
    4: {
        groupId: 4,
        name: 'Popcorn Partners',
        members: [10, 11, 12],
        picture: '',
        allmovies: [],
        allshows: [],
        
        everyoneLikedMovies: [16,17,18,19,1],
        everyoneLikedShows: [16,17,18,19,1],
        code: "secret4",
        profile: 'group3.png'
    },
    5: {
        groupId: 5,
        name: 'Couch Cinema',
        members: [1, 3, 5],
        picture: '',
        allmovies: [],
        allshows: [],
        everyoneLikedMovies: [3,7,9,11,13,15],
        everyoneLikedShows: [3,7,9,11,13,15],
        code: "secret5"
    },
};

// Function to populate allmovies and allshows based on members' liked movies and shows
function populateGroupMoviesAndShows(groupData, profileData) {
    Object.keys(groupData).forEach(groupKey => {
        const group = groupData[groupKey];
        
        // Collect movies and shows liked by each member of the group
        const moviesSet = new Set();
        const showsSet = new Set();

        group.members.forEach(memberId => {
            const profile = profileData[memberId];
            if (profile) {
                profile.likedMovies.forEach(movieId => moviesSet.add(movieId));
                profile.likedTVShows.forEach(showId => showsSet.add(showId));
            }
        });

        // Convert Set to Array to store in group data
        group.allmovies = Array.from(moviesSet);
        group.allshows = Array.from(showsSet);
    });
}

// Populate groupData with allmovies and allshows
populateGroupMoviesAndShows(groupData, profileData);
