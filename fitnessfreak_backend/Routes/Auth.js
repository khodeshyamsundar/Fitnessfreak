const express = require('express');
const router = express.Router();
const User = require('../Models/UserSchema')
const errorHandler = require('../Middlewares/errorMiddleware');
const authTokenHandler = require('../Middlewares/checkAuthToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { cookieOptions } = require('../utils');

//ardo snju okez dpwp
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'khodeshyamsundar@gmail.com',
        pass: 'xwugkrjwxokrpcdb'
    }
})

router.get('/test', async (req, res) => {
    res.json({
        message: "Auth api is working"
    })
})

function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}


router.get('/userdata', authTokenHandler, async (req, res) => {
    const userid = req.userId;
    const user = await User.findById({ _id: userid });
    if (!user) {
        res.send('user not found');
    }
    res.json(createResponse(true, 'fetched user data', {
        name: user.name,
        email: user.email,
        gender: user.gender,
        dob: user.dob,
        height: user.height,
        weight: user.weight,
        goal: user.goal,
        age:user.age,
        activityLevel:user.activityLevel
    }));
})





router.post('/register', async (req, res, next) => {
    console.log(req.body);
    try {
        const { name, email, password, weightInKg, age, heightInCm, gender, dob, goal, activityLevel } = req.body;
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(409).json(createResponse(false, 'Email already exists'));
        }
        const newUser = new User({
            name,
            password,
            email,
            weight: [
                {
                    weight: weightInKg,
                    unit: "kg",
                    date: Date.now()
                }
            ],
            age,
            height: [
                {
                    height: heightInCm,
                    date: Date.now(),
                    unit: "cm"
                }
            ],
            gender,
            dob,
            goal,
            activityLevel
        });
        await newUser.save(); // Await the save operation

        res.status(201).json(createResponse(true, 'User registered successfully'));

    }
    catch (err) {
        next(err);
    }
})
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json(createResponse(false, 'Invalid credentials'));
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json(createResponse(false, 'Invalid credentials'));
        }
           
        const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '50m' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '100m' });
       
       
        res.cookie('authToken', authToken, cookieOptions);
        res.cookie('refreshToken', refreshToken, cookieOptions);
        res.status(200).json(createResponse(true, 'Login successful', {
            authToken,
            refreshToken
        }));
    }
    catch (err) {
        next(err);
    }
})



router.post('/logout', authTokenHandler, async (req, res, next) => {
    try {
        console.log("logging out start...")
        return res
            .status(200)
            .clearCookie("authToken", cookieOptions)
            .clearCookie("refreshToken", cookieOptions)
            .json(createResponse(true, 'Logout successful'))
    } catch (error) {
        next(error)
    }
})

router.post('/sendotp', async (req, res) => {
    try {
        const { email } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000);

        const mailOptions = {
            from: 'khodeshyamsundar@gmail.com',
            to: email,
            subject: 'OTP for verification',
            text: `Your OTP is ${otp}`
        }

        transporter.sendMail(mailOptions, async (err, info) => {
            if (err) {
                console.log(err);
                res.status(500).json(createResponse(false, err.message));
            } else {
                res.json(createResponse(true, 'OTP sent successfully', { otp }));
            }
        });
    }
    catch (err) {
        next(err);
    }
})
router.post('/checklogin', authTokenHandler, async (req, res, next) => {

    try {
        // console.log("checked!")
        res.json({
            ok: true,
            message: 'User authenticated successfully'
        })
    } catch (error) {
        console.log(error)
    }

})
router.use(errorHandler)

module.exports = router;