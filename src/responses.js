let gameArray = [];

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  return respondJSON(request, response, 404, responseJSON);
};

const getBoard = (request, response) => {
  //console.log(gameArray);
  const responseJSON = {
    message: "got GameBoard",
    method: 'GET',
    body: gameArray
  };
  //console.log(responseJSON);
  respondJSON(request, response, 200, responseJSON);
};
const getBoardMeta = (request, response) => respondJSONMeta(request, response, 200);
const changeBoard = (request, response, board) => {
  // default json message
  const responseJSON = {
    message: 'Pushed the game board to the server',
  };
  //console.log(board);
  // default status code to 204 updated
  let responseCode = 204;

  // If the user doesn't exist yet
  if (gameArray === []) {
    // Set the status code to 201 and create an empty user
    responseCode = 201;
  }

  // add or update fields for this user name
  console.log(board);
    let boardArray = [];
    //console.log(boardArray)
    for(let i = 0; i < 6; i++){
      let row = [];
      for(let j = 0; j < 7; j++){
        console.log(board[i]);
        if(board[(i * 6) + j] === 0){
          row.push(0);
        }else{
          row.push(board[i]);
        }
      }
      //console.log(row);
      boardArray.push(row);
    }
  board = boardArray

  gameArray = board;
  responseJSON.body = board;
  //console.log(responseJSON.body);
  //console.log('changeBoard Data');
  // if response is created send created message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';

    return respondJSON(request, response, responseCode, responseJSON);
  }else if(responseCode === 204){
    return respondJSON(request, response, responseCode, responseJSON);
  }
  return respondJSONMeta(request, response, responseCode);
};

const notFoundMeta = (request, response) => {
  // return a 404 without an error message
  respondJSONMeta(request, response, 404);
};

module.exports = {
  notFound,
  getBoard,
  changeBoard,
  getBoardMeta,
  notFoundMeta,
};
