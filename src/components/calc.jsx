import React, {Component} from "react"
import axios from "axios"
import Aappliances from '../appliances.json'
import Modal from "react-modal"
import Results from './results'
import IForm from './initialForm'
import ExtraCalc from './extraCalc'
import html2pdf from  'html2pdf.js'

Modal.setAppElement("#root")

let  zata;
try  {
   zata = JSON.parse(localStorage.unsaved)
}catch {
 zata = []

}


class Calc extends Component {
  

    state = {
      calInfo: {
        appliance: null,
        from: null,
        to: null,
        hours: null,
        type: null,
        output: null,
        COST: 0
      },
      oneCurrent: false,
      totalAcTime:  zata.totalAcTime || [],
      typeCurrent: null,
      current: null,
      appliances: zata.data || [],
      other: true,
      fetch: false,
      appli: [],
      results: {
        "Home Total Energy Usage": 0,
        "Home Average Energy Efficiency": 0,
        "Energy Cost": 0
      },
      openModal: false,
      initialInput: {}
    }

    changeCurrentFrom = () => {
      let oldState = {...this.state}
      this.setState({
        oneCurrent: !oldState.oneCurrent
      })
    }

    worker = (element) =>  html2pdf().from(element).save()

    updateInitialForm = (parssed) => {

      this.setState({
        initialInput: {...parssed}
      })

    }

    componentDidMount() {
      this.getAppliances()
    }


    convertMoneyToWatt = (totalWatt) => {
      try{
      
        let oldAppliances =[...this.state.appliances]
        let averageEffiency = oldAppliances.map(n => parseFloat(n.output.toString().split("kw/h")[0])).reduce((a,b) => a + b)  / oldAppliances.length
        let dividCost = this.state.initialInput.countryCost / averageEffiency
        let cost = parseFloat(this.state.initialInput.countryCost) * parseFloat(totalWatt)
        let input  = this.state.initialInput.cost / dividCost
        
        return {
          input: input *  this.state.initialInput.durationz,
          totalCost: cost
        }
      }catch(err) {
        alert("please fill in all required fields")
        
        return  {
          input: 0,
          totalCost: 0
        }
      }
    }
    

    generateRezults = () => {
try {
  let oldAppliances =[...this.state.appliances]
  let totalPeriod =oldAppliances.map(n => n.duration).reduce((a,b) => a + b)
  let usedWatt = oldAppliances.map(n => parseInt(n.powerUsage)).reduce((a,b) => a + b)
  let averageEffiency = oldAppliances.map(n => parseFloat(n.output.toString().split("kw/h")[0])).reduce((a,b) => a + b)
  
  let allHH = this.state.totalAcTime.length * this.state.initialInput.durationz
  

  let totalAcTime = this.state.totalAcTime.map(n => parseFloat(n)).reduce((a,b) => a + b) / this.state.totalAcTime.length
  totalAcTime = totalAcTime * allHH
  
  let ouputAv = averageEffiency * totalAcTime

  let dataAvggz = this.convertMoneyToWatt(averageEffiency)


  let efficiency =   parseInt(ouputAv) / parseInt(dataAvggz.input) 
  efficiency = efficiency * 100

  
  return {
    "Home Total Energy Usage": usedWatt,
    "Home Average Energy Efficiency": efficiency,
    "Energy Cost": dataAvggz.totalCost
  }

} catch(err) {
  console.error(err)
  alert("You Have Zero Caliculation Made")

}


    }


    checkUser = () => {
      if(localStorage.userInfo  && localStorage.userInfo !== "null") {
        return 
      } else {
        const name = prompt("FIRST TIME USER \nProvide Your Name to continue")
        const location = prompt("FIRST TIME USER \nProvide Your location (Country) to Make caliculation")

        if(name == null || location == null) {
          this.checkUser()
        }else  if(name.split(' ').join('').length > 1 && location.split(' ').join('').length  > 1) {
        localStorage.setItem("userInfo", JSON.stringify({username: name, location: location}))
       }else {
        this.checkUser()

       }

      }
    }

