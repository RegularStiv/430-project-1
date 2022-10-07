const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/index.html`);
const client = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const js = fs.readFileSync(`${__dirname}/../client/game.js`);
const indexJS = fs.readFileSync(`${__dirname}/../client/index.js`);
// sends the user to the index
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};
// sends the user to the index
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
const getJS = (request, response, params) => {
  response.writeHead(200, { 'Content-Type': 'text/javascript' });
  response.write(js);
  response.end();
};
// gets css to appear on screen
const getIndexJS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/javascript' });
  response.write(indexJS);
  response.end();
};

module.exports = {
  getIndex,
  getGame,
  getCSS,
  getJS,
  getIndexJS
};
