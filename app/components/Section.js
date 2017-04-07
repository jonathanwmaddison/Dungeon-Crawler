import React, { Component } from 'react'

function Section (props) {
    const { data, enemies, gameStatus, latitude, identifier } = props;
    const { characterLocation, height } = data;
    if (identifier === 3 && !gameStatus.status) {
        var button = <button onClick={gameStatus.onClick}>RIP Reset</button>
    }   else { button= "" }

    var rowLength = 5;
    //var distance = Math.pow(Math.pow(characterLocation[0]-height, 2) + Math.pow(characterLocation[1]-latitude, 2), .5)
       var visibility = " visible" 
   //Generate visibility around character
    /*if(distance <= 4) {
       var visibility = " visible" 
    } else if (distance > 4 && distance < 8) {
        visibility = " semi-visible"
    } else { 
        visibility = " invisible" 
    }*/
    return (
        <div className={"tile"+identifier}>
            <div className={visibility}> {button} </div>
        </div>
    )

}

export default Section;
