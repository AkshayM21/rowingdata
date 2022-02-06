import React, {useContext, useEffect, useState} from 'react'
import { signInWithGoogle } from "../services/firebase";
import { UserContext } from '../providers/UserProvider';
import { Navigate } from 'react-router-dom';
import GoogleButton from 'react-google-button'

export default function Login() {
  const user = useContext(UserContext)
  const [redirect, setredirect] = useState(null)

  useEffect(() => {
    if (user) {
      if(user.isStudent){
        setredirect('/rower_view')
      }else{
        setredirect('/coach_view')
      }
    }
  }, [user])
  if (redirect) {
    return <Navigate to={redirect}/>
  }

  const divStyle = {
    display: "flex",
    height:"100vh",
    justifyContent: "center",
    alignItems: "center"
  }

  
  return (
      <div style={divStyle} className="login-buttons">
        <button className="login-provider-button"><img className="login-image" src="lion.png" alt="Login" background='transparent' onClick={signInWithGoogle} width = '300' height = '300'/></button>
      </div>
  );
}

// class AuthenticationPage extends Component {

//     state = {
//         name: ""
//     }
     
//     componentDidMount(){
//         fetch('/api').then((response) => {
//             if(response.ok){
//                 return response.json()
//             }
//         }).then((data) => {
//             this.setState(data)
//         })
//     }

//     render(){
//         return (
//             <div>{this.state.name}</div>
//         )
//     }
    
// }

// export default AuthenticationPage
