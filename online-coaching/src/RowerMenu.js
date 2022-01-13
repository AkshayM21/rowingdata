import React from 'react'
import {Box, Drawer, Toolbar, Divider, MenuList, MenuItem, ListItemText}  from '@mui/material';

const drawerWidth = 240;
export class RowerMenu extends React.Component {
    constructor(props) {
        super(props);
        // JSON of rower names, format {'jl6078': 'Jonathan Liu', 'uni2':'Name2'}
        this.state={rowers: {'jl6078': 'Jonathan Liu', 'uni2':'Name2'}};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (e) => {
        const uni= e.target.value;
        this.props.onClick(uni, this.state.rowers[uni]);
    }

    render() {      
        return (
            <Box sx={{ mt: 10, width: '40%'}}>
                <Drawer
                variant="permanent"
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', sm: 'block' }, 
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                >
                    <Toolbar />
                    <Divider />
                    <MenuList>
                        {Object.entries(this.state.rowers).map(([uni, name]) => (
                            <MenuItem value={uni} >
                                <ListItemText primary={name} value={uni} onClick={this.handleChange}/>
                            </MenuItem>
                        ))}
                    </MenuList>
                    <Divider />
                </Drawer>
            </Box>
        );
    }
}