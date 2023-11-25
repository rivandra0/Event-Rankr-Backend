import jwt from 'jsonwebtoken' 
// import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

export default {
    generateToken: (accountData, duration )=> {
        let token = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: duration  }) // duration:'1h, 2h, 3h'
        return token
    },
    verifyToken: (tokenString) => {
        return jwt.verify(tokenString, process.env.ACCESS_TOKEN_SECRET)
    }
}