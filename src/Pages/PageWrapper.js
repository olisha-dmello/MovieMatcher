import { Box } from '@mui/material';
import Navbar from '../Components/Navbar/Navbar';
import './PageWrapper.css';

const PageWrapper = ({ children }) => {

    return (
        <div className='pageWrapper'>

            {/* Include the Navbar. On Mobile Screens, This becomes fixed at the bottom of the screen. */}
            <div className='header'>
                <Navbar />
            </div>

            {/* Display Things Underneath */}
            <Box className='pageContent' sx={{backgroundColor: 'background'}}>
                {children}
            </Box>

        </div>
    );
};

export default PageWrapper;