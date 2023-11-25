import express from 'express'
import accountService from '../services/accountService.js'
import { assert, number, string } from 'superstruct'
import { Account } from '../structs/index.js'

import authorizeAccount from '../middlewares/authorizeAccount.js'
const router = express.Router()

//insertOne
router.post('/', authorizeAccount(['SUPERADMIN']),async (req, res)=> {
    try {
        let accountData = {
            username: req.body.data.username,
            password: req.body.data.password,
            groupId: req.body.data.groupId
        } 
        console.log(accountData)
        //checking data type from user
        assert(accountData, Account)

        let insertedAccount = await accountService.insertOne(accountData);
        
        res.status(200).json({ data: insertedAccount.data, message: insertedAccount.message })
    }
    catch (err) {
        res.status(err.code || 500).json({message: err.message})
    }
})

//deleteOne
router.delete('/:id', authorizeAccount(['SUPERADMIN']), async (req, res) => {
    try {    
        let accountId = Number(req.params.id)
        
        assert(accountId, number())
        let deleteResult = await accountService.deleteOne(accountId)
        res.status(200).json( { message: deleteResult.message } )

    } catch (err) {
        res.status(err.code || 500).json({message: err.message})
    } 
})

//updatePassword
router.patch('/', authorizeAccount(['NEOTER']),async (req, res) => {
    try {
        let newPassword = req.body.data.newPassword
        let accountData = req.tokenPayload
        
        assert(newPassword, string())
        
        let updateResult = await accountService.updatePassword(accountData.id, newPassword)
        res.status(200).json({ message: updateResult.message })

    } catch (err) {
        res.status(err.code || 500).json({message: err.message})
    } 
})

export default router