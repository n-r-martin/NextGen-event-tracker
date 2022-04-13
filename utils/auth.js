const withAuth = (req, res, next) => {
  // If the user is not logged in, redirect the request to the login route
  if (!req.session.logged_in) {
    // res.redirect('/home');
    res.status(401).json({"message":"unauthorized"});
  } else {
    next();
  }
};

module.exports = withAuth;
