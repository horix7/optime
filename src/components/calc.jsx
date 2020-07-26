import React, {Component} from "react"
import axios from "axios"


class Calc extends Component {
  
    state = {
      calInfo: {
        appliance: null,
        from: null,
        to: null,
        hours: null,
        type: "C-D",
        output: null
      },
      current: null,
      appliances: [],
      other: true,
      fetch: false,
      appli: []
    }


    componentDidMount() {
      this.getAppliances()
    }

    getAppliances = () => {

      axios({
        method: 'get',
        url:"https://optim-calc.firebaseio.com/apliances/-MDBC0Pnv7uc4pUXx8Vg.json",
        })
        .then( (response) => {
          let headds = [...new Set(response.data.map(n => n["CATEGORY"]))]
          let newData = []
          headds.forEach(n => {
           
            let newObj = response.data.filter(k => k["CATEGORY"] == n).map(x => {
              return {
                appliance: x["DETAIL"],
                output: x["OUTPUT"]
              }
            })

             let addObj= [n, ...newObj]
            
            newData.push(addObj)

          })
          this.setState({
            appli: newData
          })

          console.log(response.data, newData, headds)
        })
        .catch( () => {
          alert("An Error Have Occured")
        })
    }

    addCaliculations = () => {
      this.setState({
        fetch: true
      })
      axios({
        method: 'post',
        url:"https://optim-calc.firebaseio.com/apliances/g1WBpIy0wYzFV3nUqbXq.json",

        data: this.state.calInfo,
        headers: {'Content-Type': "application/json" }
        })
        .then(response => {
          this.setState({
            fetch: false
          })
              document.getElementById("8times").click()
        }).catch(err => {
          this.setState({
            fetch: false
          })
          alert("An Error Has Occured ")
        })
    }

    addMoreAppl = () => {
      const newCalInfo = {
        appliance: null,
        from: null,
        to: null,
        hours: null,
        type: "C-D",
        output: null
      }
      let nullFields = []

      if(Object.values(this.state.calInfo).some(n => n == null)) {
        Object.keys(this.state.calInfo).forEach(n => {
          if(this.state.calInfo[n] == null) {
            if(this.state.other) {
              if(n !== "appliance" || n !== "output") {
                nullFields.push(n)
              }
            }else {
              nullFields.push(n)
            }
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
        let calInfo = {...oldState.calInfo}
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


  if(document.querySelector("#appliancezz").value == "other" || document.querySelector("#appliancezz").value == "Select An Appliance") {
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
    x.shift()
    
    return (
      <optgroup label={newX}>
        {x.map(n => (<option key={this.state.appli.indexOf(n)}   value={n.appliance + "++" + n.output} output={n.output}>{n.appliance}</option>))}
      </optgroup>
    )
  })}
  <option value="other">Other</option>
</select>
<div className="space-up">
  <button type="button" className="btnn21" data-toggle="modal" data-target="#staticBackdrop">
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
    <input onChange={() => this.updateRadio("A-B")} required  className="form-check-input" type="radio" name="flexRadioDefault"/>
    <label className="form-check-label" htmlFor="flexRadioDefault1">
      A-B
    </label>
  </div>
  <div className="form-check">
    <input onChange={() => this.updateRadio("C-D")} required  className="form-check-input" type="radio" name="flexRadioDefault" />
    <label className="form-check-label" htmlFor="flexRadioDefault2">
      C-D
    </label>
  </div>
  <div className="form-check">
    <input onChange={() => this.updateRadio("E-F")} required  className="form-check-input" type="radio" name="flexRadioDefault"  />
    <label className="form-check-label" htmlFor="flexRadioDefault2">
      E-F
    </label>
  </div>
</div>
</form>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal" id="8times">Close</button>
        {!this.state.fetch ? <button  type="button" className="btn btn-primary" onClick={this.addMoreAppl}>continue</button> : <button className="btn btn-primary" type="button" disabled>
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          caliculating...
        </button> }
      </div>
    </div>
  </div>
</div>

</div>
</div>
<button  className="btnn22">View Results</button>

</div>
</div>

        </React.Fragment>)
    }

}

export default Calc