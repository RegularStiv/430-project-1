const http = require('http');
const url = require('url');
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, handler) => {
  // body array to store pieces of data
  const body = [];

  // on error show 400 and show the error
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });
  //console.log('wjehkj');

  request.on('data', (chunck) => {
    body.push(chunck);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    handler(request, response, bodyParams);
  });
};
const handleGet = (request, response, parsedUrl) => {
  // route to correct method based on url
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/getBoard') {
    responseHandler.getBoard(request, response);
  } else if (parsedUrl.pathname === '/notReal') {
    responseHandler.notFound(request, response);
  } else if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else if (parsedUrl.pathname === '/getJS') {
    htmlHandler.getJS(request, response);
  } else {
    responseHandler.notFound(request, response);
  }
};

const handleMeta = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/getBoard') {
    responseHandler.getBoardMeta(request, response);
  } else if (parsedUrl.pathname === '/notReal') {
    responseHandler.notFoundMeta(request, response);
  }
};

const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/changeBoard') {
    parseBody(request, response, responseHandler.changeBoard);
  }
};
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  // checks different types of server commands
  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (request.method === 'GET') {
    handleGet(request, response, parsedUrl);
  } else {
    handleMeta(request, response, parsedUrl);
  }
};
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
