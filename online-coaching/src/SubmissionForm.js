import React, {Component, setState} from "react"
import moment from 'moment'
import AdapterMoment from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from "@mui/lab/DateTimePicker";
import TimePicker from "@mui/lab/TimePicker";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper"
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import {makeStyles} from "@mui/styles"
class SubmissionForm extends Component{


    constructor(props) {
        super(props);
        
        this.state = {
            uni: '', 
            date: null,
            description: '',
            time_on: null,
            workout_type: '',
            rpe: '',
            file:'',
            isFilePicked: false,
            validUnis: [],
            isValidUni: true,
            snackBarOpen: false
        };

        this.handleChange=this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.handleRPEChange = this.handleRPEChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this)
        this.handleUniChange = this.handleUniChange.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        fetch("/rowers")
        .then((result) => result.json())
        .then((result) => {
            this.setState({
                validUnis: result.unis,
            })
        })
    }

    isSubmittable(){
        if(this.state.uni!="" && this.state.isValidUni && this.state.date!=null && this.state.description!="" 
        && this.state.time_on!=null && this.state.workout_type!="" && this.state.rpe!="" && this.state.isFilePicked){
            return true;
        }
        return false;
    }

    handleClose(event, reason){
        if (reason === 'clickaway') {
          return;
        }
    
        this.setState({snackBarOpen: false})
      };

    handleSubmit(e) {
        e.preventDefault();
        try {
            const formData = new FormData();

            formData.append('name', this.state.uni)
            formData.append('date', this.state.date)
            formData.append('description', this.state.description)
            formData.append('on_time', this.state.time_on)
            formData.append('workout_type', this.state.workout_type)
            formData.append('rpe', this.state.rpe)
            formData.append('file', this.state.file)

            fetch("/submit", {
              method: "POST",
              body: formData,
            })
            .then((result) => {
                if (result.ok) {
                    this.setState({
                      uni: '', 
                      date: null,
                      description: '',
                      time_on: null,
                      workout_type: '',
                      rpe: '',
                      file:'',
                      isFilePicked: false,
                      validUnis: [],
                      isValidUni: true,
                      snackBarOpen: true
                    })
      
                } else {
                    console.log(result)
                }
            })
            
        } catch (err) {
            console.log(err);
        }
    }

    handleChange(e) {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        this.setState({[name]: value})
    }

    handleUniChange(e){
        const newValue = e.target.value
        this.setState({uni: newValue})
        if(this.state.validUnis.length>0){
            this.setState({isValidUni: this.state.validUnis.includes(newValue)})
        }

    }

    handleDateChange(newValue) {
        this.setState({date: newValue});
    }

    handleRPEChange(e) {
        const newValue = e.target.value;
        if(newValue!=null){
            if (parseInt(newValue) > 10) {
                this.setState({rpe: 10});
            }else if(parseInt(newValue)<1){
                this.setState({rpe: 1});
            }else{
                this.setState({rpe: newValue});
            }
        }
        
        
    }

    handleTimeChange(newValue) {
        if(newValue!=null){
            let value = newValue.valueOf() - moment().hour(0).minute(0).second(0).millisecond(0).valueOf()
            this.setState({time_on: value/1000});
        }
    }

    handleFileChange(e){
        this.setState({file: e.target.files[0]})
        this.setState({isFilePicked: true})

    }

    handleSelectChange(e) {
        this.setState({workout_type: e.target.value});
    }

    render (){

        const submittable = this.isSubmittable();
        const action = (
            <React.Fragment>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={this.handleClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          );
        return(
            <div>
            <Paper elevation={3} style={{width: '50%', margin: "0 auto"}} >
                <Typography style={{marginTop: "25px"}} variant="h6" gutterBottom component="div">
                    Submit Workout Data
                </Typography>
                <form onSubmit={this.handleSubmit}>
                    <Grid container rowSpacing={2} alignItems="center" justifyContent="space-around" direction="column">
                        <Grid item>
                            <TextField
                                id="uni-input"
                                name="uni"
                                error={!this.state.isValidUni}
                                label="Rower UNI"
                                type="text"
                                value={this.state.uni}
                                onChange={this.handleUniChange}
                            />
                        </Grid>
                        <Grid item>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DateTimePicker
                                    renderInput={(props) => <TextField {...props} />}
                                    label="Workout Date"
                                    value={this.state.date}
                                    emptyLabel="Workout Date"
                                    onChange={this.handleDateChange}
                                />   
                            </LocalizationProvider>
                        </Grid>
                        <Grid item>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                    renderInput={(props) => <TextField {...props} />}
                                    ampm={false}
                                    mask="__:__"
                                    openTo="minutes"
                                    views={["minutes", "seconds"]}
                                    inputFormat="mm:ss"
                                    label="Split Time"
                                    emptyLabel="Split Time"
                                    value={this.state.time_on}
                                    onChange={this.handleTimeChange}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item>
                            <TextField
                                id="description-input"
                                name="description"
                                label="Workout Description"
                                placeholder="6x8min erg"
                                type="text"
                                value={this.state.description}
                                onChange={this.handleChange}
                            />
                        </Grid>
                        <Grid item>
                            <FormControl sx={{ m: 1, minWidth: 200 }}>
                                <InputLabel id="workout-select-label">Workout Type</InputLabel>
                                <Select
                                    labelId="workout-select-label"
                                    id="workout-type-input"
                                    name="workout_type"
                                    autoWidth
                                    value={this.state.value}
                                    label="Workout Type"
                                    onChange={this.handleSelectChange}
                                >
                                    <MenuItem value="decoupling">3x19 Decoupling Workout</MenuItem>
                                    <MenuItem value="rp3">Other RP3 workout</MenuItem>
                                    <MenuItem value="hr_data">Garmin HR Data</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>    
                        <Grid item>
                            <TextField
                                id="rpe-input"
                                name="rpe"
                                label="RPE"
                                type="number"
                                placeholder="1-10"
                                InputProps={{ inputProps: { min: "1", max: "10", step: "1" } }}
                                value={this.state.rpe}
                                sx={{ minWidth: 200 }}
                                onChange={this.handleRPEChange}
                            />
                        </Grid>
                        <Grid item>
                            <Stack direction="row" spacing={2}>
                                <Grid item>
                                    <input
                                        style={{ display: 'none' }}
                                        id="upload-file"
                                        name="upload-file"
                                        type="file"
                                        onChange={this.handleFileChange}
                                    />
                                    <label htmlFor="upload-file">
                                        <Button variant="outlined" component="span" > 
                                            Upload CSV
                                        </Button>
                                    </label>
                                </Grid>
                                
                                <Grid item>
                                    {this.state.isFilePicked ? (
                                        <div>
                                            <Typography variant="body2" gutterBottom>
                                                Filename: {this.state.file.name}, Size: {this.state.file.size/1000} kb
                                            </Typography>
                                        </div>
                                    ) : (
                                        <div>
                                            <Typography variant="body2" gutterBottom>
                                                No file selected
                                            </Typography>
                                        </div>
                                    )}
                                </Grid>
                            </Stack>
                        </Grid>
                        <Grid item sx={{marginBottom: "10px"}}>
                            <Button disabled={!submittable} variant="contained" type="submit">Submit</ Button>
                        </Grid>
                    </Grid>
                </form>
                
            </Paper>
            <Snackbar
                open={this.state.snackBarOpen}
                autoHideDuration={6000}
                onClose={this.handleClose}
                message="Workout data successfully submitted!"
                action={action}
            />
            </div>
        )
    }
}

export default SubmissionForm