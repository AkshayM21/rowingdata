import { onAuthStateChanged } from "firebase/auth";
import React, {useState, useEffect,  createContext} from "react";
import { auth } from "../services/firebase"
import { Navigate } from "react-router-dom";

export const UserContext = createContext({user: null})

export default (props) => {
  //const {handleOpen} = props
  const [user, setuser] = useState(null)

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
        if(user){
            const { displayName, email }  = user;
            
            //move to submission page if valid user -- submit get request
            fetch(`/auth?email=${email}`).then((response) => {
                if(response.ok){
                    return response.json()
                }
            }).then((data) => {
                if(data.isValid==="True" || data.isValid==="true"){
                    //later we'll check if its a student or a coach and direct to the appropriate page
                    setuser({
                        displayName,
                        email
                    })
                }else{
                    alert("Invalid email. Please try again with a valid Columbia email.")
                //display error message
                //logout user using token
                //return to login page
                }
            })
        }else{
            setuser(null)
            return <Navigate to="/" replace={true}/>
        }
    })
  },[])
  return (
    <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
  )
}