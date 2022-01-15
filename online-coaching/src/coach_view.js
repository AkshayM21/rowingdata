import React, { useState , useEffect, useContext} from 'react'
import { Navigate } from "react-router-dom";
import { UserContext } from "./providers/UserProvider"
import {Box, Drawer, Tab, Card, CardContent, Typography, Grid, Toolbar, Divider, MenuList, MenuItem, ListItemText}  from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { DataGrid } from '@mui/x-data-grid';
import RowerMenu from "./RowerMenu";
import { areDayPropsEqual } from '@mui/lab/PickersDay/PickersDay';
//import CardActions from '@mui/material/CardActions';

const drawerWidth = 240;

function RowerCard(props){
    // Workout json passed down from deck
    
    return(        
        <Card style={{ width: '16rem' }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary">
                    {props.workout['date']}
                </Typography>
                <Typography>
                    Workout: {props.workout['workout_description']}
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                    RPE: {props.workout['rpe']}
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
    const uni= props.uni;
    useEffect(() => {
        fetch(`/workouts?uni=${uni}`).then((response) => response.json())
        .then(response => {
            setWorkouts(response.data);
        });
    })
    
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
    const[results, setResults] = useState([]);  
    const uni= props.uni;
    // Results is array of JSON objects
    // Need GET method for json, use props.uni to call   
    
    useEffect(() => {
        fetch(`/sors?uni=${uni}`).then((response) => response.json())
        .then(response => {
            setResults(response.data);
        });
    }, [])
    
    const rows= results;
    const columns= [
        { field: 'date', headerName: 'Date', width: 80 },
        { field: 'boat_class', headerName: 'Boat Class', width: 100 },
        { field: 'rank', headerName: 'Rank', width: 60 },
        { field: 'avg_time', headerName: 'Average Time', width: 120 },
        { field: 'avg_wbt', headerName: 'Average WBT%', width: 120 },
        { field: 'piece_1_time', headerName: 'Piece 1 Time', width: 120 },
        { field: 'piece_1_wbt', headerName: 'Piece 1 WBT%', width: 125 },
        { field: 'piece_2_time', headerName: 'Piece 2 Time', width: 120 },
        { field: 'piece_2_wbt', headerName: 'Piece 2 WBT%', width: 125 },
        { field: 'piece_3_time', headerName: 'Piece 3 Time', width: 120 },
        { field: 'piece_3_wbt', headerName: 'Piece 3 WBT%', width: 125 }
    ]

    return (
        <div style={{ height: 300, width: '110%' }}>
            <DataGrid rows={rows} columns={columns} />
        </div>
    );
}


function RowerTabs(props) {
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3, ml: { sm: `${drawerWidth}px` }, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange}>
                        <Tab label="Workouts" value="1"/>
                        <Tab label="SorS" value="2"/>
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <Workouts uni={props.uni}/>
                </TabPanel>
                <TabPanel value="2">
                    <SorS uni={props.uni}/>
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
    const[name, setName] = useState('Ayush Saini');

    const changeName = (newUni, newName) => {
        setUni(newUni);
        setName(newName);
    }

    return(
        <div>
            <RowerMenu onClick={changeName} />
            <h1>{name} Profile</h1>
            <RowerTabs uni={uni} />
        </div>
    )
}

export default Page;
