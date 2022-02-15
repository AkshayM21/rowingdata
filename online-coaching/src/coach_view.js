import React, { useState , useEffect, useContext} from 'react'
import { Navigate } from "react-router-dom";
import { UserContext } from "./providers/UserProvider"
import {Box, Drawer, Tab, Card, CardContent, Typography, Grid, Toolbar, Divider, MenuList, MenuItem, ListItemText, formLabelClasses}  from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { DataGrid } from '@mui/x-data-grid';
import RowerMenu from "./RowerMenu";
//import ForceProfile from "./force_profile";
import CircularProgress from '@mui/material/CircularProgress';
import { areDayPropsEqual } from '@mui/lab/PickersDay/PickersDay';
//import CardActions from '@mui/material/CardActions';
import {DialogTitle, Dialog, Button} from '@mui/material';
import PropTypes from 'prop-types';
import { Base64 } from 'js-base64';

function Page() {
    const user = useContext(UserContext)
    const [redirect, setredirect] = useState(null)
    const [variance, setVariance] = useState([]);
    const [force_profiles, setForce_profiles]=useState([]);
    const [uni, setUni] = useState("");
    const [name, setName] = useState();
    const [workouts, setWorkouts]= useState([]);
    const [results, setResults] = useState([]); 



    useEffect(() => {
        if (!user) {
            setredirect('/')
        }else if(user.isStudent){
            setredirect('/rower_view')
        }
    }, [user])
    

    const changeName = (newUni, newName) => {
        setUni(newUni);
        setName(newName);
    }

    useEffect(() => {

        fetch(`https://python-ovgem5mydq-uk.a.run.app/workouts?uni=${uni}&token=${user ? user.token : null}`).then((response) => response.json())
        .then(response => {
            setWorkouts(response.data); 
            var profiles = [];
            for (let i = 0; i < response.data.length; i++){
                // Currently set for 2 cards per column in xs, 4 per column for sm
                fetch(`https://python-ovgem5mydq-uk.a.run.app/graphs?token=${user ? user.token : null}&uni=${uni}&workout_id=${response.data[i]["workout_id"]}`).then((response) => response.json())
                .then(response => {
                    force_profiles[i]=response.force_profile; 
                    variance[i]=response.stroke_variance;
                    setForce_profiles([...force_profiles]);
                    setVariance([...variance]); 
                })  
            }
       
            
        });

        fetch(`https://python-ovgem5mydq-uk.a.run.app/sors?token=${user ? user.token : null}&uni=${uni}`).then((response) => response.json())
        .then(response => {
            setResults(response.data);
        });
    }, [uni])

    if (redirect) {
        return <Navigate to={redirect}/>
    }

    if (uni === "") {
        return(
            <div className="coach_view">
                <RowerMenu onClick={changeName} idToken={user ? user.token : null} />
                <h1>Please Select A Rower</h1>
            </div>
        )
    } else {
        return(
            <div className='coach_view'>
                <RowerMenu onClick={changeName} idToken={user ? user.token : null} />
                <h1>{name} Profile</h1>
                <RowerTabs results={results} workouts={workouts} force_profiles={force_profiles} variance={variance} uni={uni} name={name} />
            </div>
        )
    }
}

function ForceDialog(props) {
    const { onBackdropClick, open, img, workouts, uni} = props;
    
    return(
        // onClose is built into Dialog such that clicking outside calls handleClose, which calls onBackdropClick prop
        <Dialog onBackdropClick={onBackdropClick} open={open} >
            <img src={`data:image/png;base64,${img}`}/>
            <Typography sx= {{fontWeight: 'bold', mt: '5%'}} align={'center'}>
                IMSE: {props.imse}
            </Typography>
            <img src={`data:image/png;base64,${props.variance_plot}`}/>
            
            
            
        </Dialog>
    ); 
}

ForceDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

