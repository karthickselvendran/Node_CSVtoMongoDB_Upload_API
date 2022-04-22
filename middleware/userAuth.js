const jwt = require('jsonwebtoken');
const Users = require('../schema/users');
const { jwtConstants } = require('../common/constants');

const jwtAuth = async (req, res, next) => {
    const accessToken = req.get('Authorization');
    try {
        const userToken = jwt.verify(accessToken, jwtConstants.secretKey, { expiresIn: jwtConstants.exp_time });
        const userDetails = await Users.findById(userToken._id)
        if (userDetails) {
            req.user = userDetails.toJSON();
        }
    } catch (err) {
        return res.status(401).json(err);
    }
    return next();
}

module.exports = { jwtAuth }