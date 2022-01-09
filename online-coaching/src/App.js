
import './App.css';
import React from 'react';
import Login from './Pages/AuthenticationPage';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserProvider from "./providers/UserProvider";
import Base from './Base'
import Rower from "./rower_view"


function App() {
  

  return (
    <UserProvider>
    <Router>
    <Base/>
    <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/rower_view" element={<Rower/>} />
        </Routes>
    </div>
    </Router>
    </UserProvider>
  );
}




export default App;
