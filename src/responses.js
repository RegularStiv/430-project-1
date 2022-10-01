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
  const responseJSON = {
    gameArray,
  };
  console.log(`getBoard Data = ${gameArray}`);
  respondJSON(request, response, 200, responseJSON);
};
const getBoardMeta = (request, response) => respondJSONMeta(request, response, 200);
const changeBoard = (request, response, board) => {
  // default json message
  const responseJSON = {
    message: 'Pushed the game board to the server',
  };

  // default status code to 204 updated
  let responseCode = 204;

  // If the user doesn't exist yet
  if (!gameArray[2]) {
    // Set the status code to 201 and create an empty user
    responseCode = 201;
    gameArray = [];
  }

  // add or update fields for this user name
  gameArray = board;
  console.log(`changeBoard Data = ${gameArray}`);
  // if response is created send created message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
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
