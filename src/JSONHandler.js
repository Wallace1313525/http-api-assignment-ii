const users = {};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };
    
  respondJSON(request, response, 200, responseJSON);
};

const notFound = (request, response) => {
    const responseJSON = {
    message: 'Page not found'
  };
  respondJSON(request, response, 404, responseJSON);
};



const addUser = (request, response, body) => {
  //default json message
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  //check to make sure we have both fields
  //We might want more validation than just checking if they exist
  //This could easily be abused with invalid types (such as booleans, numbers, etc)
  //If either are missing, send back an error message as a 400 badRequest
  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  //default status code to 201 created
  let responseCode = 201;

  //if that user's name already exists in our object
  //then switch to a 204 updated status
  if (users[body.name]) {
    responseCode = 204;
  } else {
    //otherwise create an object with that name
    users[body.name] = {};
  }

  //add or update fields for this user name
  users[body.name].name = body.name;
  users[body.name].age = body.age;

  //if response is created, then set our created message
  //and sent response with a message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  // 204 has an empty payload, just a success
  // It cannot have a body, so we just send a 204 without a message
  // 204 will not alter the browser in any way!!!
  return respondJSONMeta(request, response, responseCode);
};

    
//public exports
module.exports = {
  getUsers,
  addUser,
  notFound
};