let board = document.querySelector("#gameBoard");
let gameArray = [];
let prevArray = [];
let redPlayer = true;
let gameInProgress = false;
let firstGame = true;
let id = '';
function init() {
    setInterval(() => {
        requestUpdate();
        console.log("updated");
    }, 1000);
    document.querySelector("#buttonConnect").onclick = connectToGame;
    resetGame();
}

function resetGame(){
    gameArray = [];
    gameInProgress = false;
    for(let i = 0; i < 6; i++){
        let rows = []
        for (let j = 0; j < 7; j++){
            rows.push(0);
            if(firstGame){
                let tile = document.createElement("div");
                tile.id = `${i.toString()}-${j.toString()}`
                tile.classList = "tile";
                tile.onclick = setTile;
                document.querySelector("#gameBoard").appendChild(tile);
            }
        }
        gameArray.push(rows);
    }

    sendPost();
}
function setTile(){
    if(prevArray.toString() != gameArray.toString()){
    let coordString = this.id;
    coordString = coordString.split('-');
    let row = parseInt(coordString[0]);
    let col = parseInt(coordString[1]);
    for(let i = 0; i < gameArray[row].length - 1; i++){
        //if at the bottom of the column
        if(!gameArray[i + 1] && gameArray[i][col] === 0){
            if(redPlayer){
                gameArray[i][col] = 1;
            }else if(!redPlayer){
                gameArray[i][col] = 2;
            }
            redPlayer = !redPlayer;
            sendPost();
            drawTiles();
            
        } 
        //if there is a item underneith 
        else if(gameArray[i + 1] ){
            if(gameArray[i + 1][col] !== 0 && gameArray[i][col] === 0){
                if(redPlayer){
                    gameArray[i][col] = 1;
                    redPlayer = !redPlayer;
                    sendPost();
                    drawTiles();
                    return;
                }else if(!redPlayer){
                    gameArray[i][col] = 2;
                    redPlayer = !redPlayer;
                    sendPost();
                    drawTiles();
                    return;
                }
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
            } else if(gameArray[i][j] === 0 && document.getElementById(`${i}-${j}`).classList.contains('yellowTile')){
                document.getElementById(`${i}-${j}`).classList.remove('yellowTile');
            }else if(gameArray[i][j] === 0 && document.getElementById(`${i}-${j}`).classList.contains('redTile')){
                document.getElementById(`${i}-${j}`).classList.remove('redTile');
            }
        }
    }
    checkWin();
}

function checkWin(){
    for(let i = 0; i < gameArray.length; i++){
        for(let j = 0; j < gameArray[i].length; j++){
            //horizontal
            if(gameArray[i][j + 3]){
                if(gameArray[i][j] != 0 
                    && gameArray[i][j] === gameArray[i][j + 1]
                    && gameArray[i][j] === gameArray[i][j + 2] 
                    && gameArray[i][j] === gameArray[i][j + 3]){
                    console.log('horizaontal wins');
                    resetGame();
                    //drawTiles();
                    return;
                }
            }
            
            //vertical
            if(gameArray[i + 3] && gameArray[i + 3][j]){
                if(gameArray[i][j] != 0 
                    && gameArray[i][j] === gameArray[i + 1][j]
                    && gameArray[i][j] === gameArray[i + 2][j] 
                    && gameArray[i][j] === gameArray[i + 3][j]){
                    console.log('vertical wins');
                    resetGame();
                    //drawTiles();
                    return;
                }
            }

            //diagonal up right
            if(gameArray[i - 3] && gameArray[i - 3][j + 3]){
                if(gameArray[i][j] != 0 
                    && gameArray[i][j] === gameArray[i - 1][j + 1]
                    && gameArray[i][j] === gameArray[i - 2][j + 2] 
                    && gameArray[i][j] === gameArray[i - 3][j + 3]){
                    console.log('diagonal wins');
                    resetGame();
                    //drawTiles();
                    return;
                }
            }

            //diagonal up left
            if(gameArray[i - 3] && gameArray[i - 3][j - 3]){
                if(gameArray[i][j] != 0 
                    && gameArray[i][j] === gameArray[i - 1][j - 1]
                    && gameArray[i][j] === gameArray[i - 2][j - 2] 
                    && gameArray[i][j] === gameArray[i - 3][j - 3]){
                    console.log('diagonal wins');
                    resetGame();
                    //drawTiles();
                    return;
                }
            }
        }
    }
    if(redPlayer){
        document.querySelector("#content").innerHTML = `<p>Red Player's Turn</p>`;
    }
    if(!redPlayer){
        document.querySelector("#content").innerHTML = `<p>Yellow Player's Turn</p>`;
    }
    
    //requestUpdate();
    //drawTiles();
}

//#region posting and geeting

const handleResponse = async (response, parseResponse) => {
       
    //Grab the content section
    const content = document.querySelector('#content');

    //Based on the status code, display something
     switch(response.status) {
       case 200: //success
         content.innerHTML = `<b>Success</b>`;
         break;
       case 201: //created
         content.innerHTML = '<b>Created</b>';
         break;
       case 204: //updated (no response back from server)
         content.innerHTML = '<b>Updated (No Content)</b>';
         return;
       case 400: //bad request
         content.innerHTML = `<b>Bad Request</b>`;
         break;
         case 404: //bad request
         content.innerHTML = `<b>Not Found</b>`;
         break;
       default: //any other status code
         content.innerHTML = `Error code not implemented by client.`;
         break;
     }
    //Parse the response to json. This works because we know the server always
    //sends back json. Await because .json() is an async function.
    if(parseResponse === 'POST'){
        let obj  = await response.json();
        id = obj.lobby.id;
        document.querySelector("#id").textContent = `ID: ${id}`;
    }
    if(parseResponse === 'GET'){
     let obj = await response.json();
        //console.log(obj);
     if(obj.body){
        id = obj.body.id;
        redPlayer = obj.body.redPlayer;
        if(obj.body.gameArray != gameArray){
            gameArray = obj.body.gameArray;
        }
        
        drawTiles();
     }

     //If we have a message, display it.
     if(obj.message){
      content.innerHTML = `<p>${obj.message}</p>`;
    }
}
};
const requestUpdate = async () => {
    //Await our fetch response. Go to the URL, use the right method, and attach the headers.
    let response = await fetch(`/getBoard?id=${id}`, {
      method: 'GET',
      headers: {
          'Accept': 'application/json'
      },
    });
    //Once we have our response, send it into handle response. The second parameter is a boolean
    //that says if we should parse the response or not. We will get a response to parse on get
    //requests so we can do an inline boolean check, which will return a true or false to pass in.
    handleResponse(response, 'GET');
  };
const sendPost = async () => {
    if(firstGame){
        firstGame = false;
    }else{
        prevArray = gameArray;
    }
    const board = {
        board: gameArray,
        player: redPlayer,
        id: id
    }
    
    let response = await fetch('/changeBoard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(board)
    });
    //console.log(response);
    //Once we have a response, handle it.
    handleResponse(response, 'POST');
  };

  const connectToGame = async () => {
    if(id !== document.querySelector("#idText").value){
    gameArray = [];
    for(let i = 0; i < 6; i++){
        let rows = []
        for (let j = 0; j < 7; j++){
            rows.push(0);
        }
        gameArray.push(rows);
    }
    drawTiles();
    const tryID = document.querySelector("#idText").value;
    //Await our fetch response. Go to the URL, use the right method, and attach the headers.
    let response = await fetch(`/getBoard?id=${tryID}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
      });
      //Once we have our response, send it into handle response. The second parameter is a boolean
      //that says if we should parse the response or not. We will get a response to parse on get
      //requests so we can do an inline boolean check, which will return a true or false to pass in.
      handleResponse(response, 'GET');
  }
}
//#endregion
window.onload = init;