import React from 'react'

let nav = () => {
    return (
        
<nav className="navbar navbar-expand-lg navbar-dark bg-primary1">
<div className="container-fluid">
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <a className="navbar-brand" href="#">OPTIM  ADMIN</a>
  <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
    <ul className="navbar-nav mr-auto mb-2 mb-lg-0">
      <li className="nav-item">
        <a className="nav-link active" aria-current="page" href="#"> </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#"> </a>
      </li>
      <li className="nav-item">
        <a className="nav-link disabled " href="#" tabIndexb="-1" aria-disabled="true">caliculations</a>
      </li>
    </ul>
    <form className="d-flex">
  <a className="navbar-brand" href="#">Logout</a>
     
    </form>
  </div>
</div>
</nav>


    )
}

export default nav