import React, {Component, Fragment} from 'react'
import Nav from './adminNav'
import axios from 'axios'
import demoData from '../adminDemo.json'
import Modal from 'react-modal'
Modal.setAppElement("#root")

class Admin extends Component {
    state = {
        allAppliances: null,
        caliculations: {},
        currentPresent: null,
        newAppliance: {
            DETAIL: null,
            OUTPUT: null,
            CATEGORY: null,
            COST: null,
        },
        openModal: false,
        incrementor: 0
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
          url:"https://optim-calc.firebaseio.com/apliances/caliculations.json",
          data: this.state.caliculations,
          headers: {'Content-Type': "application/json" }
          })
          .then(response => {
            this.setState({
              fetch: false
            })
            if(typeof response.name == "string") {
                alert("Appliance Was Added Successfully")
                // document.getElementById("8times").click()
            }
          }).catch(err => {
            this.setState({
              fetch: false
            })
            alert("An Eror Has Occured ")
          })
      }

  
  
    
    getAppliances = () => {

        // axios({
        //   method: 'get',
        //   url:"https://optim-calc.firebaseio.com/apliances/caliculations.json",
        //   })
        //   .then( (response) => {
        //     this.setState({
        //         caliculations: response.data
        //     })

        //     alert(JSON.stringify(response.data))

        //   })
        //   .catch(err => { 
            let dates = [...new Set(Object.keys(demoData).map(n => {return {date: demoData[n].date, id: n}}))].reverse()
            let dates2 = [...new Set(Object.keys(demoData).map(n => demoData[n].date))]
            let dates1 = Object.keys(demoData).map(n => {return {date: Object.keys(demoData).indexOf(n), id: n}})
            
            let dataMapped = {}
            let mappedD = []
            
            dates.map(n => n.date).forEach(n => {
              let data ={...Object.values(demoData).filter(m => m.date == n)}
             
              // let checkId  = (elem) => {
              //   return dates1.filter(n => n.id == elem).map(n => n.id)[0]
              // }
              // mappedD.push({index: n, reference: dates[dates2.indexOf(n)].id})
              
              dataMapped[n] = data

            })

            console.log(dataMapped)
            console.log(dates1)

            
            this.setState({
              caliculationz: dataMapped,
              caliculations: demoData
          })

            // alert("An Error Have Occured")

          // })
      }


      changeIncrementor = () => {

        let oldStae = this.state
        this.setState({
          incrementor: oldStae.incrementor++
        })
      }


    render() {
      const   represntatives = Object.keys(this.state.caliculations).map(element => {
        return {
          id: Object.keys(this.state.caliculations).indexOf(element),
          display:  (
            <div className="oneDataEl">
                <React.Fragment>
                
                <div className="oneSTarcture">
                
                <ul className="list-group" >
                     <li className="list-group-item active">User Information</li>
                      <li className="list-group-item">Made By  <span className="endz">{this.state.caliculations[element].user.username}</span></li>
                      <li className="list-group-item">Location  <span className="endz">{this.state.caliculations[element].user.location}</span></li>
                  </ul>
                </div>
      
                 <div className="oneSTarcture">

                  <ul className="list-group" >
                       <li className="list-group-item active">Calicualtion Summary</li>                      
                      <li className="list-group-item">AVG Energy Efficicency  <span className="endz">{this.state.caliculations[element].summary["Home Average Energy Efficiency"]}</span></li>
                      <li className="list-group-item">Total Energy Consumed  <span className="endz">{this.state.caliculations[element].summary["Total Energy Usage"]}</span></li>
                      <li className="list-group-item">Total Energy Cost  <span className="endz">{this.state.caliculations[element].summary["Home Energy Cost"]}</span></li>
                  </ul>

                </div>
      
                <div className="applianceszz">
                <h1 className="resHead">All caliculations </h1>
                  
                <table className={parseInt(this.state.caliculations[element].summary["Home Average Energy Efficiency"].toString().split("%")[0]) > 54 ? "table  table-striped" : "table table-striped" }>
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Appliance</th>
                    <th scope="col">Effieciency</th>
                    <th scope="col">power</th>
                    <th scope="col">cost</th>
                    </tr>
                </thead>
                <tbody>
      
                {this.state.caliculations[element].data.map(n => (
                    <tr key={this.state.caliculations[element].data.indexOf(n)}>
                    <th scope="row">{this.state.caliculations[element].data.indexOf(n) + 1}</th>
                    <td>{n.appliance}</td>
                    <td>{n.output} </td>
                    <td>{n.powerUsage} KW</td>
                    <td>0</td>
                    </tr>
                ))}
                
                
                </tbody>
                </table>
                </div>
                </React.Fragment>
      
              
            </div>
          )
        }
      })

      let viewResults = (reqq, represntatives = represntatives) => {
        console.log(reqq)

        let oldState = this.state
        let currentPicked = null
        represntatives.forEach(n => {
          if(n.id == reqq) {
            currentPicked = n.display
          }
        })

        this.setState({
          openModal: !oldState.openModal,
          currentPresent: currentPicked
        })


      }
        return (
            <Fragment>
              {Object.keys(this.state.caliculations).length > 0 ? <React.Fragment>
                <Nav/>
                <div className="adminArea">

                    <div className="boxes">
                      <ul className="list-group">
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Calicucaltion Made
                          <span className="badge bg-primary rounded-pill">{Object.keys(this.state.caliculations).map(n => this.state.caliculations[n].data.length).reduce((a,b) => a + b)}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          Registered Applainces
                          <span className="badge bg-primary rounded-pill">2</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          report made 
                        <span className="badge bg-primary rounded-pill">{Object.keys(this.state.caliculations).length}</span>
                        </li>
                      </ul>
                      
                    <div className="btnGr">
                        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#staticBackdrop">
                        Add An Appliance
                        </button>

                        <div className="srting">
                            {null}
                         </div>
                        
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
                        <input onChange={this.handleInputChange} type="text" className="form-control" placeholder=""  id="DETAIL" aria-label="Apppliance" aria-describedby="basic-addon1"/>
                        </div>

                        <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">Output Energy</span>
                        <input onChange={this.handleInputChange} type="number" className="form-control" placeholder="" aria-label="Apppliance" aria-describedby="basic-addon1" id="OUTPUT"/>
                        <span className="input-group-text" id="basic-addon1">kw/h</span>
                        </div>
                        
                        <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">Energy Cost</span>
                        <input onChange={this.handleInputChange} type="number" className="form-control" placeholder="" aria-label="Apppliance" aria-describedby="basic-addon1" id="COST"/>
                        <span className="input-group-text" id="basic-addon1">$/h</span>
                        </div>
                        
                        <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">Category</span>
                        <input onChange={this.handleInputChange} type="text" className="form-control" placeholder="" aria-label="Apppliance" aria-describedby="basic-addon1" id="CATEGORY"/>
                        </div>

                        {/* </div> */}
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




                    </div>
                    
                    </div>

                    <div className="tablez">
                        <h5>All caliculations</h5>
                        <div className="caliculations">

                          <div className="summaryAll">

                          {
                            Object.values(this.state.caliculationz).map(oneDate => (
                          
                          <div className="OneTable" key={Object.values(this.state.caliculationz).indexOf(oneDate)}>
                          <h1 className="resHead">{Object.keys(this.state.caliculationz)[Object.values(this.state.caliculationz).indexOf(oneDate)]}</h1>

                          <table className="table">
                          <thead>
                              <tr>
                              <th scope="col">#</th>
                              <th scope="col">madeBy</th>
                              <th scope="col">located</th>
                              <th scope="col">Appliances </th>
                              <th scope="col">Efficicency</th>
                              <th scope="col">Actions</th>
                              </tr>
                          </thead>
                          <tbody>

                           
                          {Object.keys(oneDate).map(elem => (
                             <tr key={Object.keys(oneDate).indexOf(elem)}>
                             <th scope="row">{Object.keys(oneDate).indexOf(elem) + 1}</th>
                             <td>{oneDate[elem].user.username}</td>
                             <td>{oneDate[elem].user.location}</td>
                             <td>{oneDate[elem].data.length}</td>
                             <td>{oneDate[elem].summary["Home Average Energy Efficiency"]}</td>
                             <td className="linkClick" onClick={() => viewResults( Object.values(this.state.caliculations).indexOf((oneDate)[elem]), represntatives)}>View Results</td>
                             </tr>
                          ))}
              
                          </tbody>
                          </table>
                          </div>
                          
                            ))
                          }
                          
                          </div>

                            <Modal
                              style={{
                                overlay: {
                                  position: 'fixed',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  backgroundColor: 'rgba(0, 0, 0, 0.404)'
                              },
                              content: {
                                  position: 'absolute',
                                  top: '3%',
                                  left: '3%',
                                  right: '3%',
                                  bottom: '3%',
                                  border: '1px solid #fff',
                                  background: '#fff',
                                  overflow: 'auto',
                                  WebkitOverflowScrolling: 'touch',
                                  borderRadius: '5px',
                                  outline: 'none',
                                  padding: '10px'
                              }
                              }}
                              isOpen={this.state.openModal} onRequestClose={() => {
                                let oldModal = this.state.openModal
                                this.setState({
                                  openModal: !oldModal
                                })
                              }}>   

                                {this.state.currentPresent}

                              </Modal>

                        
                        </div>
                    </div>

                </div>
                
            </React.Fragment>
        : <div className="fofo"> No Internet Connection </div> }
            </Fragment>  
          )
    }
}


export default Admin