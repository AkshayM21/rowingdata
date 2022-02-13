import React, { useState, useEffect } from 'react'
import {Box, Drawer, Toolbar, Divider, MenuList, MenuItem, ListItemText}  from '@mui/material';

const drawerWidth = 240;
function RowerMenu(props)  {
    const[rowers, setRowers]= useState({});
    
    const idToken = props.idToken
    useEffect(() => {
        fetch(`https://python-ovgem5mydq-uk.a.run.app/rower_list?token=${idToken}`)
        .then((response) => response.json())
        .then(response => {
            setRowers(response);      
        });
    }, [])
    
    return (
        <Box sx={{ mt: 10, width: '40%'}}>
            <Drawer 
            variant="permanent"
            ModalProps={{
                keepMounted: true,
            }}
            sx={{ marginTop:"70px",
                display: { xs: 'block', sm: 'block' }, 
                '& .MuiDrawer-paper': { top: "70px", height:'90%', boxSizing: 'border-box', width: drawerWidth },
            }}
            >
                <h3>Athletes</h3>
                <Divider />
                <MenuList>
                    {Object.entries(rowers).map(([uni, name]) => (
                        <MenuItem key={uni} onClick={() =>props.onClick(uni, name)}>
                            <ListItemText primary={name}/>
                            {console.log(uni)}
                        </MenuItem>
                    ))}
                </MenuList>
                <Divider />
            </Drawer>
        </Box>
    );
}

export default RowerMenu
