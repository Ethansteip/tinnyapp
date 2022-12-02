/**
 *
 * Express_server.js - initializes the webserver and handles all of TinyApp's routing.
 *
*/

// Import required libraries and functions
const express = require("express");
const app = express();
const PORT = 8080;
const cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs");
const { generateRandomString, getUserByEmail, urlsForUser, urlIdLookup } = require("./helper.js");

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
    password: "$2a$10$3GVbAzBiwABZ5CcMs7rsXePtI8wwJLKZL9mVMpL7drv9josqu.MdK",

  },
  '12345': {
    id: "12345",
    email: "ethan.steip@gmail.com",
    password: "$2a$10$IpfSpG9HMIxAaoiW0W/BduItqapZkUzLwzWSzZ9g1QNg0GFhSzECG",
  },
};

/**
 *
 * MiddleWare
 *
*/

app.use(express.urlencoded({ extended: true }));
app.set('view engiine', 'ejs');
app.use(cookieSession({
  name: 'session',
  keys: ['yuiebfwqeidnifbtebuilbcrebfj'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

/**                                                                    /**
 *                                                                      *
 * ----------------------------- Routes ------------------------------- *
 *                                                                      *
*/                                                                      /*

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
    user: req.session.userId,
  };

  // Don't let non-logged in users submit post requests to /urls.
  if (!templateVars.user) {
    res.send("Sorry, but you will need to be logged in to access this page!");
    console.log(`User is not authorized to access the create url page.`);
  } else {
    urlDatabase[shortUrl] = {longURL: longUrl, userID: templateVars.user};
    res.redirect(`/urls/${shortUrl}`);
  }
});

/**
 *
 * Delete URL - POST - allows the user to delete their URLs
 *
 */

app.post('/urls/:id/delete', (req, res)=> {

  const { id } = req.params;

  // check to see if url id exists, if user is logged in and if the url belongs to the user before deleting.
  if (!req.session.userId) {
    res.send("Sorry, you need to be logged in to perform that action");
    console.log("Delete: canno't perform action as user is not logged in or registered.");
  } else if (!urlIdLookup(id, urlDatabase)) {
    res.send("Sorry, we canno't find a url with that id");
    console.log("Delete: canno't find url with that id");
  } else if (req.session.userId !== urlDatabase[id].userID) {
    res.send("Sorry, you don't have access to delete that url.");
    console.log("Delete: canno't perform action as that is not the user's url.");
  } else {
    console.log(`URL with an id of ${id} : ${urlDatabase[id].longURL} has been deleted from the database \n updated url database:`);
    delete urlDatabase[id];
    res.redirect('/urls');
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
  if (!urlIdLookup(id, urlDatabase)) {
    res.send("Sorry, we canno't find a url with that id");
    console.log("Edit: canno't find url with that id");
  } else if (!req.session.userId) {
    res.send("Sorry, you need to be logged in to perform that action");
    console.log("Edit: canno't perform action as user is not logged in or registered.");
  } else if (req.session.userId !== urlDatabase[id].userID) {
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

  if (!urlIdLookup(urls.id, urlDatabase)) {
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
 * / - GET - sends user to the either urls or login template based on whether they are logged in or not.
 *
 */

app.get("/", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.redirect('/login');
  } else {
    res.redirect('/urls');
  }
});

/**
 *
 * /urls - GET - sends user to page with all of their urls.
 *
 */

app.get("/urls" ,(req, res) => {

  const userId = req.session.userId;
  const templateVars = {
    urls: urlsForUser(userId, urlDatabase), // user.id
    user: users[req.session.userId], // usr[12345]
  };

  res.render("urls_index.ejs", templateVars);
});

/**
 *
 * /urls/new - GET - sends user to the "create new" url template.
 *
 */

app.get("/urls/new", (req, res) => {

  const templateVars = {
    user: users[req.session.userId],
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

  const templateVars = {
    id: req.params.id,
    user: users[req.session.userId],
    userId: req.session.userId
  };

  // Check if user is logged in and if the short url exists before rendering the show template.
  if (!req.session.userId) {
    res.redirect('/unauthorized');
    console.log("User canno't view page because they aren't logged in or registered.");
  } else if (!urlIdLookup(req.params.id, urlDatabase)) {
    res.send("Sorry, the page you are looking for canno't be found. Please try again.");
    console.log("User canno't view page because the url id doesn't exist.");
  } else if (templateVars.userId !== urlDatabase[req.params.id].userID) {
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
    user: req.session.userId,
  };

  if (templateVars.user) {
    console.log("user is logged in, redirecting to urls");
    res.redirect('/urls');
  } else {
    console.log("user is logged out, sending to /login page");
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
  const user = getUserByEmail(loginEmail, users);

  // if user does not submit email or password
  if (!loginEmail || !loginPassword) {
    res.status(400).send('Invalid credentials, please try again.');
  }
  // Check that the email/user exists in our db
  if (user === null) {
    res.status(403).send(`User ${loginEmail} could not be found in the database`);
    console.log(`user ${loginEmail} could not be found in the database`);
  }

  // compare submitted password against hash.
  const passwordCheck = bcrypt.compareSync(loginPassword, user.password);

  // Check that passwords match.
  if (!passwordCheck) {
    res.status(403).send('Invalid credentials, please try again.');
    console.log(`User submiited the incorrect password`);
  } else {
    //write a cookie
    req.session.userId = user.id;
    res.redirect('/urls');
    console.log("Credentials are a match. Logging the user in.");
  }
});

/**
 *
 * /logout - POST - Logs a user out of the app by removing cookies.
 *
 */

app.post('/logout', (req, res) => {

  console.log("Logged user out");
  req.session = null;
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
    user: req.session.userId,
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
  const hashedPassword = bcrypt.hashSync(password, 10);
  const userID = generateRandomString();

  // handle empty email or password inputs
  if (!email || !password) {
    res.status(400).send('Invalid credentials, please try again.');
  // handle duplicate email address
  } else if (getUserByEmail(email, users) !== null) {
    res.status(400).send(`Sorry, ${email} has already been registered.`);
    console.log(`Unable to register user: ${email} has already been registered.`);
  } else {
    users[userID] = { id: userID, email: email, password: hashedPassword };
    //write cookie here
    req.session.userId = userID;

    console.log(`Adding user: ${email} and setting user_id cookie.`);
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
    user: req.session.userId,
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