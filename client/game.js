let board = document.querySelector("#gameBoard");
let gameArray = [];

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
        if(!gameArray[i + 1]){
            gameArray[i][col] = 1;
        } else if(gameArray[i + 1][col]){
            if(gameArray[i + 1][col] !== 0){
            gameArray[i][col] = 1;
            }   
        }
    }
    drawTiles();
}
function drawTiles(){
    for(let i = 0; i < gameArray.length; i++){
        for(let j = 0; j < gameArray[i].length; j++){
            if(gameArray[i][j] === 1){
                let tile = document.getElementById(`${i}-${j}`);
                tile.classList.add('redTile');
            }
        }
    }
}
window.onload = init;