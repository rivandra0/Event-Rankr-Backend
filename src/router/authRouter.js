import express from 'express'
import authService from '../services/authService.js'
import { assert } from 'superstruct'
import { Account } from '../structs/index.js'
const router = express.Router()

router.post('/login', async (req, res)=> {
    try {
        let accountData = {
            username: req.body.data.username,
            password: req.body.data.password
        }

        //checking data type from user
        assert(accountData, Account)
        
        let loggedInAccount = await authService.login(accountData);
        
        res.status(200).json({ data: loggedInAccount.data, message: loggedInAccount.message })
    }
    catch (err) {
        res.status(err.code || 500).send(err.message)
    }
})

export default router