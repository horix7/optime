import React, { Component } from 'react'
import logo from '../logo.png'
import axios from 'axios'

class LoginForm extends Component{


    state = {
        loading: false,
        data: {
            username: null,
            password: null
        }
    }



    
    handleInputChange = (e) => {
        this.state.data[e.target.id] = e.target.value
        if(e.target.id == "appliance") {
          this.setState({
            current:e.target.value
          })
        }
     }

     fetchAdmin = () => {
        this.setState({
            loading: true
        })
        axios({
            method: 'get',
            url:"https://optim-calc.firebaseio.com/apliances/adminInfo/-ME8iqY_90wdvcqPFeaV.json",
            }).then(results => {

                if(results.data.username === this.state.data.username) {
                    
                    if(results.data.passowrd === this.state.data.password) {
                        localStorage.setItem("loined", "#loine")
                        window.location.reload()
                        
                    }else {
                        alert("You Provide Invalid Info")
                        this.setState({
                            loading: false
                        })
                    }
                }else {
                    alert("You Provide Invalid Info")
                        this.setState({
                            loading: false
                        })
                }
            }).catch(err => console.log(err)) 
    }



    render() {
        return (
            <div className="greyer">
    
            <div className="LoginForm">
                <img width="250px" src={logo} alt="" srcset=""/>
                <input type="text" onChange={this.handleInputChange} name="" id="username" placeholder="UserName"/>
                <input type="password" name=""  placeholder="Password" onChange={this.handleInputChange} id="password"/>
                    <button onClick={this.fetchAdmin}>{this.state.loading ? <div className="spinner-grow" role="status">
                            <span className="sr-only">Loading...</span>
                        </div> : "Login" }</button>
            </div>
            </div>
    
        )
    }
}


export default LoginForm