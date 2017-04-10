import React from 'react'

function CharacterStats(props) {
    var { hp, weaponName, power, maxHp , experience, level } = props.stats;
    return (
        <div className="charDisplay">
            <div className='charHp' > Max Health: {maxHp}  level: {level} experience: {experience}</div>
            <div className="weaponInfo"> Weapon: {weaponName} Attack Power: {power}</div>
        </div>

    )
}

export default CharacterStats;
