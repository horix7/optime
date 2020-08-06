import React from 'react'

let rresults = props => {

    console.log(props)
    return (
        <React.Fragment>

            <div className="ResultsHeading">
                <h1 className="resHead">Your Home Energy Effiency Results</h1>
                <div className="summary">

                    <table className="table">
                    <thead>
                        <tr>
                        {/* <th scope="col">#</th> */}
                        <th scope="col">AVG Energy Efficiency</th>
                        <th scope="col">AVG Energy Consumption</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr>
                        {/* <th scope="row">{props..indexOf(n) + 1}</th> */}
                        <td>{props.results["Average Energy Efficiency"]} %</td>
                        <td>{props.results["Total Energy Usage"]} watt</td>
                        </tr>
                    
                    
                    </tbody>
                    </table>
                          
              </div>
            
            </div>
            <div className="hiddenData">
                <div className="allData">
                    
                    {props.appliances.map(el => (
                        <div className="oneAppl">

                        <h1 className="resHead">
                            {el.appliance}
                        </h1>
                        <table className="table table-secondary1">
                        <thead>
                            <tr>
                            <th scope="col">Info</th>
                            <th scope="col" style={{textAlign:"end"}}>Results</th>
                            </tr>
                        </thead>
                        <tbody>
    
                           {Object.keys(el).map(m => (
                                <tr>
                                <td>{m == "output" ? "output" : m}</td>
                                <td style={{textAlign:"end"}}>{parseInt(el[m]) == el[m] ? el[m] + " " +"watt": el[m]}</td>
                                </tr>
                           ))}
                        

                        </tbody>
                        </table>
                        </div>

                    ))}

                </div>
            </div>
            <button className="viewAll">View All</button>
            <button className="viewAll">DownLoad Results </button>




        </React.Fragment>
    )
}

export default rresults;

