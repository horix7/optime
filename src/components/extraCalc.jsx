import React, {Component, Fragment} from 'react'

class InitialForm extends Component {

    state = {
        formInfo: {
            input: 0,
            output: 0
        },

        efficiency: 0
    }

    handleInputChange = (e) => {
        let oldState = {...this.state}
        oldState.formInfo[e.target.id] = e.target.value
        let efficiency = oldState.formInfo.input / oldState.formInfo.output
        this.setState({
            formInfo: oldState.formInfo,
            efficiency: efficiency * 100
        })

     }

    render() {
        return (
            <Fragment>
            {/* <div className="mainForm"> */}
                <div className="oneEEform">
                    <div className="miaTwo">
                    <label htmlFor="input"> Energy Input</label>

                    <div className="twoInfoz">
                    <input type="number"  onChange={this.handleInputChange}  id="input" className="numIputUni"/>
                    <span>KW/H</span>
                    </div>
                    </div>

                    <div className="miaTwo">
                    <label htmlFor="output"> Energy Output</label>
                    <div className="twoInfoz">
                    <input type="number" onChange={this.handleInputChange}  id="output" className="numIputUni"/>
                    <span>KW/H</span>
                    </div>               
                    </div>
                    {/* <button className="checkResultz">Caliculate</button> */}
                    <div className="viewRezzults">
                        {this.state.efficiency > 100 ? 100.00 : parseInt(this.state.efficiency).toString() == "NaN" ? 0 : this.state.efficiency.toFixed(2)} %
                    </div>
                    </div>               
              
            {/* </div> */}
        </Fragment>
   
        )
    }
}


export default InitialForm