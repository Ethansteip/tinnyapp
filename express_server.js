/**
* Express_server - sets up the web server and routing for TinyApp using Express.
*/
 

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// Set the default view engine to ejs
app.set('view engiine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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