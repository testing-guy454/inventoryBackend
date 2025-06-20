const cookieOptions = {
  maxAge: 1000*60*60*24*7,  // 7 days
  httpOnly: true,           // Makes the cookie inaccessible to client-side JavaScript
}

const jwtOptions = {
  expiresIn: '7d'           // 7 days
}

module.exports = {
  cookieOptions,
  jwtOptions
}