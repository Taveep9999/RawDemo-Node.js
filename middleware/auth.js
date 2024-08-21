const jwt = require('jsonwebtoken')
require('dotenv').config();
const knex = require('../db/dbnaja');



const vft = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('No valid token provided');
    }

    const token = authHeader.split(' ')[1].trim();

    try {
        const tokena = jwt.verify(token, process.env.secret);
        /*console.log('Decoded Token ja:', tokena);*/
        req.user = tokena;
        return next();
    } catch (err) {
        console.error('Error:', err);
        return res.status(401).send('Token not correct');
    }
}

const role1 = (wrole) => {
    return async (req, res, next) => {
        if (req.user && req.user.role === wrole) {
            return next();
        } else {
            return res.status(403).send('Permission denied');
        }
    }
}


module.exports = {
    vft,
    role1
};
