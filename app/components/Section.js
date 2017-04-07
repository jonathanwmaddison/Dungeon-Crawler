import React, { Component } from 'react'

function Section (props) {
    const { data, enemies, gameStatus, latitude, identifier } = props;
    const { characterLocation, height } = data;
    if (identifier === 3 && !gameStatus.status) {
        var button = <button onClick={gameStatus.onClick}>RIP Reset</button>
    }   else { button= "" }
    if(identifier===3) {
        var character = "character";
    } else { character = ""
    }
   var distance = 4
   //Generate visibility around character
    if(distance <= 4) {
       var visibility = " visible" 
    } else if (distance > 4) {
        visibility = " semi-visible"
    }
    return (
        <div className={"tile"+identifier + " "+character}>
            <div className={visibility}> {button} </div>
        </div>
    )

}

export default Section;
