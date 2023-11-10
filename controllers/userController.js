const asyncHandler = require('express-async-handler');
const User = require("../Models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Register a user
//@route POST /api/users/register
//@access PUBLIC

const userRegister = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;  // destructuring

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");      // null values validation
    }

    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
        if (userExists.username === username) {
            res.status(400);
            throw new Error("Username already exists");     //Username already exists???
        } else {
            res.status(400);
            throw new Error("User with the given email already exists"); //email exists???
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);  //hashing the password

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    if (newUser) {
        res.status(201).json({
            message: "User registered Successfully",
            success: "true",
            user: newUser,
        })
    }
    else {
        res.status(400);
        throw new Error("User data is not valid");
    }
});


//@desc Login a user
//@route POST /api/users/login
//@access PUBLIC
const userLogin = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

    if ((!username || !email) || !password) {
        res.status(400);
        throw new Error("All fields are required");

    }



    const user = await User.findOne({ $or: [{ username }, { email }] });

    //comparing the password and hashedpassword 
    if (user && (await bcrypt.compare(password, user.password))) {
        const accesToken = jwt.sign({
            user: {                         //payload 
                username: user.username,
                email: user.email,
                id: user.id,
            }
        },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }

        );
        res.status(200).json({ accesToken });

    }
    else {
        res.status(401);
        throw new Error("email or password is not valid");
    }

    res.json({
        message: "Login the user"
    })
});

//@desc Current user info
//@route GET /api/users/current
//@access PUBLIC

const getUser = asyncHandler(async (req, res) => {
    res.json(
        req.user
    );
});

module.exports = { userLogin, userRegister, getUser };