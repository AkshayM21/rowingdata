import React, {Component} from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Paper from "@mui/material/Paper";
import Snackbar from '@mui/material/Snackbar';
import Button from "@mui/material/Button";

class Settings extends Component {
    
    constructor(props) {
        super(props);

        this.state= {
            uni: '',
            validUnis: [],
            ftp:'',
            isValidUni:true,
            hr_zone1:'',
            hr_zone2:'',
            hr_zone3:'',
            hr_zone4:'',
            hr_zone5:''
        }

        this.handleClose=this.handleClose.bind(this);
        this.handleUNIChange=this.handleUNIChange.bind(this);
        this.handleFTPChange=this.handleFTPChange.bind(this);
        this.handleZone1Change=this.handleZone1Change.bind(this);
        this.handleZone2Change=this.handleZone2Change.bind(this);
        this.handleZone3Change=this.handleZone3Change.bind(this);
        this.handleZone4Change=this.handleZone4Change.bind(this);
        this.handleZone5Change=this.handleZone5Change.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        fetch(`https://python-ovgem5mydq-uk.a.run.app/rowers?token=${this.props.idToken}`)
        .then((result) => result.json())
        .then((result) => {
            this.setState({
                validUnis: result.unis,
            })
        })
    }

    // Set so that rowers can update only one zone at a time? Probably no.
    isSubmittable(){
        if(this.state.uni!=="" && this.state.isValidUni && this.state.ftp!=="" && this.state.hr_zone1!=="" 
        && this.state.hr_zone2!==""  && this.state.hr_zone3!==""  && this.state.hr_zone4!==""  && this.state.hr_zone5!=="" ){
            return true;
        }
        return false;
    }

    handleSubmit(e) {
        e.preventDefault();
        try {
            const formData = new FormData();

            formData.append('name', this.state.uni)
            formData.append('ftp', this.state.ftp)
            formData.append('hr_zone1', this.state.hr_zone1)
            formData.append('hr_zone2', this.state.hr_zone2)
            formData.append('hr_zone3', this.state.hr_zone3)
            formData.append('hr_zone4', this.state.hr_zone4)
            formData.append('hr_zone5', this.state.hr_zone5)
            formData.append("token", this.props.idToken)

            fetch("https://python-ovgem5mydq-uk.a.run.app/settings", {
              method: "POST",
              body: formData,
            })
            .then((result) => {
                if (result.ok) {
                    this.setState({
                      uni:'', 
                      ftp:'',
                      hr_zone1:'',
                      hr_zone2:'',
                      hr_zone3:'',
                      hr_zone4:'',
                      hr_zone5:'',
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

    handleClose(event, reason){
        if (reason === 'clickaway') {
          return;
        }
    
        this.setState({snackBarOpen: false})
    };
    
    handleUNIChange(e) {
        const newValue = e.target.value;
        if(newValue!=null){    
            this.setState({uni: newValue});
        }
    }

    handleFTPChange(e) {
        const newValue = e.target.value;
        if(newValue!=null){
            if (parseInt(newValue) > 500) {
                this.setState({ftp: null});
            }else if(parseInt(newValue)<0){
                this.setState({ftp: null});
            }else{
                this.setState({ftp: newValue});
            }
        }
    }

    handleZone1Change(e) {
        const newValue = e.target.value;
        if(newValue!=null){
            if (parseInt(newValue) > 300) {
                this.setState({hr_zone1: null});
            }else if(parseInt(newValue)<0){
                this.setState({hr_zone1: null});
            }else{
                this.setState({hr_zone1: newValue});
            }
        }
    }

    handleZone2Change(e) {
        const newValue = e.target.value;
        if(newValue!=null){
            if (parseInt(newValue) > 300) {
                this.setState({hr_zone2: null});
            }else if(parseInt(newValue)<0){
                this.setState({hr_zone2: null});
            }else{
                this.setState({hr_zone2: newValue});
            }
        }
    }

    handleZone3Change(e) {
        const newValue = e.target.value;
        if(newValue!=null){
            if (parseInt(newValue) > 300) {
                this.setState({hr_zone3: null});
            }else if(parseInt(newValue)<0){
                this.setState({hr_zone3: null});
            }else{
                this.setState({hr_zone3: newValue});
            }
        }
    }

    handleZone4Change(e) {
        const newValue = e.target.value;
        if(newValue!=null){
            if (parseInt(newValue) > 300) {
                this.setState({hr_zone4: null});
            }else if(parseInt(newValue)<0){
                this.setState({hr_zone4: null});
            }else{
                this.setState({hr_zone4: newValue});
            }
        }
    }

    handleZone5Change(e) {
        const newValue = e.target.value;
        if(newValue!=null){
            if (parseInt(newValue) > 300) {
                this.setState({hr_zone5: null});
            }else if(parseInt(newValue)<0){
                this.setState({hr_zone5: null});
            }else{
                this.setState({hr_zone5: newValue});
            }
        }
    }

    render(){
        const submittable=this.isSubmittable();
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
                <form id="settings-form" onSubmit={this.handleSubmit}>
                    <Grid container rowSpacing={2} alignItems="center" justifyContent="space-around" direction="column">
                        <Grid item>
                            <TextField
                                id="uni"
                                name="uni"
                                error={!this.state.isValidUni}
                                label="Rower UNI"
                                type="text"
                                value={this.state.uni}
                                onChange={this.handleUNIChange}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                id="ftp"
                                name="ftp"
                                label="FTP"
                                type="text"
                                value={this.state.ftp}
                                onChange={this.handleFTPChange}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                id="hr_zone1"
                                name="hr_zone1"
                                label="Heart Rate Zone 5"
                                type="text"
                                value={this.state.hr_zone1}
                                onChange={this.handleZone1Change}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                id="hr_zone2"
                                name="hr_zone2"
                                label="Heart Rate Zone 4"
                                type="text"
                                value={this.state.hr_zone2}
                                onChange={this.handleZone2Change}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                id="hr_zone3"
                                name="hr_zone3"
                                label="Heart Rate Zone 3"
                                type="text"
                                value={this.state.hr_zone3}
                                onChange={this.handleZone3Change}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                id="hr_zone4"
                                name="hr_zone4"
                                label="Heart Rate Zone 2"
                                type="text"
                                value={this.state.hr_zone4}
                                onChange={this.handleZone4Change}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                id="hr_zone5"
                                name="hr_zone5"
                                label="Heart Rate Zone 1"
                                type="text"
                                value={this.state.hr_zone5}
                                onChange={this.handleZone5Change}
                            />
                        </Grid>                      
                        <Grid item sx={{marginBottom: "15px"}}>
                            <Button disabled={!submittable} variant="contained" type="submit">Submit</ Button>
                        </Grid>
                    </Grid>
                </form>
                <Snackbar
                    open={this.state.snackBarOpen}
                    autoHideDuration={6000}
                    onClose={this.handleClose}
                    message="Settings Updated!"
                    action={action}
                />
            </div>
        )
    }
}

export default Settings
