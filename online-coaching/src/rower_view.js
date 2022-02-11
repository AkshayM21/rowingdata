import React, {useState, useEffect, useContext} from "react";
import { Navigate } from "react-router-dom";
import {UserContext} from "./providers/UserProvider"
import SubmissionForm from "./SubmissionForm";

export default function Rower(){
    const user = useContext(UserContext)
    const [redirect, setredirect] = useState(null)


    useEffect(() => {
        if (!user) {
            setredirect('/')
        }else if(!user.isStudent){
            setredirect('/coach_view')
        }
    }, [user])

    if (redirect) {
        return <Navigate to={redirect}/>
    }
    
    return(
            <div className="rower_view">
                <h1>Submit Workout Information</h1>
                <SubmissionForm/>
            </div>
     )
}
