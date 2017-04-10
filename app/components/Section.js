import React, { Component } from 'react'

function Section (props) {
    var { data, characterStats ,enemies, gameStatus, latitude, identifier } = props;
    const { characterLocation, height } = data;
   
    if (identifier === 3 && !gameStatus.status) {
        var button = <button onClick={gameStatus.onClick}>RIP Reset</button>
    } else { button= "" }
   var percentHealthLeft; 
    if(identifier===3) {
        var  percentHealthLeft = characterStats.hp/characterStats.maxHp;
    }
    else if (identifier===5) {
        enemies = enemies.filter((enemy)=> enemy.location[0]===height && enemy.location[1] ===latitude)
        if (enemies.length===0) {
            percentHealthLeft = 1;
        } else {
            percentHealthLeft = enemies[0].hp/enemies[0].originalHp;
        }
    }
    else {
        percentHealthLeft = 1
    }
    var tileStyles = {
        width: 40*percentHealthLeft,
        height: 40*percentHealthLeft,
        margin: (40-40*percentHealthLeft)/2,
        fontSize: "10px"
    }
    return (
        <div style={tileStyles}  id = {latitude + ", " + height} className={"tile"+identifier + " "}>
            <div> {button} </div>
        </div>
    )

}

export default Section;
