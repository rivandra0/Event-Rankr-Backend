import dotenv from 'dotenv'
import jwt from '../modules/jwt.js'
dotenv.config()

function authorizeAccount (AccountGroups) {
    return function (req, res, next) {
        const authorizationHeader = req.headers['authorization'];

        //if they don't have authorization header
        if(!authorizationHeader) {
            res.status(401).json({ message: 'Authorization header missing' })
            return
        }
    
        // Extract the token from the "Bearer" scheme
        const token = authorizationHeader.split(' ')[1];
        
        let payload
        try {
            payload = jwt.verifyToken(token)
            req.tokenPayload = payload
        } catch(err) {
            res.status(400).json({ message:`invalid token: ${err.message} ` })
            return
        }

        //checking if their group is allowed
        if(!AccountGroups.includes(payload.accountGroup)) {
            res.status(403).json({message:`your're account is unauthorized`})
            return
        }
        next()
        return
    }
}

export default authorizeAccount