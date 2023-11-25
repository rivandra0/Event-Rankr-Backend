import express from 'express'
import pinService from '../services/pinService.js'
import { assert, number, string } from 'superstruct'
import { Pin } from '../structs/index.js'

import authorizeAccount from '../middlewares/authorizeAccount.js'
const router = express.Router()

router.get('/:accountId', authorizeAccount(['SUPERADMIN','NEOTER']),async (req, res)=> {
    try {
        let accountId = Number(req.params.accountId) 
        //checking data type from user
        console.log(accountId)

        assert(accountId, number())
        let getResult = await pinService.getMany(accountId);
        
        res.status(200).json({ data: getResult })
    }
    catch (err) {
        res.status(err.code || 500).json({message: err.message})
    }
})

//insertOne
router.post('/', authorizeAccount(['SUPERADMIN']),async (req, res)=> {
    try {
        let pinData = {
            accountId: req.body.data.accountId,
            playerId: req.body.data.playerId
        } 
        //checking data type from user
        assert(pinData, Pin)

        let insertedPin = await pinService.insertOne(pinData);
        
        res.status(200).json({ message:'Successfuly Pin Player', data: insertedPin })
    }
    catch (err) {
        res.status(err.code || 500).json({message: err.message})
    }
})

//deleteOne
router.delete('/:accountId/:playerId', authorizeAccount(['SUPERADMIN']), async (req, res) => {
    try {    
        let pinData = {
            accountId : Number(req.params.accountId),
            playerId : Number(req.params.playerId)
        }
        
        assert(pinData.accountId, number())
        assert(pinData.playerId, number())

        let deleteResult = await pinService.deleteOne(pinData)
        res.status(200).json({message: deleteResult.message})

    } catch (err) {
        res.status(err.code || 500).json({message: err.message})
    } 
})

export default router