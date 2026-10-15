//File Identification
const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const documentation = fs.readFileSync(`${__dirname}/../client/documentation.html`);

//Gets client.html
const getIndex = (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(index);
};

//Gets raw css
const getCss = (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/css' });
    response.end(css);
};

//Gets documentation.html
const getDocumentation = (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(documentation);
};

//Exporter
module.exports = {
    getIndex,
    getCss,
    getDocumentation
};