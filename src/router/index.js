import express from 'express';
import authRouter from './authRouter.js'
import accountRouter from './accountRouter.js'
import eventGroupRouter from './eventGroupRouter.js'
import eventRouter from './eventRouter.js'
import eventComponentRouter from './eventComponentRouter.js'
import playerRouter from './playerRouter.js'
import scoreRouter from './scoreRouter.js'
import pinRouter from './pinRouter.js'



const router = express.Router()

router.use('/auth', authRouter)
router.use('/account', accountRouter)
router.use('/eventGroup', eventGroupRouter)
router.use('/event', eventRouter)
router.use('/eventComponent', eventComponentRouter)
router.use('/player', playerRouter)
router.use('/score', scoreRouter)
router.use('/pin', pinRouter)







export default router