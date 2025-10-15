const jwt = require('jsonwebtoken');

const BLACKLIST_FILE = 'API_DATA/BLACKLIST.txt';
const { readFile, writeFile } = require('../helpFunctions/fileHelper');

function authentication(req, res, next) {

    // Check for token in Authorization header
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const secretKey = process.env.JWT_SECRET_KEY;
        const payload = jwt.verify(token, secretKey);

        // Check if the token is blacklisted
        let blacklist = [];
        try {
            blacklist = readFile(BLACKLIST_FILE);
        } catch (err) {
            console.error('Error reading blacklist file:', err);
        }
        if (blacklist.includes(payload.jti)) {
            return res.status(401).json({ message: 'Token is blacklisted' });
        }

        // Filter expired tokens from the blacklist
        blacklist = blacklist.filter(jti => {
            try {
                jwt.verify(jti, secretKey);
                return true;
            } catch (e) {
                return false;
            }
        });

        // Load the user data into the request in req.USER
        req.USER = {
            email: payload.email,
            id: payload.id
        }
        next();
    }
    catch (err) {
        console.error('Token validation error:', err);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authentication;