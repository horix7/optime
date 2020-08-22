import React, {Component, Fragment} from 'react'
import Nav from './adminNav'
import axios from 'axios'
import demoData from '../adminDemo.json'
import Modal from 'react-modal'
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js'

Modal.setAppElement("#root")

class Admin extends Component {
    state = {
        allAppliances: null,
        caliculations: {},
        caliculationc: {
          DETAIL: null,
          OUTPUT: null,
          COST: null,
          CATEGORY: null
        },
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

    worker = (element) =>  html2pdf().from(element).save()



    dowLoadCsv = (objArray) => {
      let items = objArray;
      const replacer = (key, value) => value === null ? '' : value;
      const header = Object.keys(items[0]);
      let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
      csv.unshift(header.join(','));
      csv = csv.join('\r\n');

      alert("Press Ok To DownLoad Csv")

      let downloadLink = document.createElement("a");
      let blob = new Blob(["\ufeff", csv]); 
      let url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = `${parseInt(Math.floor(Math.random() * 1200) + 1).toString()}fortuneData.csv`;  //Name the file here
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

  }


  dowLoadPdf = (data, element) => {

  }



  printData =  () => {

  }





  


    componentDidMount = () => {
        this.getAppliances()
    }

    
    handleInputChange = (e) => {
        this.state.caliculationc[e.target.id] = e.target.value
       
     }

     addMoreAppl = () => {
        const newcalic = {
          appliance: null,
          output: null
        }
        let nullFields = []
  
        if(Object.values(this.state.caliculationc).some(n => n == null)) {
          Object.keys(this.state.caliculationc).forEach(n => {
            if(this.state.caliculationc[n] == null) {
                nullFields.push(n)
              }
          })
  
  
          nullFields.forEach(n => document.getElementById(n).style.border = "1px solid red")
          setTimeout(() => {
            nullFields.forEach(n => document.getElementById(n).style.border = "1px solid grey")
          }, 3000);
  
        } else {
          // this.addCaliculations()
          let oldState = this.state
    
    
        this.setState({
          caliculationc: {...newcalic}
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
          url:"https://optim-calc.firebaseio.com/apliances/-ME8iUsYmHnlonCZh5nG.json",
          data: this.state.caliculationc,
          headers: {'Content-Type': "application/json" }
          })
          .then(response => {
            this.setState({
              fetch: false
            })
            if(typeof response.name == "string") {
                alert("Appliance Was Added Successfully")
            }
          }).catch(err => {
            this.setState({
              fetch: false
            })
            alert("An Eror Has Occured ")
          })
      }

  
  
    
    getAppliances = () => {

        axios({
          method: 'get',
          url:"https://optim-calc.firebaseio.com/apliances/caliculations.json",
          })
          .then( (response) => {
          
            let dates = [...new Set(Object.keys(response.data).map(n => {return {date: response.data[n].date, id: n}}))].reverse()
            let dates2 = [...new Set(Object.keys(response.data).map(n => response.data[n].date))]
            let dates1 = Object.keys(response.data).map(n => {return {date: Object.keys(response.data).indexOf(n), id: n}})
            
            let dataMapped = {}
            let mappedD = []
            
            dates.map(n => n.date).forEach(n => {
              let data ={...Object.values(response.data).filter(m => m.date == n)}
             
              // let checkId  = (elem) => {
              //   return dates1.filter(n => n.id == elem).map(n => n.id)[0]
              // }
              // mappedD.push({index: n, reference: dates[dates2.indexOf(n)].id})
              dataMapped[n] = data

            })
            
            this.setState({
              caliculationz: dataMapped,
              caliculations: response.data
          })

          })
          .catch(err => { 
            alert("An Error Have Occured")
          })
      }


      changeIncrementor = () => {

        let oldStae = this.state
        this.setState({
          incrementor: oldStae.incrementor++
        })
      }


    render() {

      const representAvgz = (element) => {
        try {
        parseInt(this.state.caliculations[element].summary["Home Average Energy Efficiency"].toString().split("%")[0])
        } catch(err) {
          return 0
        }
      }

      const handleOneData = (index, elem) => {
        try {
          return index.user[elem]
        } catch {
          return "no info"
        }
      }


      const representDatUser = (data, datav) => {
        try {
          return this.state.caliculations[data].user[datav]
        } catch (error) {
          return "unkown"
        }
      }
      const represntatives = Object.keys(this.state.caliculations).map(element => {
        return {
          id: Object.keys(this.state.caliculations).indexOf(element),
          display:  (
            <div className="oneDataEl" id={Object.keys(this.state.caliculations).indexOf(element)}>
                <React.Fragment>
                
                <div className="oneSTarcture">
                
                <ul className="list-group" >
                     <li className="list-group-item active">User Information</li>
                      <li className="list-group-item">Made By  <span className="endz">{representDatUser(element ,`username`)}</span></li>
                      <li className="list-group-item">Location  <span className="endz">{ representDatUser(element ,`location`)}</span></li>
                  </ul>
                </div>
      
                 <div className="oneSTarcture">

                  <ul className="list-group" >
                       <li className="list-group-item active">Calicualtion Summary</li>                      
                      <li className="list-group-item">AVG Energy Efficicency  <span className="endz">{this.state.caliculations[element].summary["Home Average Energy Efficiency"]}</span></li>
                      <li className="list-group-item">Total Energy Consumed  <span className="endz">{this.state.caliculations[element].summary["Home Total Energy Usage"]}</span></li>
                      <li className="list-group-item">Total Energy Cost  <span className="endz">{this.state.caliculations[element].summary["Energy Cost"]}</span></li>
                  </ul>

                </div>
      
                <div className="applianceszz">
                <h1 className="resHead">All caliculations </h1>
                  
                <table className={ representAvgz(element) > 54 ? "table  table-striped" : "table table-striped" }>
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
                          <main>

                          <div id={Object.values(this.state.caliculationz).indexOf(oneDate)} className="OneTable" key={Object.values(this.state.caliculationz).indexOf(oneDate)}>
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
                             <td>{handleOneData(oneDate[elem], "username")}</td>
                             <td>{handleOneData(oneDate[elem], "location")}</td>
                             <td>{oneDate[elem].data.length}</td>
                             <td>{parseFloat(oneDate[elem].summary["Home Average Energy Efficiency"]).toFixed(2)}</td>
                             <td className="linkClick" onClick={() => viewResults( Object.values(this.state.caliculations).indexOf((oneDate)[elem]), represntatives)}>View Results</td>
                             </tr>
                          ))}
              
                          </tbody>
                          </table>
                          </div>
                          <button className="btn btn-link" style={{float: "right"}} onClick={() => this.worker(document.getElementById(Object.values(this.state.caliculationz).indexOf(oneDate)))} >Download this data</button>
                          
                          </main>
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
                                  top: '10%',
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
                               <div className="closeMod sticky-top" onClick={() => {
                                let oldModal = this.state.openModal
                                this.setState({
                                  openModal: !oldModal
                                })
                                   }}>
                                      +
                                 </div>
                                <main id="main">
                                {this.state.currentPresent}
                                   


                                </main>

                                <button className="viewAll" onClick={()  =>  {
                                  window.location.href = "#main"
                                  window.print()
                                  this.worker(document.querySelector("#main"))
                                }}>Print This Data</button>
                                <button className="viewAll" onClick={() => this.worker(document.querySelector("#main"))}>DownLoad This Data </button>


                              </Modal>

                        
                        </div>
                    </div>

                </div>
                
            </React.Fragment>
        : <div className="fofo">Loading Info.... </div> }
            </Fragment>  
          )
    }
}


export default Admin