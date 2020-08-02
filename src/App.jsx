import React from 'react';
import './App.css';
import Calc from "./components/calc"
import Nav from "./components/nav"
import Admin from "./components/admin"
import About from "./components/about"

function App() {
  return (
    <div className="App">
      {/* <Nav />
      <div className="twPlaces">
        <p className="eefc">Energy Efficiency Online Calculator</p>
      <Calc />
      <About />
      </div> */}
       
      <Admin/>
    </div>
  );
}

export default App;
