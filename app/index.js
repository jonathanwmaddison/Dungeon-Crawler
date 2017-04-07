import React from 'react'
import ReactDOM from 'react-dom'
import Map from './components/Map'
/*
    Components required for this project:
        Health Bar Display
        Weapon Power Display
        Enemy Render: => State required for enemy: Health
        Map Render: Random Map generator
        Weapon Render
        Health Render
        
    State Required:
        map (includes weapons, enemies, walls, and health):
        location: 
        health:
        weapon:
    
    Functions Required:
        update health
        update weapon
        update enemy status
        move character
        generate map
        update map (when health is picked up)
        handle battle
*/


ReactDOM.render(
    <div className="container">
        <h1>Pixel Labryinth</h1>
        <Map />
    </div>,
    document.getElementById('app')
)
