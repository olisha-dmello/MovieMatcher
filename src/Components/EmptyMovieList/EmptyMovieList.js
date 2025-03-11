import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const EmptyMovieList = styled(Paper)(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'light' ? '#DFDFDFFF' : '#424242', // Darker grey for both modes
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    variant: 'outlined',
}));

export default EmptyMovieList;