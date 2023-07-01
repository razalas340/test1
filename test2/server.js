const passport = require(`passport`)
const express = require('express');
const path = require('path');
const app = express();
const port = 5500;
require("dotenv").config()
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
app.use(cors({
 origin:['*','https://accounts.google.com'],
 methods:'GET,PUT,PATCH,POST,HEAD',
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://www.example.com/auth/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
  console.log(profile)
//   User.findOrCreate({ googleId: profile.id }, function (err, user) {
//     return cb(err, user);
//   });
}
));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'courseworkAPI.html'));
});

app.get('/home', (req, res) => {
    console.log(res.body)
    res.sendFile(path.join(__dirname, 'home.html'));
  });

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile',      
  "https://www.googleapis.com/auth/classroom.coursework.students.readonly",
  "https://www.googleapis.com/auth/classroom.coursework.me.readonly",
  "https://www.googleapis.com/auth/classroom.coursework.students",
  "https://www.googleapis.com/auth/classroom.coursework.me"] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/home');
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

app.use(function(req, res, next) {
  res.setHeader('Set-Cookie', 'promo_shown=1; SameSite=Lax');
  next();
});