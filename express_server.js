/**
* Express_server - sets up the web server and routing for TinyApp using Express.
*/

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
// require cookie-parser
const cookieParser = require('cookie-parser');

// Set the default view engine to ejs
app.set('view engiine', 'ejs');

/**
 * generateRandomString - will generate a string that we'll use as the 'minified' url.
 */

const generateRandomString = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';

  let randomCharacters = [];
  for (let i = 0; i < 6; i++) {
    randomCharacters.push(characters[Math.floor(Math.random() * characters.length)]);
  }
  const shortUrl = randomCharacters.join("");
  //console.log(shortUrl);
  return shortUrl;
};

/**
 * userLookup - returns either true or false if a the supplied email is already found in our users database.
 */

const userLookup = (email) => {

  for (const x in users) {
    if (users[x].email === email) {
      return users[x];
    }
  }
  return null;
};

// URL Databse
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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
 * MiddleWare
*/

// Will return the from submission buffer as a human readable string.
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Routes
*/

// Create URL - POST
app.post("/urls", (req, res) => {
  const shortUrl = generateRandomString();
  const longUrl = req.body.longURL;

  urlDatabase[shortUrl] = longUrl;
  console.log(urlDatabase);

  const templateVars = { id: shortUrl,
    longURL: longUrl,
    user: users[req.cookies["user_id"]],
  };

  res.redirect(`/urls/${shortUrl}`);
});

// Delete URL - POST
app.post('/urls/:id/delete', (req, res)=> {
  const { id } = req.params;
  console.log(`url with an id of ${id} : ${urlDatabase[id]} has been deleted from the database`);
  delete urlDatabase[id];
  res.redirect('/urls');
});

// Edit URL - POST
app.post('/urls/:id', (req, res) => {
  const { id } = req.params;
  const { urlEdit } = req.body;
  console.log(`changing ${id} : ${urlDatabase[id]} to ${urlEdit}`);
  urlDatabase[id] = urlEdit;
  console.log(urlDatabase);
  res.redirect('/urls');
});

// Redirect from Tiny URL to actual URL
app.get("/u/:id", (req, res) => {
  const urls = { id: req.params.id, longURL: urlDatabase[req.params.id] };

  if (urls.longURL.includes('http://') || urls.longURL.includes('https://')) {
    res.redirect(urls.longURL);
  }
  res.redirect(`https://${urls.longURL}`);
});

// Homepage
app.get("/", (req, res) => {
  res.send("Hello!");
});

// URLs index
app.get("/urls" ,(req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]], // usr[12345]
  };
  console.log(templateVars);
  res.render("urls_index.ejs", templateVars);
});

// Route - URL new - renders the page to submit a new URL.
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],
  };
  //console.log(templateVars.user.id);

  res.render("urls_new.ejs", templateVars);
});

/**
 * /urls/:id - GET - (show) passes the url key => value to the template using req.params
 */
app.get("/urls/:id" ,(req, res) => {

  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[req.cookies["user_id"]],
  };
  console.log(req.cookies);
  res.render("urls_show.ejs", templateVars);
});

/**
 *
 * /login - GET - returns the login template.
 *
 */

app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],
  };
  res.render("login.ejs", templateVars);
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

// Route - /logout - POST - Logs a user out of the app.
app.post('/logout', (req, res) => {
  console.log("Logged user out");
  res.clearCookie("user_id");
  res.redirect('/login');
});

// Route - /register - GET -  returns the registrations template
app.get("/register", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[req.cookies["user_id"]],
  };
  res.render("register.ejs", templateVars);
});

// Route - /register - POST - adds a user to the user database.
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

app.listen(PORT, () => {
  console.log(`Example app listening on port https://localhost:${PORT}/`);
});