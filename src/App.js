import './App.css';
import LandingPage from "./Pages/LandingPage/LandingPage";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import DiscoverPage from './Pages/DiscoverPage/DiscoverPage';
import GroupSearchPage from './Pages/GroupSearchPage/GroupSearchPage';
import GroupProfilePage from './Pages/GroupProfilePage/GroupProfilePage';
import FriendsSearchPage from './Pages/FriendsSearchPage/FriendsSearchPage';
import AppSettingsPage from './Pages/AppSettingsPage/AppSettingsPage';
import ExamplePage from "./Pages/ExamplePage/ExamplePage";
import ErrorPage from './Pages/ErrorPage/ErrorPage';
import { UserProvider } from './Components/UserProvider/UserProvider';
import { HashRouter, Routes, Route } from "react-router-dom";
import SwipePage from './Pages/SwipePage/SwipePage';

function App() {
  return (
    <UserProvider>
      <HashRouter>
        <Routes>
          {/* Define all Pages Here */}
          <Route path="/" element={<LandingPage />} />  {/* Homepage */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/:profileId" element={<ProfilePage />} />
          <Route path="discover" element={<SwipePage />} />
          <Route path="groups" element={<GroupSearchPage />} />
          <Route path="group/:groupId" element={<GroupProfilePage />} />
          <Route path="friends" element={<FriendsSearchPage />} />
          <Route path="appsettings" element={<AppSettingsPage />} />
          <Route path="example" element={<ExamplePage />} />
          <Route path="swipe" element={<SwipePage />} />

          {/* Catch-all route for undefined paths */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </HashRouter>
    </UserProvider>
  );
}

export default App;
