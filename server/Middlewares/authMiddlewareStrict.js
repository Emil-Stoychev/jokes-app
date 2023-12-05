const jwt = require("jsonwebtoken");

let secret = process.env.secret;

async function authMiddlewareStrict(req, res, next) {
    try {
      let info = jwt.verify(req.params.token || req.body.token, secret);
  
      req.params.user = info;
  
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token!' });
    }
}

module.exports = {
  authMiddlewareStrict,
};
