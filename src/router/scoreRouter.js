import express from 'express'
import scoreService from '../services/scoreService.js'
import { assert } from 'superstruct'
import { Score } from '../structs/index.js'
// import { isDateStringValid } from '../modules/dateValidator.js'

import authorizeAccount from '../middlewares/authorizeAccount.js'
const router = express.Router()

//upsertOne
router.post('/', authorizeAccount(['SUPERADMIN', 'NEOTER']),async (req, res)=> {
    try {
        let scoreData = {
            eventComponentId: req.body.data.eventComponentId,
            playerId: req.body.data.playerId,
        }

        if(typeof req.body.data.score === 'boolean') {
            scoreData.boolScore = req.body.data.score
            scoreData.stringScore = null
            scoreData.numberScore = null
            scoreData.dateScore = null
        }
        else if(typeof req.body.data.score === 'string') {
            scoreData.stringScore = req.body.data.score
            scoreData.boolScore = null
            scoreData.numberScore = null
            scoreData.dateScore = null
        }
        else if(typeof req.body.data.score === 'number') {
            scoreData.numberScore = req.body.data.score
            scoreData.boolScore = null
            scoreData.stringScore = null
            scoreData.dateScore = null
        }

        //checking data type from user
        assert(scoreData, Score)
        let insertedScore = await scoreService.upsertOne(scoreData);

        res.status(200).json({ message:insertedScore.message, data:insertedScore.data })
    }
    catch (err) {
        res.status(err.code || 500).json({message: err.message})
    }
})


export default router