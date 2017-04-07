import React from 'react'

function CharacterStats(props) {
    var { hp, weaponName, power, experience, level } = props.stats;
    return (
        <div className="charDisplay">
            <div className='charHp' ><h3> Health: {hp}  level: {level} experience: {experience}</h3></div>
            <div className="weaponInfo"><h4> Weapon: {weaponName} Attack Power: {power}</h4></div>
        </div>

    )
}

export default CharacterStats;
