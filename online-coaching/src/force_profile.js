import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';

function ForceDialog(props) {
    const { onBackdropClick, open } = props;

    // Calls onClose- sets open to false
    return(
        // onClose is built into Dialog such that clicking outside calls handleClose, which calls onBackdropClick prop
        <Dialog onBackdropClick={onBackdropClick} open={open} >
            <DialogTitle>Advanced</DialogTitle>
            {/*import and display image*/}
        </Dialog>
    ); 
}

ForceDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default function ForceProfile(props) {

    const [open, setOpen] = useState(false);

    /*useEffect(() => {
        fetch(`forceprofile?workout_id=${props.workout_id}`)
        .then()
    })*/

    // handleOpen called when button is clicked
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <br />
            <Button variant="outlined" onClick={handleOpen}>
                Force Profile
            </Button>
            <ForceDialog
                open={open}
                onBackdropClick={handleClose}
            />
        </div>
    );
}
