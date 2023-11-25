import express from 'express'
import playerService from '../services/playerService.js'
import { assert, number } from 'superstruct'
import { Player } from '../structs/index.js'

import authorizeAccount from '../middlewares/authorizeAccount.js'
const router = express.Router()

//getMany --according to eventGroupId
router.get('/all/:eventGroupid', authorizeAccount(['SUPERADMIN', 'NEOTER']), async(req, res) => {
    try {
        let eventGroupId = Number(req.params.eventGroupid) 
        //checking data type
        assert(eventGroupId, number())

        let insertedPlayer = await playerService.getMany(eventGroupId);
        
        res.status(200).json({ data: insertedPlayer })
    }
    catch (err) {
        res.status(err.code || 500).json( { message: err.message } )
    }
})

//insertOne
router.post('/', authorizeAccount(['SUPERADMIN']),async (req, res)=> {
    try {
        let playerData = {
            eventGroupId: req.body.data.username,
            name: req.body.data.name,
            eventGroupId: req.body.data.eventGroupId
            
        } 
        console.log(playerData)
        //checking data type from user
        assert(playerData, Player)

        let insertedPlayer = await playerService.insertOne(playerData);
        
        res.status(200).json({ message:insertedPlayer.message, data: insertedPlayer })
    }
    catch (err) {
        res.status(err.code || 500).json({message: err.message})
    }
})

//deleteOne
router.delete('/:id', authorizeAccount(['SUPERADMIN']), async (req, res) => {
    try {    
        let playerId = Number(req.params.id)
        
        assert(playerId, number())
        let deleteResult = await playerService.deleteOne(playerId)
        res.status(200).json({ message: deleteResult.message })

    } catch (err) {
        res.status(err.code || 500).json({message: err.message})
    } 
})


export default router