import './App.css';
import React from 'react';
import Login from './Pages/AuthenticationPage';

import { BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
import UserProvider from "./providers/UserProvider";
import Base from './Base'
import Rower from "./rower_view"
import Page from "./coach_view"
import Zones from "./zones"
import {Header} from "./Header"



function App() {
  const path = useLocation().pathname;
  const location = path.split("/")[1];

  return (
    <div className="App">
    <UserProvider>
    <Base/>
    <Header className="header" />
    <div className={"content " + location}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/rower_view" element={<Rower/>} />
          <Route path="/coach_view" element={<Page />} />
        </Routes>
    </div>
    </UserProvider>
    </div>
  );
}


export default App;
