import React from 'react'
import Section from './section'
import styles from '../styles/styles.css'

function Row(props) {
    const { row, height, enemies, characterLocation } = props;
    
    return (
     <div className="row">
        {row.map((section, index)=> <Section data= { props } identifier={section} enemies={enemies.filter((enemy)=>enemy[1]===index)} latitude={index} /> ) }
     </div>
    )
}

export default Row;