    getAppliances = () => {


      axios({
        method: 'get',
        url:"https://optim-calc.firebaseio.com/apliances/-ME8iUsYmHnlonCZh5nG.json",
        })
       .then(results => {
         let DAta = Object.values(results.data)
        let headds = [...new Set(DAta.map(n => n["CATEGORY"]))]
        let newData = []
         
        headds.forEach(n => {

        let newObj = DAta.filter(k => k["CATEGORY"] == n).map(x => {
          return {
            appliance: x["DETAIL"],
            output: x["OUTPUT"],
            cost: x["COST"]
          }
        })

         let addObj= [n, ...newObj]
        
        newData.push(addObj)

      })
      this.setState({
        appli: newData
      })
       })
       .catch(err => {
        let headds = [...new Set(Aappliances.map(n => n["CATEGORY"]))]
        let newData = []
         
        headds.forEach(n => {

        let newObj = Aappliances.filter(k => k["CATEGORY"] == n).map(x => {
          return {
            appliance: x["DETAIL"],
            output: x["OUTPUT"],
            cost: x["COST"]
          }
        })

         let addObj= [n, ...newObj]
        
        newData.push(addObj)

      })
      this.setState({
        appli: newData
      })
      

       })
        
    }

    caliculateEfficiency = () => {
      let hours =  new Date(this.state.calInfo.to).getTime() -  new Date(this.state.calInfo.from).getTime()
      const rationUsage = this.state.calInfo.hours / 24
      hours = hours / 3600000
      let allHours = hours * rationUsage
      const inputEnergy = parseFloat(this.state.calInfo.output.split("kWh")[0])
      let powerUsage = allHours * inputEnergy

      let allPower = inputEnergy * hours

      let getMoney = (element) => {
       if(typeof element == "string") {
        element.split(' ').forEach(n => {
          let somee = n.split('').some(x => x == "$")
          if(somee) {
            return n
          }else {
            return 0
          }
        })
       } else {
         return 0
       }
      }

      let oldSStat = [...this.state.totalAcTime]
      oldSStat.push(rationUsage)

      this.setState({
        totalAcTime: oldSStat
      })
      return {
        appliance: this.state.current,
        output: parseFloat(inputEnergy).toFixed(2).toString() + " "+"kw/h",
        powerUsage: parseFloat(powerUsage).toFixed(2),
        duration: allHours
      }
      

      
    }




    addCaliculations = () => {
          this.setState({
            fetch: true
          })

          document.querySelectorAll("input").forEach(n => n.value = null)
          this.setState({
            fetch: false
          })

          document.getElementById("8times").click()

    }


    openSecondModal = () => {
      let oldModal = this.state.openModal2
      this.setState({
        openModal2: !oldModal
      })

    }

    addDatabase = () => {
      if(Object.keys(this.state.initialInput).length === 4 && Object.values(this.state.initialInput).every(n => n !== null )) {
        
      let dateSplit = new Date().toString().split(" ")
      let userIInfo;
      try {
         userIInfo = JSON.parse(localStorage.userInfo)
      } catch (err) {
        userIInfo = "null"
      }


      if(localStorage.userInfo == "null") {
        userIInfo = { username: "anonymous", location: "Unavailable"}
      }

      this.setState({
        fetch: true,
        results: this.generateRezults()
      })

      if(this.state.appliances.length > 0) {
        
      axios({
        method: 'post',
        url:"https://optim-calc.firebaseio.com/apliances/caliculations.json",

        data: {
          user: userIInfo,
          date: [dateSplit[1], dateSplit[2], dateSplit[3] ].join(" "),
          data: this.state.appliances,
          summary: this.generateRezults()
        },
        headers: {'Content-Type': "application/json" }
        })
        .then(response => {
          
          let oldModal = this.state.openModal

          this.setState({
            openModal: !oldModal,
            fetch: false
          })

          setTimeout(() => {
            this.openSecondModal()
          }, 1500);
  
        }).catch(err => {
          localStorage.setItem("unsaved", JSON.stringify({
            date: [ dateSplit[1], dateSplit[2], dateSplit[3] ].join(" "),
            data: this.state.appliances,
            totalAcTime: this.state.totalAcTime
          }))

          alert("Something Went Wrong \nMake Sure Your Internet Is On")
          let oldModal = this.state.openModal

          this.setState({
            openModal: !oldModal,
            fetch: false
          })

          setTimeout(() => {
            this.openSecondModal()
          }, 1500);

        })
      }else {
       setTimeout(() => {
        this.setState({
          fetch: false
        })
       }, 1000);
      }
   
      } else {
        alert("Please Choose Your Country and your Electricity Cost")
      }
     }