function ForceProfile(props) {

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
                variance_plot={props.variance_plot}
                imse={props.imse}
                workouts={props.workouts}
                uni={props.uni}
            />
        </div>
    );
}


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

    /*useEffect(() => {
        fetch(`/graphs?uni=${props.uni}&workout_id=${props.workout["workout_id"]}`).then((response) => response.json())
        .then(response => {
            setImg(response.force_profile);
            setVariance(response.stroke_variance);
        });      
    })*/

    var seconds = Math.round(props.workout['avg_500m_time'] % 60*100)/100;
    var minutes = Math.floor(props.workout['avg_500m_time']/60);           

    if (props.workout["workout_type"] === "decoupling") {
        return(        
            <Card style={{ width: '16rem' }} sx={{ overflow: 'scrollable', position:'relative'}}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary">
                        {props.workout['date']}
                    </Typography>
                    <Typography sx={{fontWeight: 'bold'}}>
                        Decoupling Workout
                    </Typography>
                    <Typography>
                        Decoupling Rate: {props.workout["decoupling_rate"]}%
                    </Typography>
                    <Typography>
                        Power Pieces 2-3: ({props.workout["leg_2_avg_power"]} Watts, {props.workout["leg_3_avg_power"]} Watts)
                    </Typography>
                    <Typography>
                        HR Pieces 2-3: ({props.workout["leg_2_avg_pulse"]} bpm, {props.workout["leg_3_avg_pulse"]} bpm)
                    </Typography>
                    <Typography> 
                        hrTSS: {(props.workout['hrtss'] !==0)? props.workout['hrtss'] : 'N/A'}
                    </Typography>
                    <Typography>
                        RPE: {(props.workout['rpe'] !== 0)? props.workout['rpe'] : 'N/A'}
                    </Typography>
                    <ForceProfile img={props.img} variance_plot={props.variance_plot} uni={props.uni} imse={props.workout["imse"]} workouts={props.workouts}/>
                   
                </CardContent>
            </Card>    
        )
    } else if (props.workout["workout_type"] === "rp3") {
        return(        
            <Card style={{ width: '16rem' }} sx={{ overflow: 'scrollable' }} >
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary">
                        {props.workout['date']}
                    </Typography>
                    <Typography sx={{fontWeight: 'bold'}} >
                        {props.workout['description']}
                    </Typography>
                    <Typography>
                        Split: {minutes}:{seconds<10? '0'+seconds : seconds} /500m
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
                        hrTSS: {(props.workout['hrtss'] !==0)? props.workout['hrtss'] : 'N/A'}
                    </Typography>
                    <Typography>
                        RPE: {(props.workout['rpe'] !== 0)? props.workout['rpe'] : 'N/A'}
                    </Typography>
                    <ForceProfile img={props.img} variance_plot={props.variance_plot} uni={props.uni} imse={props.workout["imse"]} workouts={props.workouts}/>
                </CardContent>
            </Card>    
        )
    }
}

function Workouts(props) {
    var count=0;

    if (props.workouts.length === 0) {
        return(<h1 className='empty-workouts'>No Workouts Submitted</h1>)
    } else {
        return(
            <Box>
                <Grid style={{width: '100%', overflow: 'scrollable'}} container spacing={{ xs: 2, sm: 3, md: 3}} aria-busy={true} aria-describedby='progress'>
                    {props.workouts.map((obj, index) => (
                    // Currently set for 2 cards per column in xs, 4 per column for sm
                    <Grid item xs={12} sm={4} md={3} key={index}>
                        <RowerCard uni={props.uni} workout={obj} workouts={props.workouts} variance_plot={props.variance[index]} img={props.force_profiles[index]}/>
                        {console.log(props.force_profiles[index])}
                        {console.log(index)}
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
        <Box className='sors' style={{ borderRadius: '10px', height: 500, width: '95%'}}>
            <DataGrid style={{ borderRadius: '10px'}} rows={rows} columns={columns} />
        </Box>
    );
}


function RowerTabs(props) {
    const [value, setValue] = React.useState('1');
    /*const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);*/

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
                    <Workouts workouts= {props.workouts} uni={props.uni} force_profiles={props.force_profiles} variance={props.variance}/>
                </TabPanel> 
                <TabPanel value="2">
                    <SorS results= {props.results} uni={props.uni}/>
                </TabPanel>
            </TabContext>            
        </Box>  
    );        

}

export default Page;
