import React, {useState} from "react";
import Dialog from '@mui/material/Dialog'
import {DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Settings from './Settings';

function SettingsDialog(props) {
    const { onBackdropClick, open } = props;

    // Calls onClose- sets open to false
    return(
        // onClose is built into Dialog such that clicking outside calls handleClose, which calls onBackdropClick prop
        <Dialog onBackdropClick={onBackdropClick} open={open} >
            <DialogTitle>Settings</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{marginBottom: "10px"}}>
                    Please fill in Functional Threshold Power and Heart Rate Zones from Training Peaks. For heart rate input the end of each zone (for 0 to 120 bpm, please input 120bpm).
                </DialogContentText>
                <Settings/>
            </DialogContent>
        </Dialog>
    ); 
}

SettingsDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default function Zones() {

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
            <Button sx={{marginRight: "20px", marginBottom: "10px"}} variant="outlined" onClick={handleOpen}>
                Settings
            </Button>
            <SettingsDialog
                open={open}
                onBackdropClick={handleClose}
            />
        </div>
    );
}
