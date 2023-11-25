import express from 'express'
import eventService from '../services/eventService.js'
import { assert, number, string } from 'superstruct'
import { Event } from '../structs/index.js'

import authorizeAccount from '../middlewares/authorizeAccount.js'
const router = express.Router()


//insertOne
router.post('/', authorizeAccount(['SUPERADMIN']),async (req, res)=> {
    //eventGroupId, name, order, isActive, startDate
    try {
        let eventData = {
            eventGroupId: req.body.data.eventGroupId,
            name: req.body.data.name,
            eventOrder: req.body.data.eventOrder,
            isActive: req.body.data.isActive,
            startDate: new Date(req.body.data.startDate),
        }
         
        //checking data type from user
        assert(eventData, Event)
        
        let insertedResult = await eventService.insertOne(eventData);
        
        res.status(200).json({ message:insertedResult.message, data: insertedResult.data })
    }
    catch (err) {
        res.status(err.code || 500).json({message: err.message})
    }
})

//deleteOne
router.delete('/:id', authorizeAccount(['SUPERADMIN']), async (req, res) => {
    try {    
        let eventId = Number(req.params.id)
        assert(eventId, number())
        let deleteResult = await eventService.deleteOne(eventId)
        res.status(200).json( { message: deleteResult.message } )

    } catch (err) {
        res.status(err.code || 500).json({message: err.message})
    } 
})

//updateOne
router.patch('/:id', authorizeAccount(['SUPERADMIN']),async (req, res) => {
    try {
        let eventId = Number(req.params.id)
        
        let eventData = {
            eventGroupId: req.body.data.eventGroupId,
            name: req.body.data.name,
            eventOrder: req.body.data.eventOrder,
            isActive: req.body.data.isActive,
            startDate: new Date(req.body.data.startDate),
        }

        assert(eventId, number())
        assert(eventData, Event)

        let updateResult = await eventService.updateOne(eventId, eventData)
        res.status(200).json({ message: updateResult.message, data:updateResult.data })

    } catch (err) {
        res.status(err.code || 500).json({message: err.message})
    } 
})

//getOne
router.get('/:id', authorizeAccount(['SUPERADMIN', 'NEOTER']), async (req, res) => {
    try {
        let eventId = Number(req.params.id)
        assert(eventId, number())

        let eventData = await eventService.getOne(eventId);
        
        res.status(200).json(eventData)
    }
    catch (err) {
        res.status(err.code || 500).json({message: err.message})
    }  
})


export default router