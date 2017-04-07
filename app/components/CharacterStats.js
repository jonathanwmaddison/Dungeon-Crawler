import React from 'react'

function CharacterStats(props) {
    var { hp, weaponName, power } = props.stats;
    return (
        <div className="charDisplay">
            <div className='charHp' ><h3> Health: {hp} </h3></div>
            <div className="weaponInfo"><h4> Weapon: {weaponName} Attack Power: {power}</h4></div>
        </div>

    )
}

export default CharacterStats;
