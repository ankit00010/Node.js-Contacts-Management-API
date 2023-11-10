const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;

    let authHeader = req.headers.Authorization || req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        const tokenArray = authHeader.split(" ");
        token = tokenArray.length >= 2 ? tokenArray[1] : null;

        if (!token) {
            res.status(401);
            throw new Error("Not authorized");
        } else {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    res.status(401);
                    return next(new Error("User is not authorized"));
                }
                req.user = decoded.user;
                next();
            });
        }
    } else {
        res.status(401);
        throw new Error("Not authorized");
    }
});

module.exports = validateToken;
