import React, { Component } from 'react';
import uuid from 'uuid'

import Row from './Row'
import CharacterStats from './CharacterStats'
import Minimap from './Minimap'

class Map extends Component {
    constructor(props) {
        super(props)
        this.state = {
            map: [],
            gridHeight: 60,
            gridWidth: 60,
            numRooms: 10,
            roomDimensions: 10,
			characterLocation: [],
            enemies: [],
            weapons: [],
            health: [],
            characterStats: { hp: 100, maxHp: 100, weaponName: "blue", power: [20, 0], experience: 0, level: 1 },
            gameStatus: true,
            minimap: []
        }
    }
    generateBlankMap(){
        var map = [];
        var minimap = []
        for (var i=0; i<this.state.gridHeight; i++) {
            var row = [];
            var minirow = []
            for(var j=0; j<this.state.gridWidth; j++){
                row.push(1);
                minirow.push(1)
            }
            map.push(row);
            minimap.push(minirow)
        } 
        this.setState({
            minimap: minimap
        })

        return map;
    }
    findWalls(map) {
        const { gridHeight, gridWidth } = this.state;
        var inds = [];
        for (var i=0; i<gridHeight; i++){
            for (var j=0; j<gridWidth; j++){
                if (map[i][j] === 1){
                    inds.push([i, j])
                }
            }
        }
        return inds;
    }
    findOpenSpace(map) {
        const { gridHeight, gridWidth } = this.state;
        var inds = [];
        for (var i=0; i<gridHeight; i++){
            for (var j=0; j<gridWidth; j++){
                if (map[i][j] === 0){
                    inds.push([i, j])
                }
            }
        }
        return inds;
    }
	placeCharacter(map) {
		return this.findOpenSpace(map)[0]	
	}
    handleExperience(experience){
        var { characterStats } = this.state;
        var totalExperience = Number(characterStats.experience) + Number(experience);
        const levels = [
            {experience: 100, maxHealth: 120, power: 25},
            {experience: 200, maxHealth: 150, power: 35},
            {experience: 300, maxHealth: 210, power: 45},
            {experience: 400, maxHealth: 260, power: 60},
            {experience: 500, maxHealth: 310, power: 75},
        ];
        
        if (totalExperience >= levels[characterStats.level -1].experience) {
            //level up!
            var newLevelStats = levels[characterStats.level-1];
            var newLevel = characterStats.level + 1;
            var newExp = totalExperience - levels[characterStats.level - 1].experience;
            characterStats.level = newLevel;
            characterStats.power[0] = newLevelStats.power;
            characterStats.maxHp = newLevelStats.maxHealth;
            characterStats.hp = characterStats.maxHp
            characterStats.experience = newExp;
        } else {
            characterStats.experience = totalExperience;
        }
        this.setState({
            characterStats: characterStats
        })
    }
    pickRandomStart(){
        var [ heightStart, widthStart ] = [Math.floor(Math.random()*this.state.gridHeight),Math.floor(Math.random()*this.state.gridWidth)];
        return [heightStart, widthStart]
    }
    placeRandomEnemy(enemies, currentLocation) {
        if(Math.random() > .95) { 
            var enemy = { location: currentLocation, hp: Math.floor(Math.random()*100), type: "average", id: uuid() }
            enemy.originalHp = enemy.hp
            enemies.push(enemy)
        }
        return enemies;
    }
    placeBoss(map, enemies) {
        var openSpace = this.findOpenSpace(map)
        var bossLocation = openSpace[openSpace.length-1]
		var boss = { location: bossLocation, hp: 1000, orginalHp: 1000, type: "boss", id: uuid() }
        enemies.push(boss)
        map[boss.location[0]][boss.location[1]] = 5;
        return [ map, enemies ]
    }
    generateCorridor(roomCoordinateA, roomCoordinateB, map, enemies){
       let [ aRow, aColumn ] = roomCoordinateA;
       let [ bRow, bColumn ] = roomCoordinateB;
       let [ rowDiff, colDiff ] = [ aRow - bRow, aColumn - bColumn ]
       if (rowDiff < 0) {
            for (var i = aRow; i < rowDiff*-1+aRow; i++) {
                var enemyLength = enemies.length;
                enemies = this.placeRandomEnemy(enemies, [i,aColumn])
                if(enemyLength < enemies.length) {
                    map[i][aColumn] = 5;
                } else { 
                    map[i][aColumn] = 0;
               }
            }
       } else if(rowDiff > 0) {
            for (var i = aRow; i >= bRow; i--) {
                var enemyLength = enemies.length;
                enemies = this.placeRandomEnemy(enemies, [i,aColumn])
                if(enemyLength < enemies.length) {
                    map[i][aColumn] = 5;
                } else { 
                    map[i][aColumn] = 0;
                }
            }
       }
       if (colDiff < 0) {
            for (var i = aColumn; i < colDiff*-1+aColumn; i++) {
                var enemyLength = enemies.length;
                enemies = this.placeRandomEnemy(enemies, [aRow-rowDiff,i])
                if(enemyLength < enemies.length) {
                    map[aRow-rowDiff][i] = 5;
                } else { 
                    map[aRow-rowDiff][i] = 0;
                }
            }
       } else if (colDiff > 0) {
            for (var i = aColumn; i >= bColumn; i--) {
                var enemyLength = enemies.length;
                enemies = this.placeRandomEnemy(enemies, [aRow-rowDiff,i])
                if(enemyLength < enemies.length) {
                   map[aRow-rowDiff][i] = 5;
                } else { 
                   map[aRow-rowDiff][i] = 0;
                }
            }
       }
       return { map: map, enemies: enemies } 
    }
    pickRandomWallStart(map){
        var inds_of_walls = this.findWalls(map)
        var random_index = Math.floor(Math.random()*inds_of_walls.length)
        var [heightStart, widthStart] = inds_of_walls[random_index]
        return [heightStart, widthStart]
    }

