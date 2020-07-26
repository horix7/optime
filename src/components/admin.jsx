import React, {Component} from 'react'
import Nav from './adminNav'
import axios from 'axios'

class Admin extends Component {
    state = {
        allAppliances: null,
        caliculations: [],
        newAppliance: {
            appliance: null,
            output: null
        }
    }


    componentDidMount = () => {
        this.getAppliances()
    }

    
    handleInputChange = (e) => {
        this.state.caliculations[e.target.id] = e.target.value
        if(e.target.id == "appliance") {
          this.setState({
            current:e.target.value
          })
        }
     }

     addMoreAppl = () => {
        const newcalic = {
          appliance: null,
          output: null
        }
        let nullFields = []
  
        if(Object.values(this.state.caliculations).some(n => n == null)) {
          Object.keys(this.state.caliculations).forEach(n => {
            if(this.state.caliculations[n] == null) {
                nullFields.push(n)
              }
          })
  
  
          nullFields.forEach(n => document.getElementById(n).style.border = "1px solid red")
          setTimeout(() => {
            nullFields.forEach(n => document.getElementById(n).style.border = "1px solid grey")
          }, 3000);
  
        } else {
          // this.addCaliculations()
          console.log("done")
          let oldState = this.state
          let caliculationz = {...oldState.caliculations}
    
    
        this.setState({
          caliculations: {...newcalic}
        })
  
        document.querySelectorAll("input").forEach(n => n.value = null)
        this.addCaliculations()
        }
      }
  
  

    addCaliculations = () => {
        this.setState({
          fetch: true
        })
        axios({
          method: 'post',
          url:"https://optim-calc.firebaseio.com/apliances/g1WBpIy0wYzFV3nUqbXq.json",
          data: this.state.caliculations,
          headers: {'Content-Type': "application/json" }
          })
          .then(response => {
            this.setState({
              fetch: false
            })
            if(typeof response.name == "string") {
                alert("Appliance Was Added Successfully")
                document.getElementById("8times").click()
            }
          }).catch(err => {
            this.setState({
              fetch: false
            })
            alert("An Error Has Occured ")
          })
      }
  
    
    getAppliances = () => {

        axios({
          method: 'get',
          url:"https://optim-calc.firebaseio.com/apliances/g1WBpIy0wYzFV3nUqbXq.json",
          })
          .then( (response) => {
            this.setState({
                caliculations: [...response.data]
            })

          })
          .catch( () => {
            alert("An Error Have Occured")
          })
      }



    render() {
        return (
            <React.Fragment>
                <Nav/>
                <div className="adminArea">
                    <div className="btnGr">
                        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#staticBackdrop">
                        Add An Appliance
                        </button>

                        
                        <div className="modal fade" id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel"> Create An Appliance</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                            <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">appliance name</span>
                        <input onChange={this.handleInputChange} type="text" className="form-control" placeholder=""  id="appliance" aria-label="Apppliance" aria-describedby="basic-addon1"/>
                        </div>

                        <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">Output Energy</span>
                        <input onChange={this.handleInputChange} type="number" className="form-control" placeholder="" aria-label="Apppliance" aria-describedby="basic-addon1" id="output"/>
                        <span className="input-group-text" id="basic-addon1">kw/h</span>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" id="8times">Close</button>
                            {!this.state.fetch ? <button  type="button" className="btn btn-primary" onClick={this.addMoreAppl}>Add</button> : <button className="btn btn-primary" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            adding...
                            </button> }
                        </div>
                        </div>
                        </div>

                        </div>
                        </div>



                         <div style={{textAlign: "end"}}><button className="btn btn-secondary">Logout</button></div>

                    </div>
                    
                    <div className="tablez">
                        <h5>All caliculations</h5>
                        <div className="caliculations">
                        {this.state.caliculations.length > 0 ? 
                            <table className="table">
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Appliance</th>
                                <th scope="col">Effieciency</th>
                                <th scope="col">madeby</th>
                                <th scope="col">located</th>
                                </tr>
                            </thead>
                            <tbody>

                            {this.state.caliculations.map(n => (
                                <tr key={this.state.caliculations.indexOf(n)}>
                                <th scope="row">{this.state.caliculations.indexOf(n) + 1}</th>
                                <td>{n.appliance}</td>
                                <td>{n.efficiency}</td>
                                <td>{n.madeby}</td>
                                <td>{n.location}</td>
                                </tr>
                            ))}
                            
                            
                            </tbody>
                            </table>
                        : null}
                        </div>
                    </div>

                </div>
                
            </React.Fragment>
        )
    }
}


export default Admin