    addMoreAppl = () => {

      let newCalInfo = {
        appliance: this.state.calInfo.appliance,
        from: null,
        to: null,
        hours: null,
        type: this.state.calInfo.type,
        output: this.state.calInfo.output
      }

      if(this.state.other) {
        
       newCalInfo = {
        appliance: null,
        from: null,
        to: null,
        hours: null,
        type: this.state.calInfo.type,
        output: null
      }
      }
      let nullFields = []
      let typez = false

      if(Object.values(this.state.calInfo).some(n => n == null)) {
        Object.keys(this.state.calInfo).forEach(n => {
          if(this.state.calInfo[n] == null) {
            if(n == "type") {
              typez = true
            }  else if(this.state.other) {
              if(n !== "appliance" || n !== "output") {
                nullFields.push(n)
              }
            }else {
              nullFields.push(n)
            }
          }
        })

        try {
          nullFields.forEach(n => document.getElementById(n).style.border = "1px solid red")
          if(typez) 
            document.querySelectorAll("#type").forEach(n => n.style.border = "1px solid red" )
          
        } catch (err) {

          if(nullFields.some(n => n == "appliance" || n == "output")) {
            nullFields.filter(n => n !== "appliance" || n !== "output" || n !== null).forEach(n => document.getElementById(n).style.border = "1px solid red")
          }else {
            nullFields.forEach(n => document.getElementById(n).style.border = "1px solid red")
          }
          if(typez) 
            document.querySelectorAll("#type").forEach(n => n.style.border = "1px solid red" )


        }
        setTimeout(() => {
          try {
            nullFields.forEach(n => document.getElementById(n).style.border = "1px solid grey")
            document.querySelectorAll("#type").forEach(n => n.style.border = "1px solid grey" )
          } catch(err) {
            console.log("error handled")
          }
        }, 3000);

      } else {
        // this.addCaliculations()
        let oldState = this.state
        let calInfo = this.caliculateEfficiency()
        let appliance = this.state.appliances

        
        appliance.push(calInfo)
  
      this.setState({
        calInfo: {...newCalInfo},
        appliances: appliance
      })

      document.querySelectorAll("input").forEach(n => n.value = null)
      this.addCaliculations()
      }
    
}


    handleInputChange = (e) => {
      this.state.calInfo[e.target.id] = e.target.value
      if(e.target.id == "appliance") {
        this.setState({
          current:e.target.value
        })
      }
   }