    addRandomRoomToMap(map){
        const { gridHeight, gridWidth, health } = this.state;
        var [ heightStart, widthStart ] = this.pickRandomWallStart(map);
        var [ roomHeight, roomWidth ] = [
                Math.floor(Math.random()*this.state.roomDimensions+2),
                Math.floor(Math.random()*this.state.roomDimensions+2)
            ];
        var [ roomEndHeight, roomEndWidth ] = [ 
            roomHeight+heightStart >= gridHeight ? 
                gridHeight : roomHeight+heightStart, 
            roomWidth+widthStart >= gridWidth ? 
                gridWidth : roomWidth + widthStart 
            ];
        for (var i = heightStart; i < roomEndHeight; i++){
            for (var j = widthStart; j < roomEndWidth; j++) {
                    if(Math.random() >.96) {
                        var tile = 6; //health
                        var healthItem = { location: [i,j], amount: Math.floor(Math.random()*50) }
                        health.push(healthItem);
                    } else if (Math.random()>.98) {
                        tile = 7; //new weapon
                    } else {
                        tile = 0;
                    }
                map[i][j] = tile;
            }
        }
        this.setState({
            health: [...health]
        })
        return { map: map, coordinates: [heightStart,widthStart] }
    }
		
    randomMultiRoomPerRowMap () {
        var map = this.generateBlankMap();
        var enemies=[];
        var coordinateB;
        for (var room_i=0; room_i<this.state.numRooms; room_i++){
             var { map, coordinates } = this.addRandomRoomToMap(map)
             if (coordinates && coordinateB) {
              var { map, enemies } = this.generateCorridor(coordinates, coordinateB, map, enemies)
             }
             coordinateB = coordinates.slice();
        }
		var characterLocation = this.placeCharacter(map);	
		map[characterLocation[0]][characterLocation[1]] = 3;
        return [ map, characterLocation, enemies ];
    }
	returnCharNeighbors() {
		const { map, characterLocation, gridWidth, gridHeight } = this.state;
		var neighbors = {};
		function checkBounds (val,factor, dimension) {
			if(val+factor > dimension-1 || val + factor < 0){
				return false;
			} else {
				return true;
			}
		}
		neighbors.above = checkBounds(characterLocation[0], -1, gridHeight) ? 
			map[characterLocation[0]-1][characterLocation[1]] : undefined;
		neighbors.right = checkBounds(characterLocation[1],1,gridWidth) ?
			map[characterLocation[0]][characterLocation[1]+1] : undefined;
		neighbors.below = checkBounds(characterLocation[0],1,gridHeight) ?
			map[characterLocation[0]+1][characterLocation[1]] : undefined;
		neighbors.left = checkBounds(characterLocation[1],-1,gridWidth) ?
			map[characterLocation[0]][characterLocation[1]-1] : undefined;
		return neighbors;
	}
	moveCharacter(direction, factor, type) {
		const { gridHeight, map, gridWidth, characterLocation } = this.state;
		var newMap = [];
		map.map((row)=> newMap.push(row.slice()));
		const neighbors = this.returnCharNeighbors();
		if(neighbors[direction] === 0) {
			var newLocation = characterLocation.slice();
			type === "row" ? newLocation[0]=newLocation[0]+factor : newLocation[1]=newLocation[1]+factor
			newMap[newLocation[0]][newLocation[1]] = 3;
			newMap[characterLocation[0]][characterLocation[1]] = 0;
		} else if (neighbors[direction] === 5) {
            var enemyLocation = characterLocation.slice();
            type === "row" ? enemyLocation[0] = enemyLocation[0]+factor: null;
            type === "column" ? enemyLocation[1] = enemyLocation[1]+factor : null;
            this.attackEnemy(enemyLocation)
            return
        } else if(neighbors[direction] ===6) {
            var healthLocation = characterLocation.slice(); 
			var newLocation = characterLocation.slice();
            type === "row" ? healthLocation[0] = healthLocation[0]+factor : healthLocation[1] = healthLocation[1]+factor;
			type === "row" ? newLocation[0]=newLocation[0]+factor : newLocation[1]=newLocation[1]+factor;
            this.handleHealth(healthLocation);
			newMap[healthLocation[0]][healthLocation[1]] = 3;
			newMap[characterLocation[0]][characterLocation[1]] = 0;
        } else {
            return
        }
        this.setState({
			map: newMap,
			characterLocation: newLocation
		})
        this.miniMapRender()
	}
    handleHealth(healthLocation) {
        var amount;
        this.state.health.filter((item)=> item.location[0] === healthLocation[0] ? 
                item.location[1]===healthLocation[1] ?
                    amount = item.amount : null 
                : null)
        var { characterStats } = this.state;
        characterStats.hp + amount > characterStats.maxHp ? 
            characterStats.hp = characterStats.maxHp : 
            characterStats.hp = characterStats.hp + amount;
        this.setState({               
            characterStats: characterStats
         })
    }
    attackEnemy(location) {
        var { enemies } = this.state;
        var enemyIndex;
        for (var i= 0; i < enemies.length; i++) {
            if(enemies[i].location[0] === location[0] && enemies[i].location[1] === location[1]){
                enemyIndex = i;
                break;
            }
        }
        var attackPower = Math.floor(Math.random()*this.state.characterStats.power[0]+this.state.characterStats.power[1]);
        enemies[enemyIndex].hp -= attackPower;
        if (enemies[enemyIndex].hp <=0) {
            var { map } = this.state;
            var enemyMapLoc = enemies[enemyIndex].location
            map[enemyMapLoc[0]][enemyMapLoc[1]] = 0
            enemies.splice(enemyIndex,1);
            this.handleExperience(enemies[enemyIndex].originalHp)
            this.setState({
                enemies: [...enemies],
                map: map
            })
        } else {
            this.setState({
                enemies: [...enemies]
            })
        }
        this.enemyAttack()
    }
    enemyAttack(){
        var { characterStats } = this.state;
        var enemyAttackPower = Math.floor(Math.random()*20)
        characterStats.hp -= enemyAttackPower
        this.setState({
            characterStats: characterStats 
        })
        if (characterStats.hp <= 0) {
            this.setState({
                gameStatus: false
            })
        } else {
            
        }
    }
	handleKeyPress (e) {
        if(this.state.gameStatus){
		    switch (e.key) {
			    case "s":
				    this.moveCharacter("below",1,"row");
				    break;
			    case "w":
				    this.moveCharacter("above",-1,"row");
				    break;
			    case "a":
				    this.moveCharacter("left",-1,"column");
				    break;
			    case "d":
				    this.moveCharacter("right",1,"column");
				    break;
			    default:
				    console.log("unrecognized button press");
		    }
        }
	}
    getTrimCoordinates(trimAmount, characterLocation){
       const { map } = this.state;
       var rowTop = characterLocation[0] - trimAmount > 0 ? characterLocation[0] - trimAmount : 0;
       var rowBottom = characterLocation[0] + trimAmount < map[0].length ? characterLocation[0] + trimAmount : map[0].length; 
       // adjust if 0 or 
       if(rowTop === 0) {
          rowBottom += trimAmount*2-rowBottom;
       } else if (rowBottom === map[0].length) {
          rowTop -= characterLocation[0]+trimAmount - map[0].length;
       }
       var rowRight = characterLocation[1] + trimAmount < map[0].length ? characterLocation[1] + trimAmount : map[0].length;
       var rowLeft = characterLocation[1] - trimAmount > 0 ? characterLocation[1]-trimAmount : 0;
       
       if(rowLeft === 0) {
          rowRight += trimAmount*2-rowRight;
       } else if (rowRight === map[0].length) {
          rowLeft -= characterLocation[1]+trimAmount - map[0].length;
       }
       
       return { rowRight: rowRight, rowBottom: rowBottom, rowTop: rowTop, rowLeft: rowLeft }
    }
    miniMapRender() {
        const { map, characterLocation, minimap } = this.state;
        var trimAmount = 5;
        var { rowRight, rowBottom, rowTop, rowLeft } = this.getTrimCoordinates(trimAmount, characterLocation);
        var newMinimap = minimap.slice()
        for(var i = rowTop; i < rowBottom; i++){
            for(var j = rowLeft; j < rowRight; j++){
                newMinimap[i][j] = map[i][j]
            }
        }
        this.setState({
            minimap: newMinimap
        })
    }
    trimMapForRendering(map) {
       const {  characterLocation, enemies } = this.state;
       var newMap = [];
       var currentEnemies=[];
       var trimAmount = 8;
       var { rowRight, rowBottom, rowTop, rowLeft } = this.getTrimCoordinates(trimAmount, characterLocation);
       currentEnemies = JSON.parse(JSON.stringify(enemies))
       currentEnemies = currentEnemies.filter((enemy)=>enemy.location[0]>=rowTop && enemy.location[0] < rowBottom && enemy.location[1] >= rowLeft && enemy.location[1] < rowRight)
       var correctCoordinates = []
       currentEnemies.forEach(function(enemy){
         enemy.location[0] =  enemy.location[0]-rowTop; // rowTop is i 0 in rendered grid.
         enemy.location[1] = enemy.location[1]-rowLeft;
         }
       ) 
       for (var i = rowTop; i < rowBottom; i++) {
            var currentRow = map[i].slice()
            var cutRow = currentRow.slice(rowLeft, rowRight);
            newMap.push(cutRow)
       }
       return [ newMap, currentEnemies ];
    }
    onResetClick() {
		let [ map, characterLocation, enemies ] = this.randomMultiRoomPerRowMap();
        [ map, enemies ] = this.placeBoss(map, enemies)
        this.setState({
            map: map,
			characterLocation: characterLocation,
            enemies: enemies,
            gameStatus: true,
            characterStats: { hp: 100, maxHp: 100, weaponName: "blue", power: [20, 0], experience: 0, level: 1 }
        })
    }
    componentWillMount(){
		let [ map, characterLocation, enemies ] = this.randomMultiRoomPerRowMap();
        [ map, enemies ] = this.placeBoss(map, enemies)
       	this.setState({ 
            map: map,
			characterLocation: characterLocation,
            enemies: enemies
       })
    }
    render() {
        var [ renderMap, enemies ] = this.trimMapForRendering(this.state.map);
        return (
        <div>
            <CharacterStats stats={this.state.characterStats} key={uuid()} />
            <Minimap minimap={ this.state.minimap } />  
            <div tabIndex="0" onKeyPress={(e)=>this.handleKeyPress(e)} id="map">

                { renderMap.map((row, index)=> <Row height = { index } gameStatus={ {status: this.state.gameStatus, onClick: ()=>this.onResetClick() } } key = { uuid() }characterLocation = { this.state.characterLocation } characterStats = { this.state.characterStats } enemies = { enemies } row={ row } /> : null ) }
            </div>        
        </div>
        )
    }
}

export default Map;
