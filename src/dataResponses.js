//Includes
const qs = require('querystring');

//Universal Vars
let filteredBooks = {};
const data = require('./../data/books.json');
const fullBooksString = JSON.stringify(data);
const fullBooks = JSON.parse(fullBooksString);



//Endpoints
//GETS(Used for HEADS as well)
//GET Endpoint: Country Filter
const getBooksFromCountry = (request, response, query) => {
    let code;
    
    if(query.term){
        filteredBooks = fullBooks.filter(book => book.country === query.term);
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

//GET Endpoint: Language Filter
const getBooksFromLanguage = (request, response, query) => {
    let code;
    if(query.term){
        filteredBooks = fullBooks.filter(book => book.language === query.term);
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

//GET Endpoint: Author Filter
const getBooksFromAuthor = (request, response, query) => {
    let code;
    if(query.term){
        filteredBooks = fullBooks.filter(book => book.author === query.term);
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

//GET Endpoint: Title Filter
const getBooksFromTitle = (request, response, query) => {
    let code;
    if(query.term){
        filteredBooks = fullBooks.filter(book => book.title === query.term);
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



//POSTS
//POST Endpoint: Add Book
//Adding books to the fullBooks variable. Keeps 
//memory while server is up, loses it on restart 
//because it's stored in a variable
const addBook = (request, response) => {
    //console.log('addBook hit, body:', request.body);
    
    //Checks that all valid inputs have made it to the body
    let code;
    if(!request.body.title || !request.body.language || !request.body.country || !request.body.link || !request.body.pages || !request.body.year){
        code = badRequest(request, response);
        constructResponse(request, response, {}, code);
        return;
    }
    //Catches string interpritation and turns it into 
    //an array for consistency with the book struct
    let newBook;
    if(typeof request.body.genres === 'string'){
        request.body.genres = request.body.genres.split(', ').map(genre => genre.trim());
    }
    //Genre presence cases
    if(request.body.genres && request.body.genres.length > 0){
        newBook = {
            title: request.body.title,
            author: request.body.author,
            language: request.body.language,
            country: request.body.country,
            link: request.body.link,
            pages: request.body.pages,
            year: request.body.year,
            genres: request.body.genres
        };
    } else {
        newBook = {
            title: request.body.title,
            author: request.body.author,
            language: request.body.language,
            country: request.body.country,
            link: request.body.link,
            pages: request.body.pages,
            year: request.body.year
        };
    }
    fullBooks.push(newBook);
    code = created(request, response);
    //console.log(`Book Making!`);
    constructResponse(request, response, newBook, code);
};

//Update Book
const updateBook = (request, response) => {
    let code;
    if(!request.body.term || !request.body.title){
        code = badRequest(request, response);
        constructResponse(request, response, {}, code);
        return;
    }
    const bookToUpdate = fullBooks.find(book => book.title === request.body.title);
    //Checks if theres a valid book to update
    if(!bookToUpdate){
        code = notFound(request, response);
        constructResponse(request, response, {}, code);
        return;
    }
    //All possible cases from dropdown
    switch(request.body.typeToUpdate){
        case 'Author':
            bookToUpdate.author = request.body.term;
            break;
        case 'Language':
            bookToUpdate.language = request.body.term;
            break;
        case 'Country':
            bookToUpdate.country = request.body.term;
            break;
        case 'Link':
            bookToUpdate.link = request.body.term;
            break;
    }
    code = success(request, response);
    constructResponse(request, response, bookToUpdate, code);
};

//Page Not Found
const pageNotFound = (request, response) => {
    constructResponse(request, response, {}, notFound());
};


//Error Handling all reusable for use with construct response
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




// Final Response Construction.
//Designed to be used in all cases for consistent return formats.
const constructResponse = (request, response, bookList, code) => {
    let size = 0;
    const constructedResponse = {
        bookList: bookList,
        code: code
    };
    const body = JSON.stringify(constructedResponse);  
    if (code.id !== 204) {
        size = Buffer.byteLength(body, 'utf8');
    }
    response.writeHead(code.id, { 'Content-Type': 'application/json', 'Message': code.message, 'Content-Length': size });
    if(request.method === 'GET' || request.method === 'POST'){
        response.write(body);
    }
    
        
    console.log("At the bottom of constructResponse");
    response.end();
};

//Exporter
module.exports = {
    getBooksFromCountry,
    getBooksFromLanguage,
    getBooksFromAuthor,
    getBooksFromTitle,
    addBook,
    updateBook,
    pageNotFound
};