   updateRadio = (radio) => {
      this.state.calInfo.type = radio
   }
    render() {
        
 return ( <React.Fragment>


<div className="mainFormAll">
  
<div className="form2-holder">

<div className="mainForm">
<div className="form-check form-switch ttwoz">
<label className="form-check-label" htmlFor="flexSwitchCheckDefault">one appliance (EEOC)</label>
  <input className="form-check-input" onChange={this.changeCurrentFrom} type="checkbox" id="flexSwitchCheckDefault"/>
</div>
  {/* <h3 className="" style={{textTransform: "uppercase",fontSize: "medium", textAlign: "start", paddingTop:"10px", paddingBottom:"15px",fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"}}>Caliculate Your Home Appliance Energy Effiecieny</h3> */}
{this.state.oneCurrent ?  <ExtraCalc /> :<div className="calculated">
    {this.state.appliances.length > 0 ? 
      <table className="table">
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">Appliances</th>
          <th scope="col">Input</th>
        </tr>
      </thead>
      <tbody>

      {this.state.appliances.map(n => (
         <tr key={this.state.appliances.indexOf(n)}>
          <th scope="row">{this.state.appliances.indexOf(n) + 1}</th>
          <td>{n.appliance}</td>
         <td>{n.output}</td>
        </tr>
      ))}
       
      
      </tbody>
    </table>
   : null}
   
  </div>
}
{this.state.oneCurrent ?  null :<div className="maiholder">
<IForm changeInitials={(info) => this.updateInitialForm(info)} />
<div className="formHH">

<select className="uniqueSel" required  onChange={() => {
  
  if(document.querySelector("#appliancezz").value == "other" || document.querySelector("#appliancezz").value == "undefined++undefined" || document.querySelector("#appliancezz").value == "Select An Appliance") {
  
    this.setState({
      current: null,
      other: true
    })
  } else {

    this.state.calInfo["appliance"] = document.querySelector("#appliancezz").value.split("++")[0]
    this.state.calInfo["output"] = document.querySelector("#appliancezz").value.split("++")[1]
    this.setState({
      current: document.querySelector("#appliancezz").value.split("++")[0],
      other: false
    })
  }

}} id="appliancezz" name="country">
  <option value="other">Select An Appliance</option>
  {this.state.appli.map(x => {
    let newX = x[0]
    let newxx =  [...x]
    newxx.shift()
   
    return (
      <optgroup key={this.state.appli.indexOf(x)} label={newX}>
        {newxx.map(n => (<option key={x.indexOf(n) + n.appliance}   value={n.appliance + "++" + n.output + "++" + n.cost} output={n.output}>{n.appliance}</option>))}
      </optgroup>
    )
  })}
  <option value="other">Other</option>
</select>
</div>

<div className="space-up">
  <button onClick={this.checkUser} type="button" className="btnn21" data-toggle="modal" data-target="#staticBackdrop">
  caliculate
</button>

</div>

            
<div className="modal fade" id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="staticBackdropLabel">{this.state.current ? this.state.current : "Other Appliance"} </h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <form>

   {this.state.other ? <React.Fragment>
     <div className="input-group mb-3">
<span className="input-group-text" id="basic-addon1">appliance name</span>
<input onChange={this.handleInputChange} type="text" className="form-control" placeholder=""  id="appliance" aria-label="Apppliance" aria-describedby="basic-addon1"  />
</div>

<div className="input-group mb-3">
<span className="input-group-text" id="basic-addon1">Output Energy</span>
<input onChange={this.handleInputChange} type="number" className="form-control" placeholder="" aria-label="Apppliance" aria-describedby="basic-addon1" id="output"  />
<span className="input-group-text" id="basic-addon1">kw/h</span>

</div> </React.Fragment>  : null}

<p className="starts">Duration Usage</p>

<div className="div-two">
<div className="input-group mb-3">
    <span className="input-group-text" id="basic-addon1">from</span>
    <input onChange={this.handleInputChange} required  type="date" className="form-control" id="from"  aria-label="from" aria-describedby="basic-addon1" />
</div>

<div className="input-group mb-3">
    <span className="input-group-text" id="basic-addon1">to</span>
    <input onChange={this.handleInputChange} required  type="date" className="form-control" placeholder="to" aria-label="to" aria-describedby="basic-addon1" id="to" />
</div>
</div>

<div className="input-group mb-3">
<span className="input-group-text" id="basic-addon1">daily running hours</span>
<input onChange={this.handleInputChange} type="number" className="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1" id="hours"  />
<span className="input-group-text" id="basic-addon1">h</span>

</div>

<p className="starts">Effiecieny ClassName</p>
<div className="radios-end">
<div className="form-check">
    <input onChange={() => this.updateRadio("A-B")} required  className="form-check-input" type="radio" id="type" name="flexRadioDefault"/>
    <label className="form-check-label" htmlFor="flexRadioDefault1">
      A-B
    </label>
  </div>
  <div className="form-check">
    <input onChange={() => this.updateRadio("C-D")} required  className="form-check-input" type="radio" id="type" name="flexRadioDefault" />
    <label className="form-check-label" htmlFor="flexRadioDefault2">
      C-D
    </label>
  </div>
  <div className="form-check">
    <input onChange={() => this.updateRadio("E-F")} required  className="form-check-input" type="radio" id="type" name="flexRadioDefault"  />
    <label className="form-check-label" htmlFor="flexRadioDefault2">
      E-F
    </label>
  </div>
</div>
</form>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal" id="8times">Close</button>
        {!this.state.fetch ? <button  type="subbmit" className="btn btn-primary" onClick={this.addMoreAppl}>continue</button> : <button className="btn btn-primary" type="button" disabled>
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          caliculating...
        </button> }
      </div>
    </div>
  </div>
</div>

</div>
}
</div>
{this.state.oneCurrent ? null :<div className="alignEnd">
{!this.state.fetch ? <div className="twoss"> <i className="fas fa-redo" onClick={() => this.setState({
  appliances: [],
  totalAcTime: []
})}></i>   <button className="btnn22" onClick={() => this.addDatabase() }> View Results </button>   </div>: <div className="paddingTop">  <div className="d-flex justify-content-center"> <div className="spinner-border" role="status">  <span className="sr-only">Loading...</span> </div> </div> </div> }
</div> 
}
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
    top: '2%',
    left: '2%',
    right: '2%',
    bottom: '2%',
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

  <Modal 
  style={{
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.54)'
  },
  content: {
      position: 'absolute',
      top: '10%',
      left: '10%',
      right: '10%',
      bottom: '10%',
      border: "none",
      background: 'transparent',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '5px',
      outline: 'none',
      padding: '10px'
  }
  }}
  
