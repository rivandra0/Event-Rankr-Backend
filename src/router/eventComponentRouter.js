import express from 'express'
import eventComponentService from '../services/eventComponentService.js'
import { assert, number } from 'superstruct'
import { EventComponent } from '../structs/index.js'

import authorizeAccount from '../middlewares/authorizeAccount.js'
const router = express.Router()


//insertOne
router.post('/', authorizeAccount(['SUPERADMIN']),async (req, res)=> {
    //eventGroupId, name, order, isActive, startDate
    try {
        let eventComponentData = {
            eventId: req.body.data.eventId,
            name: req.body.data.name,
            type: req.body.data.type,
            rules: req.body.data.rules,
            componentOrder: req.body.data.componentOrder,
        }
         
        //checking data type from user
        assert(eventComponentData, EventComponent)
        
        let insertedResult = await eventComponentService.insertOne(eventComponentData);
        
        res.status(200).json( { message:insertedResult.message, data:insertedResult.data } )
    }
    catch (err) {
        res.status(err.code || 500).json({message: err.message})
    }
})

//deleteOne
router.delete('/:id', authorizeAccount(['SUPERADMIN']), async (req, res) => {
    try {    
        let eventComponentId = Number(req.params.id)
        assert(eventComponentId, number())
        let deleteResult = await eventComponentService.deleteOne(eventComponentId)
        res.status(200).json( { message: deleteResult.message } )

    } catch (err) {
        res.status(err.code || 500).json({message: err.message})
    } 
})


export default router