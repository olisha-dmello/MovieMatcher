import React, { useState, useEffect } from 'react';
import { TextField, Stack, Button } from '@mui/material';
import PageWrapper from './../PageWrapper';

const ExamplePage = () => {

    const [inputField, setInputField] = useState('');

    // state variables are weird -- they don't update right away. 
    //In general, if you do setInputFiled(a), the value of 'inputField' will not be 'a' until the current action is finished. You can get around it with useRef(), but 
    //look into that if you ever need it. 

    useEffect(() => {
        // console.log('This will print in the console (Press F12 in the browser) everytime the variable \'inputField\' is changed.')
        // console.log(`inputField new value = ${inputField}`)
    },
        [inputField])

    //On Component "Load", will only run once.
    useEffect(() => {
        // console.log('On Component Mount')
    },
        [])


    return <PageWrapper>
        <h1>Example Page</h1>

        <TextField
            key='key' //js will whine at you sometimes if it doesn't have a key defined
            primary //Style Option
            value={inputField} //from use state
            label={'MUI Text Feild'}
            type={'text'}
            placeholder={'Text'}
            onChange={(e) => { setInputField(e.target.value) }} //define headless function of form: ()=>{}. In general, the onChange, onClick events will be defined as (event) => {do action with event obj. Check console}
        />

        {
            //To have Javascript code in the HTML portion, surround it in curly braces.
        }

        {inputField
            ?
            `The current value of inputField is ${inputField}.`
            :
            'Input Field currently does not have a value.'
        }

        <h2>
            Some Text
        </h2>

        {/* Spacing... Equivalent */}
        <br></br>
        <br />

        <p>Hi I'm some paragraph text, with some JS code to display the number: {1 + 1}</p>

        {/* The above auto closes, so you don't need to say </ Input> */}

        <p>I've made the Navbar Dynamic based on screenwidth, Check <code>./PageWrapper/PageWrapper.css</code></p>
        

        <br />
        You can make horizontally stacking components really easily using MUI Stack:
        {/* Horizontally */}
        <Stack spacing={2} direction="row">
            <Button variant="text">Text</Button>
            <Button variant="contained">Contained</Button>
            <Button variant="outlined">Outlined</Button>
        </Stack>

        <br />
        <br />
        <br />

        {
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((item) => {
                return (
                    <>
                        <p>Repeating Component to Push Page Height Up.</p>
                        <br></br>
                        <br></br>
                        <br></br>
                    </>
                )
            })
        }

        <p>End of Page.</p>

    </PageWrapper>;
};

export default ExamplePage;