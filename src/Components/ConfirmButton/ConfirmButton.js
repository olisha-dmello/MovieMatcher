import React, { useState } from 'react';
import Button from '@mui/material/Button';

const ConfirmButton = ({ initialText, onConfirm }) => {
  const [confirming, setConfirming] = useState(false);

  const handleClick = () => {
    if (confirming) {
      // Perform the action on the second click
      onConfirm();
      setConfirming(false); // Reset the button to its initial state
    } else {
      // Set to confirmation state on the first click
      setConfirming(true);
    }
  };

  const handleBlur = () => {
    // Reset if the button loses focus without confirmation
    setConfirming(false);
  };

  return (
    <Button
      variant={confirming ? 'contained' : "outlined"}
      color="secondary"
      onClick={handleClick}
      onBlur={handleBlur} // Resets when the button loses focus
    >
      {confirming ? `Confirm ${initialText}` : initialText}
    </Button>
  );
};

export default ConfirmButton;
