import React from 'react'

let rresults = props => {


    return (
        <React.Fragment>
            <main id="main">

            <div className="ResultsHeading" id="ResultsHeading">
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
                        <td>{ parseInt(props.results["Home Average Energy Efficiency"]) > 100 ? 100 : parseFloat(props.results["Home Average Energy Efficiency"]).toFixed(2)} %</td>
                        <td>{props.results["Home Total Energy Usage"]} kw</td>
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
                                <td style={{textAlign:"end"}}>{el[m]}</td>
                                </tr>
                           ))}
                        

                        </tbody>
                        </table>
                        </div>

                    ))}

                </div>
            </div>
            </main>

            <button className="viewAll" onClick={()  =>   {
                                  window.location.href = "#main"
                                  window.print()
                                  props.download(document.querySelector("main"))
                                }}>Print This Data</button>
            <button className="viewAll" onClick={() => props.download(document.querySelector("main"))}>DownLoad This Data </button>




        </React.Fragment>
    )
}

export default rresults;

