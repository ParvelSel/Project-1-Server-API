//Includes
const qs = require('querystring');

//Universal Vars
let filteredBooks = {};
const data = require('./../data/books.json');
const fullBooksString = JSON.stringify(data);
const fullBooks = JSON.parse(fullBooksString);

//Helpers
//ParseBody eventually :(

//Endpoints
//Country Filter
const getBooksFromCountry = (request, response, query) => {
    let code;
    if(query.country){
        filteredBooks = fullBooks.filter(book => book.country === query.country);
        if(filteredBooks.length > 0){
            code = success();
        }else{
            code = noContent();
        }
    }else{
        filteredBooks = [];
        code = badRequest();
    }
    constructResponse(request, response, filteredBooks, code);
};

//Language Filter
const getBooksFromLanguange = (request, response, query) => {
    let code;
    if(query.language){
        filteredBooks = fullBooks.filter(book => book.language === query.language);
        if(filteredBooks.length > 0){
            code = success();
        }else{
            code = noContent();
        }
    }else{
        filteredBooks = [];
        code = badRequest();
    }
    constructResponse(request, response, filteredBooks, code);
};

//Author Filter
const getBooksFromAuthor = (request, response, query) => {
    let code;
    if(query.author){
        filteredBooks = fullBooks.filter(book => book.author === query.author);
        if(filteredBooks.length > 0){
            code = success();
        }else{
            code = noContent();
        }
    }else{
        filteredBooks = [];
        code = badRequest();
    }
    constructResponse(request, response, filteredBooks, code);
};

//Title Filter
const getBooksFromTitle = (request, response, query) => {
    let code;
    if(query.title){
        filteredBooks = fullBooks.filter(book => book.title === query.title);
        if(filteredBooks.length > 0){
            code = success();
        }else{
            code = noContent();
        }
    }else{
        filteredBooks = [];
        code = badRequest();
    }
    constructResponse(request, response, filteredBooks, code);
};

//Add Book
const addBook = (request, response) => {
    let code;
    const data = JSON.parse(request.body);
    if(!data.title || !data.language || !data.country || !data.link || !data.pages || !data.year || !data.genres){
        code = badRequest(request, response);
        constructResponse(request, response, {}, code);
        return;
    }
    const newBook = {
        title: data.title,
        author: data.author,
        language: data.language,
        country: data.country,
        link: data.link,
        pages: data.pages,
        year: data.year,
        genres: data.genres
    };
    fullBooks.push(newBook);
    code = created(request, response);
    constructResponse(request, response, newBook, code);
};

//Update Link
const updateLink = (request, response) => {
    let code;
    if(!request.link || !request.title){
        code = badRequest(request, response);
        constructResponse(request, response, {}, code);
        return;
    }
    const bookToUpdate = fullBooks.find(book => book.title === request.title);
    if(!bookToUpdate){
        code = noContent(request, response);
        constructResponse(request, response, {}, code);
        return;
    }
    bookToUpdate.link = request.link;
    code = success(request, response);
    constructResponse(request, response, bookToUpdate, code);
};

//Page Not Found
const pageNotFound = (request, response) => {
    constructResponse(request, response, {}, notFound());
};


//Error Handling
//200s
const success = () => {
    const codeJSON = {
        id: 200,
        message: "Success"
    }
    return codeJSON;
};

const created = () => {
    const codeJSON = {
        id: 201,
        message: "Created"
    }
    return codeJSON;
};

const noContent = () => {
    const codeJSON = {
        id: 204,
        message: "No Content"
    }
    filteredBooks = [];
    return codeJSON;
};

//400s
const badRequest = () => {
    const codeJSON = {
        id: 400,
        message: "Bad Request"
    }
    return codeJSON;
};

const notFound = () => {
    const codeJSON = {
        id: 404,
        message: "Not Found"
    }
    return codeJSON;
};




// Final Response Construction
const constructResponse = (request, response, bookList, code) => {
    const constructedResponse = {
        bookList: bookList,
        code: code
    };
    response.writeHead(constructedResponse.code.id, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(constructedResponse));
};


module.exports = {
    getBooksFromCountry,
    getBooksFromLanguange,
    getBooksFromAuthor,
    getBooksFromTitle,
    addBook,
    updateLink,
    pageNotFound
};