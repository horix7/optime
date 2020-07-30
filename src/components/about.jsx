import React from 'react'

let about = () => {
    return (
        <React.Fragment>
            
            <div className="about-us" id="about">
            <h1 className="aboutHead">
            Energy Efficiency Online Calculator (EEOC)
            </h1>
            <h6 className="aboutSub">By Jeremiah Thoronka</h6>
            <br />
            <p>
            This Energy Efficiency Online Calculator (EEOC) is a simple tool for calculating the efficiency of a home (Ratio of useful energy output to the energy input).  This tool can be used to solve the challenges homes and industries face in identifying energy consumption per appliance. This platform aims to promote the rational use of energy in homes through the tracking of the amount of energy consumed by every equipment in homes and institutions.
            What is efficiency?
            Efficiency is defined as the ratio of energy output to energy input. Every time that you supply energy to appliances, a certain part of this energy is wasted, and only some is converted to actual work output. The more efficient the system of an appliance, the higher output it produces.

            <br />
            <br />

            <strong>How do we calculate your energy efficiency?</strong>
            <br />
            In order to calculate efficiency, we apply the following formula:
            <span className="spani">η = Eout / Ein * 100%</span>
            <br />
            <br />


            where:
            η is the efficiency (expressed as a percentage),
            Eout is the energy output (in Joules), and
            Ein is the energy input (also in Joules).
            <br />
            <br />

            The result will be a number between 0% and 100%. An efficiency equal to 0% means that all of the energy is wasted, and the energy output is equal to zero. On the other hand, an efficiency of 100% means that there is no waste of energy whatsoever. The fundamental law of energy conservation states that you cannot create energy. What follows is that the efficiency of any machine can never exceed 100%.
            </p>
            </div>
        </React.Fragment>
    )
}


export default about