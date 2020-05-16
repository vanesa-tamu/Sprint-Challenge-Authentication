const router = require('express').Router();
const Users = require('../models/users-model.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
      .then(saveU => {
          console.log('/register: savedUser', saveU)
          res.status(201).json(saveU)
      })
      .catch(error => {
        console.log(error)
          res.status(500).json({ message: 'cannot add the user' });
      });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body

  Users.findBy({ username })
    .then(user => {
      if(user && bcrypt.compareSync(password, user.password)){
        const token = generateToken(user);
        res.status(200).json({
            message: `Welcome ${user.username}!`,
            token,
          });
    }
    else{
        res.status(401).json({ message: 'Invalid Credentials' })
    }
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({message: `error loggin in!`})
  })
});




function generateToken(user){
  const payload = {
    usernmae: user.username,
    subject: user.id 
  }
  const options = {
    expiresIn: '2d'
  }

  return jwt.sign(payload, process.env.JWT_SECRET, options)
}

module.exports = router;
