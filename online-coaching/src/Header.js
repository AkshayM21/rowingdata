import { AppBar, Toolbar, Typography, Button} from "@mui/material";
import {makeStyles} from "@mui/styles"
import React, {useState, useEffect, useContext} from "react";
import {logOut} from "./services/firebase"
import { UserContext } from './providers/UserProvider';
import { dividerClasses } from "@mui/material";


export function Header() {

  const {header, logo, button, toolbar} = useStyles();

  const user = useContext(UserContext)
  const [loggedin, setloggedin] = useState(false)

  useEffect(() => {
    if (user) {
      setloggedin(true)
    }else{
      setloggedin(false)
    }
  }, [user])


  const PageName = (
    <Typography variant="h6" component="h1" className={logo}>
      C150 Training Statistics
    </Typography>
  );
  
  const LogoutButton = (
    <Button variant="contained" className={button} onClick={logOut}>Logout</Button>
  );


  const displayDesktop = () => {
    if(!loggedin){
        return (<Toolbar className={toolbar}>
            {PageName}
            </Toolbar>);
    }else{
        return (<Toolbar className={toolbar}>
            {PageName}
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
        marginLeft: "38px",
      },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
      },
 });