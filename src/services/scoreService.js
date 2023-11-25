import db from '../database/dbConn.js'
import { assert } from 'superstruct'
import { Score } from '../structs/index.js'
import { isDateStringValid } from '../modules/dateValidator.js'


export default {
    async upsertOne(scoreData) {
        //checking the score type
        try {            
            const [rows] = await db.query('select type, rules from EventComponents where id=?', [scoreData.eventComponentId])
            console.log(rows[0].type, "- is the type")
            if (rows[0].type === 'shortstring' || rows[0].type === 'longstring')  {
                if(scoreData.stringScore == null) {
                    throw { code: 400, message: 'score value should be string' }
                }
            } else if (rows[0].type === 'number'){
                if(scoreData.numberScore == null) {
                    throw { code:400, message:'score value should be number' }
                } 
            } else if (rows[0].type === 'bool') {
                if(scoreData.boolScore == null) {
                    throw { code:400, message:'score value should be boolean' }
                }
            } else if (rows[0].type === 'datetime' || rows[0].type === 'date' || rows[0].type === 'timestamp') {
                if(scoreData.stringScore != null && isDateStringValid(scoreData.stringScore)) {
                    scoreData.dateScore = new Date(scoreData.stringScore)
                    scoreData.stringScore = null
                } else {
                    throw { code:400, message:'score value should be date' }
                }
            } else if (rows[0].type === 'select') {                
                if(scoreData.stringScore == null) {
                    throw { code:400, message:'score value for select should be string' }
                }
                let arrSelectOptions = JSON.parse(rows[0].rules)
                arrSelectOptions = arrSelectOptions.map(function(item) {
                    return item.toUpperCase();
                });

                // Check if the uppercase string is included in the uppercase array
                let isStringIncluded = arrSelectOptions.includes(scoreData.stringScore.toUpperCase());
                if (!isStringIncluded) {
                    throw { code:400, message:`The value must be : ${arrSelectOptions}` }
                }
                
            }
            
            assert(scoreData, Score)
        } catch(err) {
            throw { code:err.code || 400, message:`error during upsert: ${err.message}` };
        }

        //doing the upsert transaction
        let connection
        try {
            connection = await db.getConnection()
            await connection.beginTransaction()

            const [existingRecord] = await connection.query(
                `select * from Scores WHERE eventComponentId = ? and playerId = ?`
                ,[scoreData.eventComponentId, scoreData.playerId]    
            );

            if (existingRecord.length > 0) {
                await connection.query(`
                    UPDATE Scores 
                    SET stringScore=?, numberScore=?, boolScore=?, dateScore=?
                    where eventComponentId=? and playerId=? `
                    ,[
                        scoreData.stringScore, 
                        scoreData.numberScore, 
                        scoreData.boolScore, 
                        scoreData.dateScore,
                        scoreData.eventComponentId, 
                        scoreData.playerId
                    ]    
                )
                console.log('GOTO UPDATE')
            } else {
                await connection.query(`
                    insert into Scores(eventComponentId, playerId, stringScore, numberScore, boolScore, dateScore)
                    values(?, ?, ?, ?, ?, ?)`
                    ,[
                        scoreData.eventComponentId, 
                        scoreData.playerId, 
                        scoreData.stringScore, 
                        scoreData.numberScore, 
                        scoreData.boolScore,
                        scoreData.dateScore
                    ]   
                )
                console.log('GOTO INSERT')

            }

            await connection.commit()
            return { message: 'Upsert Successful', data: scoreData};
                        
        } catch (err) {
            // Rollback the transaction if an error occurs
            if (connection) {
                await connection.rollback();
            }
            throw { code:400, message:`error during upsert: ${err.message}` };
        
        } finally {
            // Release the connection back to the pool
            if (connection) {
                connection.release();
            }
        }
    }
}