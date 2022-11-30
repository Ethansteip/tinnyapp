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
 *
 * generateRandomString - will generate a string that we'll use as the 'minified' url.
 *
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

// URL Databse
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
    username: req.cookies["username"]
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
    username: req.cookies["username"]
  };
  res.render("urls_index.ejs", templateVars);
});

// Route - URL new - renders the page to submit a new URL.
app.get("/urls/new", (req, res) => {

  const { username } = req.cookies;
  const templateVars = {
    username: req.cookies["username"],
  };
  console.log(templateVars.username);

  res.render("urls_new.ejs", templateVars);
});

// Route - URL show - passes the url key => value to the template using req.params
app.get("/urls/:id" ,(req, res) => {

  const templateVars = { id: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"]
  };
  console.log(req.cookies);
  res.render("urls_show.ejs", templateVars);
});

// Login
app.post('/login', (req, res) => {
  const { username } = req.body;
  console.log(`Logged in: ${username}`);
  res.cookie("username", username);
  res.redirect('/urls');
});

// Logout
app.post('/logout', (req, res) => {
  const { username } = req.body;
  console.log(`logged out: ${username}`);
  res.clearCookie("username", username);
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port https://localhost:${PORT}/`);
});