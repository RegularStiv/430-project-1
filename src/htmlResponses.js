const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/index.html`);
const client = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const clientCSS = fs.readFileSync(`${__dirname}/../client/clientStyle.css`);
const js = fs.readFileSync(`${__dirname}/../client/game.js`);
const indexJS = fs.readFileSync(`${__dirname}/../client/index.js`);
// sends the user to the index
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};
// sends the user to the html for the game
const getGame = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(client);
  response.end();
};
// gets css to appear on screen
const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};
// gets css to appear on screen
const getClientCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(clientCSS);
  response.end();
};
// gets JS for the game
const getJS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/javascript' });
  response.write(js);
  response.end();
};
// gets js for the index to work
const getIndexJS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/javascript' });
  response.write(indexJS);
  response.end();
};
//export them
module.exports = {
  getIndex,
  getGame,
  getCSS,
  getJS,
  getIndexJS,
  getClientCSS
};
