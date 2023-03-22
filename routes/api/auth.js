const express = require("express");
const bcrypt = require("bcryptjs");
const jsonwt = require("jsonwebtoken");
const passport = require("passport");
const key = require("../../setup/myurl");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ tex: "test" });
});

//import schema
const Person = require("../../models/Person");

router.post("/register", (req, res) => {
  Person.findOne({ email: req.body.email })
    .then((person) => {
      if (person) {
        return res
          .status(400)
          .json({ emailerror: "email is already registered" });
      } else {
        const newPerson = new Person({
          email: req.body.email,
          password: req.body.password,
          gender: req.body.gender,
        });
         bcrypt.genSalt(10, (err, salt) => {
         bcrypt.hash(newPerson.password, salt, (err, hash) => {
            if(err) throw err;
            newPerson.password = hash;
            newPerson.save()
            .then((person) => res.json(person))
            .catch(err => console.log(err))
          });
        });
      }
    })
    .catch();
});

router.post('/login', (req, res) => {
   const email = req.body.email;
   const password = req.body.password;
   Person.findOne({email}).then((person) => {
    if(!person){
        return res.status(400).json({emailerror : 'email not found'})
    }
    bcrypt.compare(password, person.password)
    .then(isCorrect => {
        if(isCorrect){
           const payload = {
                id: person.id,
                name : person.name,
                email : person.email
            };
            console.log('payload',payload);
            jsonwt.sign(
                payload,
                key.secret,
                {expiresIn : 3600},
                (err, token) => {
                    res.json({
                        success : true,
                        token: "bearer " + token,
                    });
                }
            )
        }
        else{
            return res.status(400).json({passworerror : "password incorrect"})
        }
    })
    .catch(err => console.log(err))

   }).catch(err => console.log(err))
});


router.get('/profile', passport.authenticate('jwt', { session: false }),
    function(req, res) {
       let genderPic;
        req.user.gender === 'male' ? genderPic = req.user.maleprofilepic : (genderPic =  req.user.femaleprofilepic);
        res.json({
            id: req.user.id,
            email: req.user.email,
            gender: req.user.gender,
            dp : genderPic,
            date: req.user.date
          });
    }
);

module.exports = router;
