let board = document.querySelector("#gameBoard");
let gameArray = [];
let redPlayer = true;
function init() {
    resetGame();
}

function resetGame(){
    for(let i = 0; i < 6; i++){
        let rows = []
        for (let j = 0; j < 7; j++){
            rows.push(0);

            let tile = document.createElement("div");
            tile.id = `${i.toString()}-${j.toString()}`
            tile.classList = "tile";
            tile.onclick = setTile;
            document.querySelector("#gameBoard").appendChild(tile);
        }
        gameArray.push(rows);
    }
    console.log(gameArray);
}

function setTile(){
    let coordString = this.id;
    coordString = coordString.split('-');
    let row = parseInt(coordString[0]);
    let col = parseInt(coordString[1]);
    for(let i = 0; i < gameArray[row].length - 1; i++){
        //if at the bottom of the column
        if(!gameArray[i + 1]){
            if(redPlayer){
                gameArray[i][col] = 1;
            }else if(!redPlayer){
                gameArray[i][col] = 2;
            }
            redPlayer = !redPlayer;
            drawTiles();
        } 
        //if there is a item underneith 
        else if(gameArray[i + 1][col]){
            if(gameArray[i + 1][col] !== 0){
                if(redPlayer){
                    gameArray[i][col] = 1;
                    redPlayer = !redPlayer;
                    drawTiles();
                    return;
                }else if(!redPlayer){
                    gameArray[i][col] = 2;
                    redPlayer = !redPlayer;
                    drawTiles();
                    return;
                }
            }   
        }
    }
}

//drawing tiles on screen
function drawTiles(){
    for(let i = 0; i < gameArray.length; i++){
        for(let j = 0; j < gameArray[i].length; j++){
            if(gameArray[i][j] === 1){
                let tile = document.getElementById(`${i}-${j}`);
                tile.classList.add('redTile');
            } else if(gameArray[i][j] === 2){
                let tile = document.getElementById(`${i}-${j}`);
                tile.classList.add('yellowTile');
            }
        }
    }
}
window.onload = init;