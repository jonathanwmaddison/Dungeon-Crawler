import React from 'react'
import uuid from 'uuid'
import Section from './section'
import styles from '../styles/styles.css'

function Row(props) {
    const { row, height, enemies, characterLocation, gameStatus, characterStats, type } = props;
    return (
     <div className="row">
        {row.map((section, index)=> <Section type = {type} gameStatus = { gameStatus } key = { uuid() } characterStats = { characterStats } data= { props } identifier={section} enemies={ enemies } latitude={index} /> ) }
     </div>
    )
}

export default Row;
