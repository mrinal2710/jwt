const jwt = require('jsonwebtoken');
const User = require('../model/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    //check json web token exists & is verified
    if (token) {
        jwt.verify(token, process.env.secret, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next();
            }
        })
    } else {
        res.redirect('/login');
    }
}

// Check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    console.log("secret", process.env.secret)
    if (token) {
        jwt.verify(token, process.env.secret, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };