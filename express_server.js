/**
* Express_server - sets up the web server and routing for TinyApp using Express.
*/

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

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

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

/**
 * MiddleWare
*/

// Will return the from submission buffer as a human readable string.
app.use(express.urlencoded({ extended: true }));

// New URL - POST
app.post("/urls", (req, res) => {
  console.log(req.body);
  res.send("ok");
});


// Route - homepage
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Route - Urls.json
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Route - URLs index
app.get("/urls" ,(req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index.ejs", templateVars);
});

// Route - URL new - renders the page to submit a new URL.
app.get("/urls/new", (req, res) => {
  res.render("urls_new.ejs");
});

// Route - URL show - passes the url key => value to the template using req.params
app.get("/urls/:id" ,(req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show.ejs", templateVars);
});

// Route - html example
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});