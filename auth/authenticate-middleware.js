const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if(token){
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
          if(err){
              res.status(401).json({ message: 'Invalid credentials!' });
          }
          else{
              req.user = {
                  username: decodedToken.username
                };
              next();
          }
      });
  }
  else{
      res.status(400).json({ message: 'You do not have a TOKEN' });
  }

};