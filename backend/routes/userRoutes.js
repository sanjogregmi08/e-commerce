import express from 'express';
import asyncHandler from 'express-async-handler';

// Models
import User from '../models/userModel.js';

// JWT generator
import generateJWT from '../util/generateJWT.js';

// Auth middlewares
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc       Authenticate user login
// @route      POST /api/users/login
// @access     Public
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateJWT(user._id)
        });
    } else {
        res.status(401);
        throw new Error('User does not exists or incorrect email or password.');
    }
}));

// @desc       Fetch logged in user profile
// @route      GET /api/users/profile
// @access     Private
router.get('/profile', protect, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
    });
}));

// @desc       Register new user
// @route      POST /api/users
// @access     Public 
router.post('/', asyncHandler(async (req, res) => {
    const { email, name, password } = req.body;
    const userExists = await User.findOne({ email: email });
    if (userExists) {
        res.status(400);
        throw new Error('Bad Request: User exists');
    }
    const user = await User.create({ name, email, password });
    if (user) {
        res.status(201);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateJWT(user._id)
        });
    }
    else {
        res.status(400);
        throw new Error('User not created');
    }
}));

// @desc       Update user profile
// @route      PUT /api/users/profile
// @access     Private
router.put('/profile', protect, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if(user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        // Because password is freshly hashed every time it is updated, we avoid updating password field until client wants
        if(req.body.password) {
            user.password = req.body.password;
        }
        
        await user.save();
        
        res.status(200);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });   
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
}))    
    

export default router;