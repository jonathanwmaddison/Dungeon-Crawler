import React from 'react'
import Row from './Row'

function Minimap(props){
    const { minimap } = props;
    
    return (
    <div className='minimap'>
        <h3>Minimap</h3>
        { minimap.map((row, height) =><div className='row mini'> {row.map((section, col)=> <div className={"tile"+minimap[height][col]} />) } </div> ) }
    </div>
    )
}
export default Minimap
