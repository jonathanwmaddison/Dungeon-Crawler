import React from 'react'

function CharacterStats(props) {
    var { hp, weaponName, power } = props.stats;
   console.log(props) 
    return (
        <div className="charDisplay">
            {hp}
            {weaponName}
            {power}
        </div>

    )
}

export default CharacterStats;
