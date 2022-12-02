/**
 *
 * Express_server.js - initializes the webserver and handles all of TinyApp's routing.
 *
*/

const express = require("express");
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser');
const { application } = require("express");
app.set('view engiine', 'ejs');

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
 * userLookup - returns either true or false if a the supplied email is already found in our users database.
 *
 */

const userLookup = (email) => {

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
 *
 */

const urlsForUser = (userId) => {

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
 * short url id lookup
 *
 */

const urlIdLookup = (id) => {

  for (const x in urlDatabase) {
    if (urlDatabase[id]) {
      return true;
    }
  }
  return false;
};

/**
 *
 * URL Database
 *
 */

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "54321"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "12345",
  },
  "Fahi3t": {
    longURL: "www.twitter.com",
    userID: "12345"
  },
  "l2Hjj0": {
    longURL: "www.facebook.com",
    userID: "12345"
  },
  "L0L1Sdg": {
    longURL: "www.dribbble.com",
    userID: "54321",
  },
  "H7VVd1": {
    longURL: "www.dailynews.com",
    userID: "54321"
  },
  "jas0HJ": {
    longURL: "www.torontopost.com",
    userID: "54321"
  },
};

/**
 *
 * User Database
 *
 */

const users = {
  '54321': {
    id: "54321",
    email: "maggie.smith@hotmail.com",
    password: "password",

  },
  '12345': {
    id: "12345",
    email: "ethan.steip@gmail.com",
    password: "password",
  },
};

/**
 *
 * MiddleWare
 *
*/

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 *
 * Routes
 *
*/

/**
 *
 * Create URL - POST - allows the user to create a URL.
 *
 */

app.post("/urls", (req, res) => {
  const shortUrl = generateRandomString();
  const longUrl = req.body.longURL;

  const templateVars = {
    id: shortUrl,
    longURL: longUrl,
    user: users[req.cookies["user_id"]],
  };

  // Don't let non-logged in members submit post requests to /urls.
  if (!templateVars.user) {
    res.send("Sorry, but you will need to be logged in to access this page!");
    console.log(`User is not authorized to access the create url page.`);
  } else {

    urlDatabase[shortUrl] = {longURL: longUrl, userID: templateVars.user.id};

    console.log(urlDatabase);

    res.redirect(`/urls/${shortUrl}`);
  }
  // Check if unauthorized users can still post to database.
  // console.log(urlDatabase);

});

/**
 *
 * Delete URL - POST - allows the user to delete their URLs
 *
 */

app.post('/urls/:id/delete', (req, res)=> {
  const { id } = req.params;

  // check to see if url id exists, if user is logged in and if the url belongs to the user before deleting.
  if (!users[req.cookies["user_id"]]) {
    res.send("Sorry, you need to be logged in to perform that action");
    console.log("Delete: canno't perform action as user is not logged in or registered.");
  } else if (!urlIdLookup(id)) {
    res.send("Sorry, we canno't find a url with that id");
    console.log("Delete: canno't find url with that id");
  } else if (users[req.cookies["user_id"]].id !== urlDatabase[id].userID) {
    res.send("Sorry, you don't have access to delete that url.");
    console.log("Delete: canno't perform action as that is not the user's url.");
  } else {
    console.log(`URL with an id of ${id} : ${urlDatabase[id].longURL} has been deleted from the database \n updated url database:`);
    delete urlDatabase[id];
    res.redirect('/urls');
    console.log(urlDatabase);
  }
});

/**
 *
 * Edit URL - POST - allows the user to edit their longURLs.
 *
 */

app.post('/urls/:id', (req, res) => {

  const { id } = req.params;
  const { urlEdit } = req.body;


  // check to see if url id exists, if user is logged in and if the url belongs to the user before editing.
  if (!urlIdLookup(id)) {
    res.send("Sorry, we canno't find a url with that id");
    console.log("Edit: canno't find url with that id");
  } else if (!users[req.cookies["user_id"]]) {
    res.send("Sorry, you need to be logged in to perform that action");
    console.log("Edit: canno't perform action as user is not logged in or registered.");
  } else if (users[req.cookies["user_id"]].id !== urlDatabase[id].userID) {
    res.send("Sorry, you don't have access to edit that url.");
    console.log("Edit: canno't perform action as that is not the user's url.");
  } else {
    urlDatabase[id].longURL = urlEdit;
    res.redirect('/urls');
  }
});

/**
 *
 * /u/:id - GET - send user to the longURL.
 *
 */

app.get("/u/:id", (req, res) => {
  const urls = { id: req.params.id, longURL: urlDatabase[req.params.id].longURL };

  if (!urlIdLookup(urls.id)) {
    res.send("Sorry, the url with that id could not be located. Please try again");
    console.log(`Url with ID: ${urls.id} could not be found`);
  } else if (urls.longURL.includes('http://') || urls.longURL.includes('https://')) {
    res.redirect(urls.longURL);
  } else {
    res.redirect(`https://${urls.longURL}`);
  }
});

