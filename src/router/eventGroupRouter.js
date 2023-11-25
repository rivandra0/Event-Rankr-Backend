import express from 'express'
import eventGroupService from '../services/eventGroupService.js'
import { assert, number, string } from 'superstruct'
import { EventGroup } from '../structs/index.js'

import authorizeAccount from '../middlewares/authorizeAccount.js'
const router = express.Router()

//getMany
router.get('/all', authorizeAccount(['SUPERADMIN', 'NEOTER']), async (req, res) => {
    try {
        let eventGroupResult = await eventGroupService.getMany();
        
        res.status(200).json({ data: eventGroupResult.data })
    }
    catch (err) {
        res.status(err.code || 500).json({message: err.message})
    }
})

//getOne
router.get('/:id', authorizeAccount(['SUPERADMIN', 'NEOTER']), async (req, res) => {
    try {
        let eventGroupId = Number(req.params.id)
        assert(eventGroupId, number())

        let eventGroupResult = await eventGroupService.getOne(eventGroupId);
        
        res.status(200).json({ data: eventGroupResult.data })
    }
    catch (err) {
        res.status(err.code || 500).json({message: err.message})
    }  
})

//insertOne
router.post('/', authorizeAccount(['SUPERADMIN']),async (req, res)=> {
    try {

        let eventGroupData = {
            name: req.body.data.name,
            description: req.body.data.description
        } 
        //checking data type from user
        assert(eventGroupData, EventGroup)

        let insertedResult = await eventGroupService.insertOne(eventGroupData);
        
        res.status(200).json({message:insertedResult.message , data: insertedResult.data})
    }
    catch (err) {
        res.status(err.code || 500).json({message: err.message})
    }
})

//deleteOne
router.delete('/:id', authorizeAccount(['SUPERADMIN']), async (req, res) => {
    try {    
        let eventGroupId = Number(req.params.id)
        assert(eventGroupId, number())
        let deleteResult = await eventGroupService.deleteOne(eventGroupId)
        res.status(200).json({ message: deleteResult.message })

    } catch (err) {
        res.status(err.code || 500).json({message: err.message})
    } 
})

//updateOne
router.patch('/:id', authorizeAccount(['SUPERADMIN']),async (req, res) => {
    try {
        let eventGroupId = Number(req.params.id)
        
        let eventGroupData = {
            name:req.body.data.name,
            description: req.body.data.description
        }

        assert(eventGroupId, number())
        assert(eventGroupData, EventGroup)

        let updateResult = await eventGroupService.updateOne(eventGroupId, eventGroupData)
        res.status(200).json({ data:updateResult.data, message: updateResult.message })

    } catch (err) {
        res.status(err.code || 500).json({message: err.message})
    } 
})

export default router