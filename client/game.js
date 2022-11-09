//variables
let board = document.querySelector("#gameBoard");
let gameArray = [];
let prevArray = [];
let redPlayer = true;
let tryID = '';
let firstGame = true;
let id = '';

//reset the game to nothing
function resetGame() {
    gameArray = [];
    for (let i = 0; i < 6; i++) {
        let rows = []
        for (let j = 0; j < 7; j++) {
            rows.push(0);
            //creates the divs if its the first game
            if (firstGame) {
                let tile = document.createElement("div");
                //gives each tile an id and class
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
//place tiles down and update the board array
function setTile() {
    //only allows the player to place tiles if they didn't go last
    if (prevArray.toString() != gameArray.toString()) {
        //gets the id
        let coordString = this.id;
        coordString = coordString.split('-');
        let row = parseInt(coordString[0]);
        let col = parseInt(coordString[1]);


        for (let i = 0; i < gameArray[row].length - 1; i++) {
            //if at the bottom of the column
            if (!gameArray[i + 1] && gameArray[i][col] === 0) {
                if (redPlayer) {
                    gameArray[i][col] = 1;
                } else if (!redPlayer) {
                    gameArray[i][col] = 2;
                }
                redPlayer = !redPlayer;
                sendPost();
                drawTiles();
                return;
            }
            //if there is a item underneith place on top
            else if (gameArray[i + 1]) {
                if (gameArray[i + 1][col] !== 0 && gameArray[i][col] === 0) {
                    if (redPlayer) {
                        gameArray[i][col] = 1;
                        redPlayer = !redPlayer;
                        sendPost();
                        drawTiles();
                        return;
                    } else if (!redPlayer) {
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
function drawTiles() {
    for (let i = 0; i < gameArray.length; i++) {
        for (let j = 0; j < gameArray[i].length; j++) {
            //adds the classes to the tiles
            if (gameArray[i][j] === 1) {
                let tile = document.getElementById(`${i}-${j}`);
                tile.classList.add('redTile');
            } else if (gameArray[i][j] === 2) {
                let tile = document.getElementById(`${i}-${j}`);
                tile.classList.add('yellowTile');
            } else if (gameArray[i][j] === 0 && document.getElementById(`${i}-${j}`).classList.contains('yellowTile')) {
                document.getElementById(`${i}-${j}`).classList.remove('yellowTile');
            } else if (gameArray[i][j] === 0 && document.getElementById(`${i}-${j}`).classList.contains('redTile')) {
                document.getElementById(`${i}-${j}`).classList.remove('redTile');
            }
        }
    }
    //checks for a connect 4
    checkWin();
}

function checkWin() {
    for (let i = 0; i < gameArray.length; i++) {
        for (let j = 0; j < gameArray[i].length; j++) {
            //horizontal
            if (gameArray[i][j + 3]) {
                if (gameArray[i][j] != 0
                    && gameArray[i][j] === gameArray[i][j + 1]
                    && gameArray[i][j] === gameArray[i][j + 2]
                    && gameArray[i][j] === gameArray[i][j + 3]) {
                    resetGame();
                    return;
                }
            }

            //vertical
            if (gameArray[i + 3] && gameArray[i + 3][j]) {
                if (gameArray[i][j] != 0
                    && gameArray[i][j] === gameArray[i + 1][j]
                    && gameArray[i][j] === gameArray[i + 2][j]
                    && gameArray[i][j] === gameArray[i + 3][j]) {
                    resetGame();
                    return;
                }
            }

            //diagonal up right
            if (gameArray[i - 3] && gameArray[i - 3][j + 3]) {
                if (gameArray[i][j] != 0
                    && gameArray[i][j] === gameArray[i - 1][j + 1]
                    && gameArray[i][j] === gameArray[i - 2][j + 2]
                    && gameArray[i][j] === gameArray[i - 3][j + 3]) {
                    resetGame();
                    return;
                }
            }

            //diagonal up left
            if (gameArray[i - 3] && gameArray[i - 3][j - 3]) {
                if (gameArray[i][j] != 0
                    && gameArray[i][j] === gameArray[i - 1][j - 1]
                    && gameArray[i][j] === gameArray[i - 2][j - 2]
                    && gameArray[i][j] === gameArray[i - 3][j - 3]) {
                    resetGame();
                    return;
                }
            }
        }
    }
    //tells the player whos turn it is
    if (redPlayer) {
        document.querySelector("#content").innerHTML = `<p>Red Player's Turn</p>`;
    }
    if (!redPlayer) {
        document.querySelector("#content").innerHTML = `<p>Yellow Player's Turn</p>`;
    }
}

//#region posting and geeting

const handleResponse = async (response, parseResponse) => {

    //Grab the content section
    const content = document.querySelector('#content');

    // when posting the board the id is taken back as well and posted for the player to see
    if (parseResponse === 'POST') {
        let obj = await response.json();
        id = obj.lobby.id;
        document.querySelector("#id").textContent = `${id}`;
    }

    // when getting 
    if (parseResponse === 'GET') {
        //set object 
        let obj = await response.json();
        //if the body exists
        if (obj.body) {
            //get the separate parts out of the body like the board, id, and player
            id = obj.body.id;
            document.querySelector("#id").textContent = `${id}`;
            redPlayer = obj.body.redPlayer;
            if (obj.body.gameArray != gameArray) {
                gameArray = obj.body.gameArray;
            }
            let playerStatus = '';
            if (redPlayer) {
                playerStatus = 'Red Player';
            } else {
                playerStatus = 'Yellow Player';
            }

            //update the tiles and whos turn it is
            if(content.textContent !== `It is the ${playerStatus}'s turn`){
                content.innerHTML = `<b>It is the ${playerStatus}'s turn</b>`
            }
            drawTiles();
        }
        //if the id doenst exist create a new lobby
        else if (!obj.body && id === '') {
            resetGame();
            prevArray = [];
            content.innerHTML = `<p>No Board Found. Creating New Lobby.</p>`
        }

        //If we have a message, display it.
        if (obj.message) {
            content.innerHTML += `<p>${obj.message}</p>`;
        }
    }
    //head requests
    if (parseResponse === 'HEAD') {
        if (response.status === 200 || response.status === 201 || response.status === 204) {
            content.innerHTML = `<p>Head Success</p>`;
        }
        else {
            content.innerHTML = `<p>Head Failure</p>`;
        }
    }
};

//update the board
const requestUpdate = async () => {
    //Await our fetch response. Go to the URL, use the right method, and attach the headers.
    let response = await fetch(`/getBoard?id=${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
    });

    //handle the response 
    handleResponse(response, 'GET');
};
const sendPost = async () => {
    //sets the player box
    if(!redPlayer && !firstGame){
        document.querySelector("#playerBox").textContent = 'You Are The Red Player';
    }
    else if(redPlayer&& !firstGame){
        document.querySelector("#playerBox").textContent = 'You Are The Yellow Player';
    }

    //set to not the first game
    if (firstGame) {
        firstGame = false;
    } else {
        prevArray = gameArray;
    }
    //send the info 
    const board = {
        board: gameArray,
        player: redPlayer,
        id: id
    }
    
    //call change board and create the response
    let response = await fetch('/changeBoard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(board)
    });


    //Once we have a response, handle it.
    handleResponse(response, 'POST');
};

const connectToGame = async () => {
    //check if connect to game should be called at all
    if (id !== document.querySelector("#idText").value || localStorage.getItem('id') !== null) {
        
        //if the id was sent from the index get the id and remove it
        if (localStorage.getItem('id') !== null) {
            !localStorage.removeItem('id');
        }
        //reset the game if they were in case they were in one
        gameArray = [];
        for (let i = 0; i < 6; i++) {
            let rows = []
            for (let j = 0; j < 7; j++) {
                rows.push(0);
            }
            gameArray.push(rows);
        }
        drawTiles();

        // try the id in the box
        if (document.querySelector("#idText").value != '') {
            tryID = document.querySelector("#idText").value;
        }
        //Await our fetch response. Go to the URL, use the right method, and attach the headers.
        let response = await fetch(`/getBoard?id=${tryID}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
        });

        //Once we have our response, send it into handle response 
        handleResponse(response, 'GET');
    }
}
const headRequest = async () => {
    //Await our fetch response. Go to the URL, use the right method, and attach the headers.
    let response = await fetch(`/getBoardMeta`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
    });

    //handle the response 
    handleResponse(response, 'HEAD');
}

function init() {
    //if not id was sent over create the game
    if (!localStorage.getItem('id')) {
        resetGame();
    } 
    // connect to the game if it exists and create the divs
    else {
        resetGame();
        tryID = localStorage.getItem('id');
        connectToGame();
        firstGame = false;
    }
    //call update every second
    setInterval(() => {
        requestUpdate();
        console.log("updated");
    }, 1000);
    //connect buttons to functions 
    document.querySelector("#buttonConnect").onclick = connectToGame;
    document.querySelector("#buttonReset").onclick = resetGame;
}
//#endregion
window.onload = init;