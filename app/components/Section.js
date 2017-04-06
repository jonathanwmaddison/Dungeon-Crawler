import React, { Component } from 'react'

function Section (props) {
    const { data, enemies, latitude, identifier } = props;
    const { characterLocation, height } = data;
    var rowLength = 5;
    var distance = Math.pow(Math.pow(characterLocation[0]-height, 2) + Math.pow(characterLocation[1]-latitude, 2), .5)
    //Generate visibility around character
    if(distance <= 4) {
       var visibility = " visible" 
    } else if (distance > 4 && distance < 8) {
        visibility = " semi-visible"
    } else { 
        visibility = " invisible" 
    }
    var beginningOfRow = (latitude/rowLength)%rowLength === 0 ? "beginning" : "not";
    return (
        <div className={"tile"+identifier}>
            <div className={visibility}></div>
        </div>
    )

}

export default Section;
