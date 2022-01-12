import React, { useState , useEffect, useContext} from 'react'
import { Navigate } from "react-router-dom";
import { UserContext } from "./providers/UserProvider"
import {Box, Drawer, Tab, Card, CardContent, Typography, Grid, Toolbar, Divider, MenuList, MenuItem, ListItemText}  from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
//import CardActions from '@mui/material/CardActions';

const drawerWidth = 240;
// RowerMenu passes uni up to Page
class RowerMenu extends React.Component {
    constructor(props) {
        super(props);
        // JSON of rower names, format {'jl6078': 'Jonathan Liu', 'uni2':'Name2'}
        this.state={rowers: {'jl6078': 'Jonathan Liu', 'uni2':'Name2'}};
    }

    handleChange(e) {
        const uni=e.target.value;
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
                            <MenuItem value={uni} onClick={() => (this.handleChange)}>
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

function RowerCard(props){
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

function Workouts(props) {
    // Need GET method for workouts json:{workouts:[{row1}, {row2}, etc], use props.uni to call
    // Pass workouts array of json objects to workouts state
    const[workouts, setWorkouts]= useState([{'date': '01/15/21', 'rpe': '10', 'workout_description':'3x19'}, {'date': '01/18/21', 'rpe': '15', 'workout_description':'3x19'}]);
    
    return(
        <Box>
            <Grid container spacing={{ xs: 2, sm: 3 }} >
                {workouts.map((obj, index) => (
                // Currently set for 2 cards per column in xs, 4 per column for sm
                <Grid item xs={6} sm={3} key={index}>
                    <RowerCard workout={obj}/>
                </Grid>))}
            </Grid>              
        </Box>
    );   
}


function SorS(props) {
    const[results, setResults] = useState([{'date': '01/15/21', 'rpe': '10', 'workout_description':'3x19'}, {'date': '01/18/21', 'rpe': '15', 'workout_description':'3x19'}]);  
    // Results is array of JSON objects
    // Need GET method for json, use props.uni to call   
    return (
        <Box>
            {results.map((row,i) => (
                <tr key={i}>
                    {row.map((cell) => (
                        <td>{cell}</td>
                    ))}
                </tr>
            ))}
        </Box>
    );
}


function RowerTabs(props) {
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

function Page(props) {
    const user = useContext(UserContext)
    const [redirect, setredirect] = useState(null)

    useEffect(() => {
        if (!user) {
        setredirect('/')
        }
    }, [user])

    if (redirect) {
        return <Navigate to={redirect}/>
    }
        
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
            <RowerTabs uni={uni} />
        </div>
    )
}

export default Page;
