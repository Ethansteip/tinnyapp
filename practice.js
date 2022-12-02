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


const urlsForUser = (userId) => {

  let newObj = {};

  for (const x in urlDatabase) {
    if (urlDatabase[x].userID === userId) {
      newObj[x] = urlDatabase[x].longURL;
    }
  }

  console.log(newObj);
  // return usersURLs;
};

urlsForUser("12345");
