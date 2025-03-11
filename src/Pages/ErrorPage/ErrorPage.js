import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {

    const navigate = useNavigate();

    return (
        <>
            <h1>404 - Page not found</h1>
            <p> Sorry, the page you are looking for does not exist.</p>

            <Button primary={true} variant={'contained'} onClick={() => {navigate('/')}}>Back to Home</Button>
        </>
    );
};

export default ErrorPage;