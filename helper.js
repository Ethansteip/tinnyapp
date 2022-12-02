/**
 *
 * helper.js - a collection of helper functions that we'll be using inside our route logic.
 *
 */


/**
 *
 * generateRandomString - will generate a 6 digit, alphanumeric id that we'll use as our short url.
 *
 */

const generateRandomString = () => {
  
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
  let randomCharacters = [];

  for (let i = 0; i < 6; i++) {
    randomCharacters.push(characters[Math.floor(Math.random() * characters.length)]);
  }
  const shortUrl = randomCharacters.join("");
  return shortUrl;
};

/**
 *
 * userLookup - returns either the user object or null if the supplied email is found in our users database.
 * @params {string} - email - the user's email address.
 * @params {object} - users - a collection of all the users in the form of an object.
 *
 */

const getUserByEmail = (email, users) => {

  for (const x in users) {
    if (users[x].email === email) {
      return users[x];
    }
  }
  return null;
};

/**
 *
 * urlsForUser - returns a list of all URLs associated with a user.
 * @params {string} userId - the user's id we are to associate with urls.
 * @params {object} urlDatabase - a collection of all urls stored in the database in the form of an object.
 *
 */

const urlsForUser = (userId, urlDatabase) => {

  let urlObj = {};
  for (const x in urlDatabase) {
    if (urlDatabase[x].userID === userId) {
      urlObj[x] = urlDatabase[x].longURL;
    }
  }
  return urlObj;
};


/**
 *
 * urlIdLookup - returns true if the id for a given url is found in the database.
 * @params {string} id - the id of the url we are searching for.
 * @params {object} urlDatabase - a collection of all urls stored in the database in the form of an object.
 *
 */

const urlIdLookup = (id, urlDatabase) => {

  for (const x in urlDatabase) {
    if (urlDatabase[id]) {
      return true;
    }
  }
  return false;
};

module.exports = { generateRandomString, getUserByEmail, urlsForUser, urlIdLookup };