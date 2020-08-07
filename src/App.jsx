import React from 'react';
import './App.css';
import Calc from "./components/calc"
import Nav from "./components/nav"
import Admin from "./components/admin"
import About from "./components/about"
import {BrowserRouter, Route} from 'react-router-dom'
import Login from './components/loginAdmin'

function App() {
  return (
    <BrowserRouter>
       <Route path="/admin" component={localStorage.loined === "#loine" ? Admin : Login}/>

      <Route path="/" exact  render={() => (
            <div className="App">
            <Nav />
          <div className="twPlaces">
            <Calc/>
            <About />
          </div>
    </div>

      )}/>
    </BrowserRouter>

  );
}

export default App;
