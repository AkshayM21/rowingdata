import React, {useState, useEffect, useContext} from "react";
import {UserContext} from "./providers/UserProvider";
import { Button } from "@mui/material";
import { Navigate } from 'react-router-dom';
import Settings from "./Settings";
import {Header} from "./Header";

export default function Zones(){
    const user = useContext(UserContext)
    const [redirect, setredirect] = useState(null)

    useEffect(() => {
        if (!user) {
            setredirect('/')
        }else if(!user.isStudent){
            setredirect('/coach_view')
        }
    }, [user])
    
    return(
            <div>
                <Header className="header" />
                <h1>Training Zones</h1>
                <Settings/>
            </div>
    );
}