  isOpen={this.state.openModal2} onRequestClose={() => {
    let oldModal = this.state.openModal2
    this.setState({
      openModal2: !oldModal
    })
  }}
  >

<div class="messagge">
{parseInt(this.state.results["Home Average Energy Efficiency"]) > 50 ?  
  <p className="message">
  Congratulations, your home efficiency is above average. 
  Your home and appliance usage is 
   <span> ( {this.state.results["Home Average Energy Efficiency"].toFixed(2)} %) </span> 
   efficient.

      <br/>
      <br/>
    consult an Energy efficiency expert to improve your energt usage and save more money    
    <br/>
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSdSTD62wTRLN-whZseKmTWQ3llIY0zDAbEWA2P6e6ScaAqi9g/viewform" style={{color:"blue", textDecoration:"underline"}} target="blank" > contact us </a>
    </p>
  
: 
<p className="message2">

Your home and appliance efficiency is 
<span> ({this.state.results["Home Average Energy Efficiency"].toFixed(2)} %) </span>  
 below average . We can help you in making your home and appliance usage more efficient. 

<br/>
<br/>

  consult an Energy efficiency expert to improve your energt usage and save more money 
<br/>
<a href="https://docs.google.com/forms/d/e/1FAIpQLSdSTD62wTRLN-whZseKmTWQ3llIY0zDAbEWA2P6e6ScaAqi9g/viewform" style={{color:"blue", textDecoration:"underline"}}  target="blank" > contact us </a>
  </p>

}
<button className="mesbtn"  onClick={() => {
    let oldModal = this.state.openModal2
    this.setState({
      openModal2: !oldModal
    })
  }}>
  close
</button>
</div>



  </Modal>


  {this.state.openModal && this.state.appliances.length > 0 ? <Results download={(elem) => this.worker(elem)} appliances={this.state.appliances} results={this.state.results} /> : <h1> No Caliculations Made </h1>}

</Modal>


</div>
</div>

        </React.Fragment>)
    }

}

export default Calc