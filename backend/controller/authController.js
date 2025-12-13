const user = require('../models/User.js');

const generateToken = require('../utils/generateToken.js');

// Admin Login Controller

const adminLogin = async(req, res) => {
    const {username, password} = req.body;
    const existingUser = await user.findOne({username}).select('+password');
    if(existingUser && (await existingUser.matchPassword(password))){
        res.json({
            _id: existingUser._id,
            username: existingUser.username,
            role: existingUser.role,
            token: generateToken(existingUser._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid username or password');
    }
}

module.exports = {adminLogin};