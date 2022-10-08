const lobbies = {};

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

const getBoard = (request, response, params) => {
  const responseJSON = {
    message: 'Getting Board',
  };
  if (lobbies[params.id] === '') {
    responseJSON.message = 'Missing ID';
    responseJSON.id = 'missingParams';
    // console.log(responseJSON);
    return respondJSON(request, response, 400, responseJSON);
  }
  if (!lobbies[params.id]) {
    responseJSON.message = 'Board not found';
    responseJSON.id = '';
    // console.log(responseJSON);
    return respondJSON(request, response, 404, responseJSON);
  }

  responseJSON.message = 'Got GameBoard';
  responseJSON.body = lobbies[params.id];
  // console.log(responseJSON);
  return respondJSON(request, response, 200, responseJSON);
};
const getBoardMeta = (request, response) => respondJSONMeta(request, response, 200);
const changeBoard = (request, response, body) => {
  let responseCode = 200;
  let currentID = body.id;
  if (!lobbies[body.id] || body.id === '') {
    let unique = false;
    responseCode = 201;
    while (!unique) {
      unique = true;
      let randomID = '';
      const possibleChars = 'abcdefghijklmnopqrstuvwxyz1234567890';
      for (let i = 0; i < 4; i++) {
        randomID += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
      }
      if (lobbies[randomID]) {
        unique = false;
        randomID = '';
      }
      currentID = randomID;
    }
    lobbies[currentID] = {};
  }

  // default json message
  const responseJSON = {
    message: 'Pushed the game board to the server',
  };
  lobbies[currentID].id = currentID;
  lobbies[currentID].gameArray = body.board;
  lobbies[currentID].redPlayer = body.player;

  responseJSON.lobby = lobbies[currentID];

  // if response is created send created message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  } if (responseCode === 200) {
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
