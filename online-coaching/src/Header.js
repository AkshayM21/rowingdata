import { AppBar, Toolbar, Typography, Button} from "@mui/material";
import {makeStyles} from "@mui/styles"
import { Navigate } from "react-router-dom";
import React, {useState, useEffect, useContext} from "react";
import {logOut} from "./services/firebase";
import { UserContext } from './providers/UserProvider';
import { normalizeUnits } from "moment";


export function Header() {

  const {header, logo, button, hidden, toolbar} = useStyles();

  const user = useContext(UserContext)
  const [loggedin, setloggedin] = useState(false)
  const [redirect, setredirect] = useState(null)
  const [back, setback] = useState(false)

  useEffect(() => {
    if (user) {
      setloggedin(true)
    }else{
      setloggedin(false)
    }
    if (redirect == '/settings'){
      setback(true);
    } else if (redirect == '/rower_view'){
      setback(false);
    }
  }, [user])

  const PageName = (
    <div>
      <Typography variant="h6" component="h1" className={logo}>
        C150 Training Statistics
      </Typography>
    </div>
  );

  const handleClick = () => {
    setredirect('/settings');
    setback('true');

  }

  const handleBackClick = () => {
    setredirect('/rower_view');
    setback('false');
  }
  
  const LogoutButton = (
    <Button variant="contained" className={button} onClick={logOut}>Logout</Button>
  );

  const Settings = (
    <Button variant="contained" className={back? hidden: button} onClick={handleClick}>Settings</Button>
  );

  const Back = (
    <Button variant="contained" className={back? button: hidden} onClick={handleBackClick}>Back</Button>
  );

  if (redirect) {
      return <Navigate to={redirect}/>
  }

  const displayDesktop = () => {
    if(!loggedin){
        return (<Toolbar className={toolbar}>
            {PageName}
            </Toolbar>);
    }else{
        return (<Toolbar className={toolbar}>
            {PageName}
            {!back && Settings}
            {back && Back}
            {LogoutButton}
            </Toolbar>);
    }
  };

  return (
    <header >
      <AppBar className={header}>{displayDesktop()}</AppBar>
    </header>
  );
}

const useStyles = makeStyles({
    header: {
        backgroundColor: "#400CCC",
        paddingRight: "79px",
        paddingLeft: "118px",
      },
    logo: {
        fontFamily: "Work Sans, sans-serif",
        fontWeight: 600,
        color: "#FFFEFE",
        textAlign: "left",
      },
    button: {
        fontFamily: "Open Sans, sans-serif",
        fontWeight: 700,
        color: "#FFFEFE",
        size: "18px",
        marginLeft: "0px",
        paddingLeft: 0,
      },
    settings: {
        marginLeft: "100%",
      },
    hidden: {
        dislplay: 'none',
      },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
      },
 });
