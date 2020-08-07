import React, {Component, Fragment} from 'react'
import electricityCost from "../electricityCost.json"


class InitialForm extends Component {

    state = {
        formInfo: {
            cost: null,
            country: null,
            countryCost: null,
            durationz: 744
        },
        durationz: {
            "Monthly": 744,
            "Annually":8766,
            "Daily": 24
        }
    }

    handleInputChange = (e) => {
        this.state.formInfo[e.target.id] = e.target.value
        this.props.changeInitials(this.state.formInfo)

        
     }

     selectChangeHandler = (e) => {
         let oldState = {...this.state.formInfo}
        let currentValue = e.target.value.toString().split("++")
        let country = currentValue[0]
        let countryCost = currentValue[1]

        oldState.country = country
        oldState.countryCost = countryCost

        this.setState({
            formInfo: oldState
        })

        this.props.changeInitials(oldState)
    

     }
  

    render() {
        return (
            <Fragment>
            <div className="">
               
               <div className="oneForm11">
               <div className="oneForm">
                <label htmlFor="cost">Electricity Cost In USD</label>
                <input type="text" className="uniqueInput" onChange={this.handleInputChange} id="cost" />
                </div>

                <select name="duration" id="durationz" onChange={this.handleInputChange}>
                    {Object.keys(this.state.durationz).map(elem => (
                        <option value={this.state.durationz[elem]} key={this.state.durationz[elem]}>{elem}</option>
                    ))}
                </select>
               </div>

                <div className="oneForm12">
                <div className="oneForm">
                <label htmlFor="cost">Select Your Location </label>
                {/* <input type="text" className="uniqueInput" id="cost" /> */}
                </div>

                <select name="countriesCost" id="electricity" onChange={this.selectChangeHandler}>
                    <option> Choose Country </option>
                {electricityCost.map(elem => (
                        <option value={elem.country + "++" + elem.value} key={elem.country}>{elem.country}</option>
                    ))}
                </select>
                </div>
            </div>
        </Fragment>
   
        )
    }
}


export default InitialForm