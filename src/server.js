//Var Declarations
const http = require('http');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const dataHandler = require('./dataResponses.js');

const port = process.env.PORT || 3000;

//Im so used to using switch statements but this is so much better after going thru head request
const urlStruct = {
    '': htmlHandler.getIndex,
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCss,
    '/documentation': htmlHandler.getDocumentation,
    '/getBooksFromCountry': dataHandler.getBooksFromCountry,
    '/getBooksFromLanguage': dataHandler.getBooksFromLanguage,
    '/getBooksFromAuthor': dataHandler.getBooksFromAuthor,
    '/getBooksFromTitle': dataHandler.getBooksFromTitle,
    '/addBook': dataHandler.addBook,
    '/updateBook': dataHandler.updateBook,
    notFound: dataHandler.pageNotFound
};

//Simple handling merge for both GET and HEAD like in client.
const handleGetHead = (request, response, parsedUrl, query) => {
    if(urlStruct[parsedUrl.pathname]){
        urlStruct[parsedUrl.pathname](request, response, query);
    } else {
        dataHandler.pageNotFound(request, response, query);
    }
};

//Simple handling for POST
const handlePost = (request, response, parsedUrl, query) => {
    if(urlStruct[parsedUrl.pathname]){
        parseBody(request, response, urlStruct[parsedUrl.pathname]);
    }else{
        dataHandler.pageNotFound(request, response, query);
    }
};

//Ripped from the demo(body-parse). It's a function that in this context 
//is a toolbox function, so given it's exactly the piece I needed, 
//I'd be foolish not to use something standardized.
const parseBody = (request, response, handler) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const type = request.headers['content-type'];
    if(type === 'application/x-www-form-urlencoded') {
      request.body = query.parse(bodyString);
    } else{
      request.body = JSON.parse(bodyString);
    }
    //console.log(`Checkpoint at Finishing Body Parsing!`);
    handler(request, response);
  });
};

//Core RoutingFunctionality
const onRequest = (request, response) => {
    //URL Ripping
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
    const query = Object.fromEntries(parsedUrl.searchParams);

    //Get, head, and 404 fallback.
    if(request.method === 'GET' || request.method === 'HEAD'){
        handleGetHead(request, response, parsedUrl, query);
    }else if(request.method === 'POST'){
        //console.log(`Checkpoint at Routing!`);
        handlePost(request, response, parsedUrl, query);
    }else{
        dataHandler.pageNotFound(request, response, query);
    }
};

//Server Maker
http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on port 127.0.0.1:${port}`);
});

