import React, { useState, useEffect } from 'react'
import {DialogTitle, Dialog, Button, Typography} from '@mui/material';
import PropTypes from 'prop-types';
import { Base64 } from 'js-base64';

function ForceDialog(props) {
    const { onBackdropClick, open } = props;
    //const [image, setImage] = useState();

    /*const decodeBase64 = (base64data) => {
        let base64ToString = Buffer.from(base64data, "base64").toString()
        setImage(base64ToString)
    }
    /*useEffect(() => {
        setImage(JSON.stringify(Base64.atob(props.img)));
    })*/
    //image=decodeBase64(`${props.img}`);
    // Calls onClose- sets open to false
    
    return(
        // onClose is built into Dialog such that clicking outside calls handleClose, which calls onBackdropClick prop
        <Dialog onBackdropClick={onBackdropClick} open={open} >
            <img src={`data:image/png;base64,${props.img}`}/>
            <Typography sx= {{fontWeight: 'bold', mt: '5%'}} align={'center'}>
                IMSE: {props.imse}
            </Typography>
            <img src={`data:image/png;base64,${props.variance}`}/>
        </Dialog>
    ); 
}

ForceDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default function ForceProfile(props) {

    const [open, setOpen] = useState(false);

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
                img={props.img}
                variance={props.variance}
                imse={props.imse}
            />
        </div>
    );
}
