const express = require("express");
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const passport = require('passport');

const app = express();
const port = process.env.PORT || 3000;

//bring all routes
const auth = require('./routes/api/auth');
const profile = require('./routes/api/profile')
const feed = require('./routes/api/feed');

// // Middleware for body-parser
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

//Passport middleware
app.use(passport.initialize());

//Config for JWT strategy
require("./strategies/jsonwtStrategy")(passport);

// test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use('/api/auth', auth);
app.use('/api/feed', feed);
app.use('/api/profile', profile);

// Mongo Db config
const db = require('./setup/myurl').mongoURL;

// Attemb to connect to db
mongoose.connect(db).then( () => {
    console.log('database connected successfully')
}).catch(err => console.log(err));

//Listen to port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});