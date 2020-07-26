import React from 'react'
import Logo from '../logo.png'

let nav = () => {
    return (
        
<nav className="navbar navbar-expand-lg navbar-light bg-primary1">
<div className="container-fluid">
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  {/* <a className="navbar-brand" href="#">OPTIM  ENERGY</a> */}
  <img src={Logo} alt="" srcset=""/>
  <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
    <ul className="navbar-nav mr-auto mb-2 mb-lg-0">
      <li className="nav-item">
        <a className="nav-link active" aria-current="page" href="#"> </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#"> </a>
      </li>
      <li className="nav-item">
        <a className="nav-link disabled " href="#" tabindex="-1" aria-disabled="true">CALCULATE</a>
      </li>
    </ul>
    <form className="d-flex">
  <a className="navbar-brand" href="#"> <p style={{fontWeight: "lighter"}}>  Share Via </p></a>
  <a className="navbar-brand" href={'https://www.facebook.com/sharer/sharer.php?u=' + window.location.href} target="blank"> <i class="fab fa-facebook"></i> </a>
  <a className="navbar-brand" href={"whatsapp://send?text=" + window.location.href} target="blank"> <i class="fab fa-whatsapp"></i> </a>
  <a className="navbar-brand" href={"http://twitter.com/share?text=optimEnergy" +" &url=" + window.location.href} target="blank"> <i class="fab fa-twitter"></i> </a>
  <a className="navbar-brand" href={"https://www.linkedin.com/sharing/share-offsite/?url=" + window.location.href} target="blank"> <i class="fab fa-linkedin-in"></i> </a>

  
     
    </form>
  </div>
</div>
</nav>


    )
}

export default nav