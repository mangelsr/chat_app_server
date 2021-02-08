const jwt = require('jsonwebtoken');

const generateJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(payload, process.env.JWT_KEY, {
            expiresIn: '24h',
        }, (err, token) => {
            if (err) {
                reject("Token can't be created");
            } else {
                resolve(token);
            }
        });
    });
};

const testJWT = (token = '') => {
    try {
        const { uid } = jwt.verify(token, process.env.JWT_KEY);
        return [true, uid];
    } catch(err) {
        console.log(err);
        return [false, null];
    }
};

module.exports = {
    generateJWT,
    testJWT,
};