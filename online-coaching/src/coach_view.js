import React, {useState, useEffect, useContext} from "react";
import { Navigate } from "react-router-dom";
import {UserContext} from "./providers/UserProvider"
import Page from "./Page";


export default function Rower(){
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
    
    return(
            <div>
                <Page/>
            </div>
     )
}
