import React, { useState } from 'react'
import {Box, Drawer, Tab, Card, CardContent, Typography, Grid, Toolbar, Divider, MenuList, MenuItem, ListItemText}  from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
//import CardActions from '@mui/material/CardActions';

const drawerWidth = 240;
// RowerMenu passes uni up to Page
class RowerMenu extends React.Component {
    constructor(props) {
        super(props);
        // JSON of rower names, format {'jl6078': 'Jonathan Liu', 'uni2':'Name2'}
        this.state={rowers={}};
    }

    handleChange(e) {
        uni=e.target.value;
        this.props.onChange(uni, this.state.rowers[uni]);
    }

    render() {      
        return (
            <Box>
                <Drawer
                variant="permanent"
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                >
                    <Toolbar />
                    <Divider />
                    <MenuList>
                        {Object.entries(this.state.rowers).map(([uni, name]) => (
                            <MenuItem value={uni} onClick={() => { this.handleChange }}>
                                <ListItemText primary={name} />
                            </MenuItem>
                        ))}
                    </MenuList>
                    <Divider />
                </Drawer>
            </Box>
        );
    }
}

function Card(props){
    // Workout json passed down from deck
    return(        
        <Card style={{ width: '16rem' }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary">
                    {this.props.workout['date']}
                </Typography>
                <Typography>
                    Workout:{this.props.workout['workout_description']}
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                    RPE:{this.props.workout['rpe']}
                </Typography>
            </CardContent>
            {/*<CardActions>
                <Button size="small">Force Profile</Button>
            </CardActions>*/}
        </Card>    
    )
}

function Deck(props) {
    // Need GET method for workouts json:{workouts:[{row1}, {row2}, etc], use props.uni to call
    // Pass workouts array of json objects to workouts state
    const[workouts, setWorkouts]= useState([]);
    
    return(
        <Box>
            <Grid container spacing={{ xs: 2, sm: 3 }} >
                {Object.values(workouts).map((obj, index) => (
                // Currently set for 2 cards per column in xs, 4 per column for sm
                <Grid item xs={6} sm={3} key={index}>
                    <Card workout={obj}/>
                </Grid>))}
            </Grid>              
        </Box>
    );   
}

function Workouts(props) {
    return(
        <Deck uni={this.props.uni} />
    )  
}


function SorS(props) {
    const[results, setResults] = useState([]);  
    // Results is array of JSON objects
    // Need GET method for json, use props.uni to call   
    return (
        /*{results.map((row,i) => (
            <tr key={i}>
                {Object.values(row).map((cell) => (
                    <td>{cell}</td>
                ))}
            </tr>
        ))}*/
    );
}


function Tabs(props) {
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList value={value} onChange={handleChange}>
                        <Tab label="Workouts" value="1"/>
                        <Tab label="SorS" value="2"/>
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <Workouts uni={this.props.uni} />
                </TabPanel>
                <TabPanel value="2">
                    <SorS uni={this.props.uni}/>
                </TabPanel>
            </TabContext>            
        </Box>  
    );        

}

export default function Page(props) {
    const[uni, setUni] = useState('');
    const[name, setName] = useState('');

    const handleChange= (newUni, newName) => {
        setUni(newUni);
        setName(newName);
    }

    return(
        <div>
            <RowerMenu onChange={handleChange} />
            <h1>{name}</h1>
            <Tabs uni={uni} />
        </div>
    )
}