/**
 *
 * / - GET - sends user to the homepage.
 *
 */

app.get("/", (req, res) => {
  res.send("Hello!");
});

/**
 *
 * /urls - GET - sends user to page with all of their urls.
 *
 */

app.get("/urls" ,(req, res) => {
  const templateVars = {
    urls: urlsForUser(req.cookies["user_id"]),
    user: users[req.cookies["user_id"]], // usr[12345]
  };

  //res.send(templateVars.urls);
  res.render("urls_index.ejs", templateVars);
});

/**
 *
 * /urls/new - GET - sends user to the "create new" url template.
 *
 */

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],
  };

  if (!templateVars.user) {
    console.log("user is not logged in, sending to login page");
    res.redirect('/login');
  } else {
    res.render("urls_new.ejs", templateVars);
  }
});

/**
 *
 * /urls/:id - GET - sends to the user to the individual short url template.
 *
 */

app.get("/urls/:id" ,(req, res) => {

  console.log(urlIdLookup(req.params.id));
  const templateVars = {
    id: req.params.id,
    user: users[req.cookies["user_id"]],
  };

  // Check if user is logged in and if the short url exists before rendering the show template.
  if (!req.cookies["user_id"]) {
    res.redirect('/unauthorized');
    console.log("User canno't view page because they aren't logged in or registered.");
  } else if (!urlIdLookup(req.params.id)) {
    res.send("Sorry, the page you are looking for canno't be found. Please try again.");
    console.log("User canno't view page because the url id doesn't exist.");
  } else if (templateVars.user.id !== urlDatabase[req.params.id].userID) {
    res.send("Sorry, you dont own that url.");
    console.log("User canno't view page because they don't own the url");
  } else {
    templateVars["longURL"] = urlDatabase[req.params.id].longURL;
    res.render("urls_show.ejs", templateVars);
  }


});

/**
 *
 * /login - GET - sends user to the login template.
 *
 */

app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],
  };
  if (templateVars.user) {
    console.log("user is logged in, redirecting to urls");
    res.redirect('/urls');
  } else {
    console.log("user is logged out, sending to login page");
    res.render("login.ejs", templateVars);
  }
});

/**
 *
 * /login - POST - Logs a user into the app.
 *
 */

app.post('/login', (req, res) => {
  const { loginEmail, loginPassword } = req.body;
  // check that email and password match
  const user = userLookup(loginEmail);

  if (!loginEmail || !loginPassword) {
    res.status(400).send('Invalid credentials, please try again.');
    //const usersPassword = user.password;
  } else if (user === null) {
    res.status(403).send(`user ${loginEmail} could not be found in the database`);
    console.log(`user ${loginEmail} could not be found in the database`);
  } else if (loginPassword !== user.password) {
    res.status(403).send('Invalid credentials, please try again.');
    console.log(`User's submitted password ${loginPassword} does not match ${user.password}`);
  } else {
    res.cookie("user_id", String(user.id));
    res.redirect('/urls');
  }
});

/**
 *
 * /logout - POST - Logs a user out of the app.
 *
 */

app.post('/logout', (req, res) => {
  console.log("Logged user out");
  res.clearCookie("user_id");
  res.redirect('/login');
});

/**
 *
 * /register - GET - sends the user to the register template.
 *
 */

app.get("/register", (req, res) => {
  const templateVars = {
    id: req.params.id,
    user: users[req.cookies["user_id"]],
  };

  if (templateVars.user) {
    console.log("user is logged in, redirecting to urls");
    res.redirect('/urls');
  } else {
    console.log("user is logged out, sending to login page");
    res.render("register.ejs", templateVars);
  }
});

/**
 *
 * /register - POST - adds a user to the user database.
 *
 */

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  const userID = generateRandomString();

  // handle empty email or password inputs
  if (!email || !password) {
    res.status(400).send('Invalid credentials, please try again.');
  // handle duplicate email address
  } else if (userLookup(email) !== null) {
    res.status(400).send(`Sorry, ${email} has already been registered.`);
    console.log(`Unable to register user: ${email} has already been registered.`);
  } else {
    users[userID] = { id: userID, email: email, password: password };
    res.cookie("user_id", userID);

    console.log(`Adding user: ${email} and setting user_id cookie.`);
    console.log(users);

    res.redirect('/urls');
  }
});

/**
 *
 * /unauthorized - sends a user to an "unauthorized user" template
 *
 */

app.get('/unauthorized', (req, res) => {

  const templateVars = {
    user: users[req.cookies["user_id"]],
  };
  res.render("unauthorizedUser.ejs", templateVars);
});

/**
 *
 * Starts the  express webserver.
 *
 */

app.listen(PORT, () => {
  console.log(`Example app listening on port https://localhost:${PORT}/`);
});