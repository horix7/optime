import React, {Component} from "react"
import axios from "axios"
import Aappliances from '../appliances.json'
import Modal from "react-modal"
import Results from './results'
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
      typeCurrent: null,
      current: null,
      appliances: [],
      other: true,
      fetch: false,
      appli: [],
      results: null,
      openModal: false
    }



    componentDidMount() {
      this.getAppliances()
    }

    

    generateRezults = () => {
try {
  
  let oldAppliances =[...this.state.appliances]
  let usedWatt = oldAppliances.map(n => n.powerUsage).reduce((a,b) => a + b)
  let averageEffiency = oldAppliances.map(n => n.output !== "NaN%" ? parseFloat(n.output.toString().split("%")[0]) : 0).reduce((a,b) => a + b) / oldAppliances.length

  return {
    "Total Energy Usage": usedWatt,
    "Home Average Energy Efficiency": averageEffiency,
    "Home Energy Cost": 0 
  }
} catch(err) {
  console.log(err)
  alert("You Have Zero Caliculation Made")

}


    }


    checkUser = () => {
      if(localStorage.userInfo  && localStorage.userInfo !== "null") {
        return 
      } else {
        const name = prompt("FIRST TIME USER \nProvide Your Name to continue")
        const location = prompt("FIRST TIME USER \nProvide Your location (Country) to Make caliculation")

       if(name !== "" && location !== "") {
        localStorage.setItem("userInfo", JSON.stringify({username: name, location: location}))
       }

      }
    }

    getAppliances = () => {


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


        
    }

    caliculateEfficiency = () => {
      const hours =  new Date(this.state.calInfo.to).getTime() -  new Date(this.state.calInfo.from).getTime()
      const rationUsage = this.state.calInfo.hours / 24
      let allHours = hours * rationUsage
      const inputEnergy = parseFloat(this.state.calInfo.output.split("kWh")[0])
      let powerUsage = allHours * inputEnergy

      let allPower = inputEnergy * hours

      let Effieciency = (powerUsage / allPower) * 100

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

      console.log(getMoney(this.state.calInfo.COST))

      let calcEff;

      if(this.state.calInfo.type == "A-B") {
        calcEff = 0.72
      }else if (this.state.calInfo.type == "D-C")  {
        calcEff = 0.72 * 2
      }else if (this.state.calInfo.type == "E-F")  {
        calcEff = 0.72 * 3
      }


      return {
        appliance: this.state.current,
        output: (Effieciency * calcEff) + "%",
        powerUsage: allPower - powerUsage,
        moneyUsage: getMoney(this.state.calInfo.COST)

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

    addDatabase = () => {
      let dateSplit = new Date().toString().split(" ")

      let userIInfo = JSON.parse(localStorage.userInfo)
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
          summary: this.state.results
        },
        headers: {'Content-Type': "application/json" }
        })
        .then(response => {
          
          let oldModal = this.state.openModal

          this.setState({
            openModal: !oldModal,
            fetch: false
          })
  
        }).catch(err => {
          localStorage.setItem("unsaved", JSON.stringify({
            date: [ dateSplit[1], dateSplit[2], dateSplit[3] ].join(" "),
            data: this.state.appliances
          }))

          alert("Something Went Wrong \nMake Sure Your Internet Is On")

          this.setState({
            fetch: false
          })
        })
      }else {
       console.log("No Data")
       setTimeout(() => {
        this.setState({
          fetch: false
        })
       }, 1000);
      }
    }

    addMoreAppl = () => {

      const newCalInfo = {
        appliance: this.state.calInfo.appliance,
        from: null,
        to: null,
        hours: null,
        type: this.state.calInfo.type,
        output: this.state.calInfo.output
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
          console.log(err)
          console.log(this.state)

          if(nullFields.some(n => n == "appliance" || n == "output")) {
            nullFields.filter(n => n !== "appliance" || n !== "output" || n !== null).forEach(n => document.getElementById(n).style.border = "1px solid red")
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
        console.log("done")
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
      console.log(this.state)
      this.state.calInfo.type = radio
   }
    render() {
        
 return ( <React.Fragment>
   
<div className="mainFormAll">
<div className="form2-holder">
<div className="mainForm">
  {/* <h3 className="" style={{textTransform: "uppercase",fontSize: "medium", textAlign: "start", paddingTop:"10px", paddingBottom:"15px",fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"}}>Caliculate Your Home Appliance Energy Effiecieny</h3> */}
  <div className="calculated">
    {this.state.appliances.length > 0 ? 
      <table className="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Appliances</th>
          <th scope="col">Effieciency</th>
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

<div className="maiholder">
    
<select className="form-select" required  onChange={() => {
  this.state.calInfo["appliance"] = document.querySelector("#appliancezz").value.split("++")[0]
  this.state.calInfo["output"] = document.querySelector("#appliancezz").value.split("++")[1]
  this.state.calInfo["COST"] = document.querySelector("#appliancezz").value.split("++")[2]

console.log(document.querySelector("#appliancezz").value)

  if(document.querySelector("#appliancezz").value == "other" || document.querySelector("#appliancezz").value == "undefined++undefined" || document.querySelector("#appliancezz").value == "Select An Appliance") {
    this.setState({
      current: null,
      other: true
    })
  } else {
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
<span className="input-group-text" id="basic-addon1">current name</span>
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
</div>
<div className="alignEnd">
{!this.state.fetch ? <button className="btnn22" onClick={() => this.addDatabase() }> View Results </button> : null }
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

{this.state.openModal && this.state.appliances.length > 0 ? <Results appliances={this.state.appliances} results={this.state.results} /> : <h1> No Caliculations Made </h1>}

</Modal>


</div>
</div>

        </React.Fragment>)
    }

}

export default Calc