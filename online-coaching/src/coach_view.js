import React, { useState , useEffect, useContext} from 'react'
import { Navigate } from "react-router-dom";
import { UserContext } from "./providers/UserProvider"
import {Box, Drawer, Tab, Card, CardContent, Typography, Grid, Toolbar, Divider, MenuList, MenuItem, ListItemText, formLabelClasses}  from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { DataGrid } from '@mui/x-data-grid';
import RowerMenu from "./RowerMenu";
import ForceProfile from "./force_profile";
import CircularProgress from '@mui/material/CircularProgress';
import { areDayPropsEqual } from '@mui/lab/PickersDay/PickersDay';
//import CardActions from '@mui/material/CardActions';

const drawerWidth = 240;

/*function CircularIndeterminate() {
    return (
      <Box id='progress' sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
}*/

function RowerCard(props){
    // Pass down props.workout['workout_id]
    // Add series of if-else statements in terms of what to return- different for decoupling, rp3, and garmin hr data
    // For rp3 workouts- show workout_description, rpe, hrTSS (if avg_pulse != 0), stroke rate, stroke length in main
    // For Garmin HR data, show workout_description, rpe, hrTSS
    // For decoupling- show power and heart rate for both pieces, decoupling rate, rpe, hrTSS

    if (props.workout["workout_type"] == "decoupling") {
        return(        
            <Card style={{ width: '16rem' }} sx={{ overflow: 'scrollable', position:'relative'}}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary">
                        {props.workout['date']}
                    </Typography>
                    <Typography>
                        Decoupling Workout
                    </Typography>
                    <Typography sx={{ float:'left'}}>
                        Decoupling Rate: {props.workout["decoupling_rate"]}%
                        Power Pieces 2-3: ({props.workout["leg_2_avg_power"]} Watts, {props.workout["leg_2_avg_power"]} Watts)
                    </Typography>
                    <Typography>
                        HR Pieces 2-3: ({props.workout["leg_2_avg_pulse"]}, {props.workout["leg_3_avg_pulse"]})
                    </Typography>
                    <Typography sx={{ fontSize: 14 }}>
                        RPE: {props.workout['rpe']}
                    </Typography>
                    <ForceProfile />
                    {/*workout_id=props.workout['workout_id']*/}
                </CardContent>
            </Card>    
        )
    } else if (props.workout["workout_type"] == "rp3") {
        return(        
            <Card style={{ width: '16rem' }} sx={{ overflow: 'scrollable' }}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary">
                        {props.workout['date']}
                    </Typography>
                    <Typography>
                        Workout: {props.workout['description']}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }}>
                        Split: {props.workout['avg_500m_time']}s/500m
                    </Typography>
                    <Typography>
                        Average Power: {props.workout['avg_power']} Watts
                    </Typography>
                    <Typography>
                        Stroke Rate: {props.workout['avg_stroke_rate']} s/m
                    </Typography>
                    <Typography>
                        Stroke Length: {props.workout['avg_stroke_length']} cm
                    </Typography>
                    <Typography>
                        Energy per Stroke: {props.workout['avg_energy_per_stroke']} J
                    </Typography>
                    <Typography>
                        RPE: {props.workout['rpe']}
                    </Typography>
                    <ForceProfile />
                    {/*workout_id=props.workout['workout_id']*/}
                </CardContent>
            </Card>    
        )
    }
}

function Workouts(props) {
    const[progress, setProgress] = useState(0)

    /*useEffect(() => {
        const timer = setInterval(()=> {
            if (progress == 100) {
                clearInterval(timer);
            } else {
                setProgress((progress) => progress >= 100 ? 0 : progress + 10);
            }  
        }, 500);

        return( () => {
            clearInterval(timer);
        });
    }, []);*/

    if (props.workouts.length === 0) {
        return(<h1>No Workouts Submitted</h1>)
    } else {
        return(
            <Box>
                <CircularProgress id='progress' variant='determinate' value = {progress}/>
                <Grid style={{width: '1200px'}} container spacing={{ xs: 2, sm: 3, md: 3}} aria-busy={true} aria-describedby='progress'>
                    {props.workouts.map((obj, index) => (
                    // Currently set for 2 cards per column in xs, 4 per column for sm
                    <Grid item xs={6} sm={3} md={3} key={index}>
                        <RowerCard workout={obj}/>
                    </Grid>))}
                </Grid>              
            </Box>
        );  
    }    
}


function SorS(props) {
    
    const rows= props.results;
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
        <Box sx={{ flexGrow: 1, p: 3, ml: { sm: `${drawerWidth}px` }, width: { sm: `calc(100% - ${drawerWidth}px)` }, overflow: 'scrollable' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange}>
                        <Tab label="Workouts" value="1"/>
                        <Tab label="SorS" value="2"/>
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <Workouts workouts= {props.workouts} uni={props.uni} loading={props.loading}/>
                </TabPanel>
                <TabPanel value="2">
                    <SorS results= {props.results} uni={props.uni}/>
                </TabPanel>
            </TabContext>            
        </Box>  
    );        

}

function Page(props) {
    /*const user = useContext(UserContext)
    const [redirect, setredirect] = useState(null)

    useEffect(() => {
        if (!user) {
            setredirect('/')
        }else if(user.isStudent){
            setredirect('/rower_view')
        }
    }, [user])*/

    const[uni, setUni] = useState("");
    const[name, setName] = useState();
    const[workouts, setWorkouts]= useState([]);
    const[results, setResults] = useState([]); 
    const[loading, setLoading] = useState(false);

    const changeName = (newUni, newName) => {
        setUni(newUni);
        setName(newName);
    }

    useEffect(() => {
        setLoading(true);
        fetch(`/workouts?uni=${uni}`).then((response) => response.json())
        .then(response => {
            setWorkouts(response.data);
            setLoading(false);
        });

        fetch(`/sors?uni=${uni}`).then((response) => response.json())
        .then(response => {
            setResults(response.data);
        });

        /*fetch(`/workouts?uni=${uni}?workout_id=${workouts[workout_id]}`).then((response) => 
        setImage(response)*/
        // Maybe move get call to rowercard

    }, [uni])


    /*if (redirect) {
        return <Navigate to={redirect}/>
    }*/

    if (uni === "") {
        return(
            <div>
                <RowerMenu onClick={changeName} />
                <h2>Please Select A Rower</h2>
            </div>
        )
    } else {
        return(
            <div>
                <RowerMenu onClick={changeName} />
                <h1>{name} Profile</h1>
                <RowerTabs results= {results} workouts={workouts} uni={uni} name={name} loading={loading}/>
            </div>
        )
    }
}

export default Page;
