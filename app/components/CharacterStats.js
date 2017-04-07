import React from 'react'

function CharacterStats(props) {
    var { hp, weaponName, power, experience, level } = props.stats;
    return (
        <div className="charDisplay">
            <div className='charHp' > Health: {hp}  level: {level} experience: {experience}</div>
            <div className="weaponInfo"> Weapon: {weaponName} Attack Power: {power}</div>
        </div>

    )
}

export default CharacterStats;
