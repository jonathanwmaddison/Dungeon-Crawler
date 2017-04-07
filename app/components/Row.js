import React from 'react'
import uuid from 'uuid'
import Section from './section'
import styles from '../styles/styles.css'

function Row(props) {
    const { row, height, enemies, characterLocation, gameStatus } = props;
    return (
     <div className="row">
        {row.map((section, index)=> <Section gameStatus = { gameStatus } key = { uuid() }data= { props } identifier={section} enemies={enemies.filter((enemy)=>enemy[1]===index)} latitude={index} /> ) }
     </div>
    )
}

export default Row;
