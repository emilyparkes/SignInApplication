const jwt = require('jsonwebtoken')
const verifyJwt = require('express-jwt')

const db = require('../db/admin')
const jwtTestSecret = require('../../client/lib/jwt-test.secret')

module.exports = {
  issue,
  decode,
  createToken // exported for testing
}

function issue (req, res) {
  db.getAdminByEmail(req.body.email)
    .then(user => {
      const token = createToken(user, process.env.JWT_SECRET)
      res.json({
        message: 'Authentication successful.',
        token
      })
    })
}

function decode (req, res, next) {
  verifyJwt({
    secret: getSecret
  })(req, res, next)
}

function createToken (user, secret) {
  return jwt.sign({
    id: user.id,
    email: user.email
  }, secret, {
    expiresIn: '1d'
  })
}

function getSecret (req, payload, done) {
  const secret = process.env.JWT_SECRET || jwtTestSecret
  if (secret === jwtTestSecret) {
    // console.warn('ATTENTION: Using the JWT Test secret')
  }
  done(null, secret)
}
