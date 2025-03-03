const jwt = require('jsonwebtoken');
const KEYS = require('../config/keys');


module.exports = (req, res, next) => {
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
        req.user = decoded.userId;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Token is not valid' });
    }
}