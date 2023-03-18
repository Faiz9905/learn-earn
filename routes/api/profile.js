const express = require('express');
const passport = require('passport');
const mongoose = require("mongoose");
const router = express.Router();

const Profile = require("../../models/Profile");

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  // res.send('Hello')
  // res.json({user: req.user.id})
  Profile.findOne({ user: req.user.id })
  .then(profile => {
    if (!profile) {
      return res.status(404).json({ profilenotfound: "No profile Found" });
    }
    res.json(profile);
  })
  .catch(err => console.log("got some error in profile " + err));
});

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profileValues = {};
    profileValues.user = req.user.id;
    if (req.body.username) profileValues.username = req.body.username;
    if (req.body.website) profileValues.website = req.body.website;
    if (req.body.country) profileValues.country = req.body.country;

    //Do database stuff
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileValues },
            { new: true }
          )
            .then(profile => res.json(profile))
            .catch(err => console.log("problem in update" + err));
        } else {
          Profile.findOne({ username: profileValues.username })
            .then(profile => {
              //Username already exists
              if (profile) {
                res.status(400).json({ username: "Username already exists" });
              }
              //save user
              new Profile(profileValues)
                .save()
                .then(profile => res.json(profile))
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log("Problem in fetching profile" + err));
  }
);

router.get('/details', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user : req.user.id})
  .then(profile => {
    Person.findOne({_id : profile.user})
    .then((person) => {
      res.json({profile, person});
    })
    .catch(err => console.log(err))
    
  })
  .catch(err => console.log(err))
});

router.get('/:username', (req, res) => {
  Profile.findOne({username : req.params.username}).then((profile) => {
    if(!profile){
      res.status({"usernamenotfound" : "user name not found"});
    }
    res.json(profile);
  }).catch(err => console.log(err))
})
module.exports = router;