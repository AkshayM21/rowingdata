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
        }
    }, [user])

    if (redirect) {
        return <Navigate to={redirect}/>
    }
    
    return(
            <div>
                <h1>Submit Workout Information</h1>
                <SubmissionForm/>
            </div>
     )
}



// //Params are stored in compoment state, file can be obtained with id
// ReactDOM.render(<Rower />, document.getElementById('rower_view'))
