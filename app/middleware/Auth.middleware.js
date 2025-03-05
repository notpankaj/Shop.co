const jwt = require('jsonwebtoken');
const KEYS = require('../config/keys');
const User = require('../models/User.model');


module.exports = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        let token = ''

        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else {
            token = authHeader
        }

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, KEYS.JWT_SECRET);
        const userId = decoded.userId;
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'No User Found!' });
        }
        delete user._doc.password

        if (user.isDeleted) {
            return res.status(401).json({ message: 'User account is not accessible!' });
        }
        req.user = user
        req.userId = userId
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Token is not valid' });
    }
}