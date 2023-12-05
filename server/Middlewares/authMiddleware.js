const jwt = require("jsonwebtoken");

let secret = process.env.secret;

async function authMiddleware(req, res, next) {
      let info = jwt.verify(req.params.token || req.body.token, secret);
  
      req.params.user = info;
  
      next();
}

module.exports = {
  authMiddleware,
};
